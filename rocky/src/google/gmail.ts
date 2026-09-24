import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { readFile, unlink } from "node:fs/promises";

import type { RockyConfig } from "../config.js";
import type { WorkspaceStore } from "../workspace/store.js";

const GOOGLE_SCOPES = ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.compose"];
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const GMAIL_DRAFTS_URL = "https://gmail.googleapis.com/gmail/v1/users/me/drafts";
const GMAIL_PROFILE_URL = "https://gmail.googleapis.com/gmail/v1/users/me/profile";

type StoredToken = { accessToken: string; refreshToken: string; expiresAt: number; scope: string; tokenType: string; connectedAt: string };
type GoogleTokenResponse = { access_token?: string; refresh_token?: string; expires_in?: number; scope?: string; token_type?: string; error?: string; error_description?: string };
type DraftInput = { accountEmail?: string; to?: string; bcc?: string; subject: string; html: string };
type DraftResult = { id: string; messageId?: string; accountEmail: string };

export type GmailStatus = {
  configured: boolean;
  connected: boolean;
  accounts: Array<{ email: string; name: string | null; connectedAt: string | null }>;
  members: ReturnType<WorkspaceStore["listMembers"]>;
};

const normalizeEmail = (value: string) => value.trim().toLocaleLowerCase("en-US");
const cleanHeader = (value: string) => value.replace(/[\r\n]+/g, " ").trim();
const encodeSubject = (subject: string) => `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;

function cleanAddressList(value: string): string {
  const addresses = cleanHeader(value).split(/[;,]/).map((address) => address.trim()).filter(Boolean);
  for (const address of addresses) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) throw new Error(`El destinatario no parece válido: ${address}`);
  }
  return addresses.join(", ");
}

export class GmailIntegration {
  private readonly states = new Map<string, number>();
  private readonly encryptionKey: Buffer;
  private migrationAttempted = false;

  constructor(private readonly config: RockyConfig, private readonly workspace: WorkspaceStore) {
    this.encryptionKey = createHash("sha256").update(config.googleTokenEncryptionKey || "rocky-unconfigured").digest();
    this.workspace.bootstrapMembers(config.googleAllowedEmails);
  }

  isConfigured(): boolean {
    return Boolean(this.config.googleClientId && this.config.googleClientSecret && this.config.googleTokenEncryptionKey);
  }

  async getStatus(): Promise<GmailStatus> {
    await this.migrateLegacyToken();
    const connectedEmails = new Set(this.workspace.listConnections().map((item) => item.email));
    const members = this.workspace.listMembers();
    return {
      configured: this.isConfigured(),
      connected: connectedEmails.size > 0,
      accounts: members.filter((member) => connectedEmails.has(member.email)).map((member) => ({ email: member.email, name: member.name, connectedAt: member.connectedAt })),
      members,
    };
  }

  createAuthorizationUrl(): string {
    if (!this.isConfigured()) throw new Error("Configura GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y ROCKY_TOKEN_ENCRYPTION_KEY antes de conectar Gmail.");
    this.pruneStates();
    const state = randomBytes(24).toString("base64url");
    this.states.set(state, Date.now() + 10 * 60_000);
    const url = new URL(GOOGLE_AUTH_URL);
    url.searchParams.set("client_id", this.config.googleClientId);
    url.searchParams.set("redirect_uri", this.config.googleRedirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", GOOGLE_SCOPES.join(" "));
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("include_granted_scopes", "true");
    url.searchParams.set("prompt", "consent select_account");
    url.searchParams.set("state", state);
    return url.toString();
  }

  async completeAuthorization(code: string, state: string): Promise<string> {
    if (!this.consumeState(state)) throw new Error("El intento de conexión expiró o no es válido. Inicia la conexión nuevamente.");
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: this.config.googleClientId, client_secret: this.config.googleClientSecret, code, grant_type: "authorization_code", redirect_uri: this.config.googleRedirectUri }),
    });
    const payload = (await response.json()) as GoogleTokenResponse;
    if (!response.ok || !payload.access_token) throw new Error(payload.error_description || payload.error || "Google no devolvió un token válido.");

    const profileResponse = await fetch(GOOGLE_USERINFO_URL, { headers: { Authorization: `Bearer ${payload.access_token}` } });
    const profile = (await profileResponse.json()) as { email?: string; name?: string; error?: string };
    if (!profileResponse.ok || !profile.email) throw new Error(profile.error || "Google no devolvió el correo de la cuenta.");
    const email = normalizeEmail(profile.email);
    if (this.workspace.hasMembers() && !this.workspace.isAllowed(email)) throw new Error(`${email} no está invitado al workspace de Rocky.`);

    const previousConnection = this.workspace.getConnection(email);
    const previous = previousConnection ? this.decryptToken(previousConnection.encryptedToken) : null;
    const refreshToken = payload.refresh_token || previous?.refreshToken;
    if (!refreshToken) throw new Error("Google no devolvió un refresh token. Revoca el acceso anterior e inténtalo nuevamente.");
    const connectedAt = new Date().toISOString();
    const token: StoredToken = { accessToken: payload.access_token, refreshToken, expiresAt: Date.now() + (payload.expires_in ?? 3_600) * 1_000, scope: payload.scope || GOOGLE_SCOPES.join(" "), tokenType: payload.token_type || "Bearer", connectedAt };
    this.workspace.saveConnection(email, profile.name || null, this.encryptToken(token), token.scope, connectedAt);
    return email;
  }

  addMember(email: string, name?: string): ReturnType<WorkspaceStore["addMember"]> {
    return this.workspace.addMember(email, name || null);
  }

  async createDraft(input: DraftInput): Promise<DraftResult> {
    await this.migrateLegacyToken();
    const accountEmail = this.resolveAccountEmail(input.accountEmail);
    const subject = cleanHeader(input.subject);
    const to = cleanAddressList(input.to || "");
    const bcc = cleanAddressList(input.bcc || "");
    const html = input.html.trim();
    if (!subject) throw new Error("El asunto es obligatorio.");
    if (!html) throw new Error("El contenido HTML es obligatorio.");
    if (!to && !bcc) throw new Error("Agrega al menos un destinatario en Para o CCO.");
    const headers = [...(to ? [`To: ${to}`] : []), ...(bcc ? [`Bcc: ${bcc}`] : []), `Subject: ${encodeSubject(subject)}`, "MIME-Version: 1.0", 'Content-Type: text/html; charset="UTF-8"', "Content-Transfer-Encoding: 8bit"];
    const raw = Buffer.from(`${headers.join("\r\n")}\r\n\r\n${html}`, "utf8").toString("base64url");
    let accessToken = await this.getAccessToken(accountEmail);
    let response = await this.postDraft(accessToken, raw);
    if (response.status === 401) { accessToken = await this.refreshAccessToken(accountEmail, true); response = await this.postDraft(accessToken, raw); }
    const payload = (await response.json()) as { id?: string; message?: { id?: string }; error?: { message?: string } };
    if (!response.ok || !payload.id) throw new Error(payload.error?.message || "Gmail no pudo crear el borrador.");
    return { id: payload.id, messageId: payload.message?.id, accountEmail };
  }

  async sendDraft(accountEmailInput: string, draftId: string): Promise<{ messageId: string; accountEmail: string }> {
    const accountEmail = this.resolveAccountEmail(accountEmailInput);
    const cleanDraftId = cleanHeader(draftId);
    if (!cleanDraftId) throw new Error("Falta el ID del borrador.");
    let accessToken = await this.getAccessToken(accountEmail);
    let response = await this.postSendDraft(accessToken, cleanDraftId);
    if (response.status === 401) { accessToken = await this.refreshAccessToken(accountEmail, true); response = await this.postSendDraft(accessToken, cleanDraftId); }
    const payload = (await response.json()) as { id?: string; error?: { message?: string } };
    if (!response.ok || !payload.id) throw new Error(payload.error?.message || "Gmail no pudo enviar el borrador.");
    return { messageId: payload.id, accountEmail };
  }

  private resolveAccountEmail(requested?: string): string {
    const connections = this.workspace.listConnections();
    if (requested?.trim()) {
      const email = normalizeEmail(requested);
      if (!connections.some((connection) => connection.email === email)) throw new Error(`La cuenta ${email} no está conectada.`);
      return email;
    }
    if (connections.length === 1) return connections[0]!.email;
    if (!connections.length) throw new Error("Conecta una cuenta de Gmail antes de crear borradores.");
    throw new Error("Selecciona qué cuenta de Gmail debe crear el borrador.");
  }

  private postDraft(accessToken: string, raw: string): Promise<Response> {
    return fetch(GMAIL_DRAFTS_URL, { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ message: { raw } }) });
  }

  private postSendDraft(accessToken: string, draftId: string): Promise<Response> {
    return fetch(`${GMAIL_DRAFTS_URL}/send`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ id: draftId }) });
  }

  private async getAccessToken(email: string): Promise<string> {
    const connection = this.workspace.getConnection(email);
    if (!connection) throw new Error(`La cuenta ${email} no está conectada.`);
    const token = this.decryptToken(connection.encryptedToken);
    return token.expiresAt > Date.now() + 60_000 ? token.accessToken : this.refreshAccessToken(email, false);
  }

  private async refreshAccessToken(email: string, force: boolean): Promise<string> {
    const connection = this.workspace.getConnection(email);
    if (!connection) throw new Error(`La cuenta ${email} no está conectada.`);
    const token = this.decryptToken(connection.encryptedToken);
    if (!token.refreshToken) throw new Error("La conexión de Gmail no tiene refresh token.");
    if (!force && token.expiresAt > Date.now() + 60_000) return token.accessToken;
    const response = await fetch(GOOGLE_TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: this.config.googleClientId, client_secret: this.config.googleClientSecret, grant_type: "refresh_token", refresh_token: token.refreshToken }) });
    const payload = (await response.json()) as GoogleTokenResponse;
    if (!response.ok || !payload.access_token) throw new Error(payload.error_description || payload.error || "No se pudo renovar el acceso a Gmail.");
    const updated: StoredToken = { ...token, accessToken: payload.access_token, expiresAt: Date.now() + (payload.expires_in ?? 3_600) * 1_000, scope: payload.scope || token.scope, tokenType: payload.token_type || token.tokenType };
    this.workspace.saveConnection(email, this.workspace.getMember(email)?.name || null, this.encryptToken(updated), updated.scope, token.connectedAt);
    return updated.accessToken;
  }

  private encryptToken(token: StoredToken): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.encryptionKey, iv);
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(token), "utf8"), cipher.final()]);
    return [iv, cipher.getAuthTag(), encrypted].map((value) => value.toString("base64url")).join(".");
  }

  private decryptToken(value: string): StoredToken {
    const [ivValue, tagValue, encryptedValue] = value.split(".");
    if (!ivValue || !tagValue || !encryptedValue) throw new Error("El token guardado no tiene un formato válido.");
    const decipher = createDecipheriv("aes-256-gcm", this.encryptionKey, Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return JSON.parse(Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8")) as StoredToken;
  }

  private async migrateLegacyToken(): Promise<void> {
    if (this.migrationAttempted || this.workspace.listConnections().length) return;
    this.migrationAttempted = true;
    try {
      const token = JSON.parse(await readFile(this.config.googleTokenPath, "utf8")) as StoredToken;
      let accessToken = token.accessToken;
      if (token.expiresAt <= Date.now() + 60_000) {
        const response = await fetch(GOOGLE_TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: this.config.googleClientId, client_secret: this.config.googleClientSecret, grant_type: "refresh_token", refresh_token: token.refreshToken }) });
        const payload = (await response.json()) as GoogleTokenResponse;
        if (!response.ok || !payload.access_token) return;
        accessToken = payload.access_token; token.accessToken = accessToken; token.expiresAt = Date.now() + (payload.expires_in ?? 3_600) * 1_000;
      }
      const profileResponse = await fetch(GMAIL_PROFILE_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
      const profile = (await profileResponse.json()) as { emailAddress?: string };
      if (!profileResponse.ok || !profile.emailAddress) return;
      const email = normalizeEmail(profile.emailAddress);
      if (this.workspace.hasMembers() && !this.workspace.isAllowed(email)) return;
      this.workspace.saveConnection(email, null, this.encryptToken(token), token.scope, token.connectedAt);
      await unlink(this.config.googleTokenPath).catch(() => undefined);
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
      if (code !== "ENOENT") throw error;
    }
  }

  private consumeState(candidate: string): boolean {
    const expiresAt = this.states.get(candidate);
    if (!expiresAt || expiresAt < Date.now()) return false;
    this.states.delete(candidate);
    return true;
  }

  private pruneStates(): void {
    const now = Date.now();
    for (const [state, expiresAt] of this.states) if (expiresAt < now) this.states.delete(state);
  }
}
