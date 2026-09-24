import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export type WorkspaceMember = {
  email: string;
  name: string | null;
  role: "owner" | "member";
  status: "invited" | "connected" | "disabled";
  connectedAt: string | null;
};

export type CampaignAssignmentStatus =
  | "pending"
  | "draft_created"
  | "reviewed"
  | "approved"
  | "sending"
  | "sent"
  | "failed"
  | "cancelled";

export type CampaignSummary = {
  slug: string;
  name: string;
  status: string;
  createdAt: string;
  assignments: Array<{
    email: string;
    name: string | null;
    status: CampaignAssignmentStatus;
    assignedRecipients: number;
    draftId: string | null;
    sentAt: string | null;
    error: string | null;
  }>;
};

type StoredConnection = {
  email: string;
  encryptedToken: string;
  scope: string;
  connectedAt: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLocaleLowerCase("en-US");
}

function validateEmail(email: string): string {
  const normalized = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error(`El correo no parece válido: ${email}`);
  }
  return normalized;
}

export class WorkspaceStore {
  private readonly database: DatabaseSync;

  constructor(databasePath: string) {
    mkdirSync(path.dirname(databasePath), { recursive: true });
    this.database = new DatabaseSync(databasePath);
    this.database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS workspace_members (
        email TEXT PRIMARY KEY,
        name TEXT,
        role TEXT NOT NULL DEFAULT 'member',
        status TEXT NOT NULL DEFAULT 'invited',
        created_at TEXT NOT NULL,
        connected_at TEXT
      );
      CREATE TABLE IF NOT EXISTS google_connections (
        email TEXT PRIMARY KEY REFERENCES workspace_members(email) ON DELETE CASCADE,
        encrypted_token TEXT NOT NULL,
        scope TEXT NOT NULL,
        connected_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS campaign_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
        member_email TEXT NOT NULL REFERENCES workspace_members(email),
        assigned_recipients INTEGER NOT NULL DEFAULT 0,
        gmail_draft_id TEXT,
        sent_message_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        draft_created_at TEXT,
        approved_at TEXT,
        sent_at TEXT,
        error TEXT,
        UNIQUE(campaign_id, member_email)
      );
    `);
  }

  bootstrapMembers(emails: string[]): void {
    for (const [index, rawEmail] of emails.entries()) {
      const email = validateEmail(rawEmail);
      this.addMember(email, null, index === 0 && this.memberCount() === 0 ? "owner" : "member");
    }
  }

  addMember(emailInput: string, name: string | null = null, role: "owner" | "member" = "member"): WorkspaceMember {
    const email = validateEmail(emailInput);
    const now = new Date().toISOString();
    this.database
      .prepare(`
        INSERT INTO workspace_members (email, name, role, status, created_at)
        VALUES (?, ?, ?, 'invited', ?)
        ON CONFLICT(email) DO UPDATE SET
          name = COALESCE(excluded.name, workspace_members.name),
          role = CASE WHEN workspace_members.role = 'owner' THEN 'owner' ELSE excluded.role END,
          status = CASE WHEN workspace_members.status = 'disabled' THEN 'invited' ELSE workspace_members.status END
      `)
      .run(email, name?.trim() || null, role, now);
    return this.getMember(email)!;
  }

  listMembers(): WorkspaceMember[] {
    return this.database
      .prepare(`
        SELECT email, name, role, status, connected_at AS connectedAt
        FROM workspace_members
        ORDER BY CASE role WHEN 'owner' THEN 0 ELSE 1 END, email
      `)
      .all() as WorkspaceMember[];
  }

  getMember(emailInput: string): WorkspaceMember | null {
    const email = normalizeEmail(emailInput);
    return (this.database
      .prepare(`SELECT email, name, role, status, connected_at AS connectedAt FROM workspace_members WHERE email = ?`)
      .get(email) as WorkspaceMember | undefined) ?? null;
  }

  isAllowed(emailInput: string): boolean {
    const member = this.getMember(emailInput);
    return Boolean(member && member.status !== "disabled");
  }

  hasMembers(): boolean {
    return this.memberCount() > 0;
  }

  saveConnection(emailInput: string, name: string | null, encryptedToken: string, scope: string, connectedAt: string): void {
    const email = validateEmail(emailInput);
    if (!this.hasMembers()) this.addMember(email, name, "owner");
    if (!this.isAllowed(email)) {
      throw new Error(`${email} no está autorizado en el workspace de Rocky.`);
    }
    this.database.exec("BEGIN IMMEDIATE");
    try {
      this.database
        .prepare(`UPDATE workspace_members SET name = COALESCE(?, name), status = 'connected', connected_at = ? WHERE email = ?`)
        .run(name?.trim() || null, connectedAt, email);
      this.database
        .prepare(`
          INSERT INTO google_connections (email, encrypted_token, scope, connected_at, updated_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(email) DO UPDATE SET encrypted_token = excluded.encrypted_token, scope = excluded.scope,
            connected_at = excluded.connected_at, updated_at = excluded.updated_at
        `)
        .run(email, encryptedToken, scope, connectedAt, new Date().toISOString());
      this.database.exec("COMMIT");
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }

  getConnection(emailInput: string): StoredConnection | null {
    const email = normalizeEmail(emailInput);
    return (this.database
      .prepare(`SELECT email, encrypted_token AS encryptedToken, scope, connected_at AS connectedAt FROM google_connections WHERE email = ?`)
      .get(email) as StoredConnection | undefined) ?? null;
  }

  listConnections(): StoredConnection[] {
    return this.database
      .prepare(`SELECT email, encrypted_token AS encryptedToken, scope, connected_at AS connectedAt FROM google_connections ORDER BY connected_at`)
      .all() as StoredConnection[];
  }

  createCampaign(slugInput: string, nameInput: string): CampaignSummary {
    const slug = slugInput.trim().toLocaleLowerCase("en-US").replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    const name = nameInput.trim();
    if (!slug || !name) throw new Error("La campaña necesita nombre y slug.");
    this.database
      .prepare(`INSERT INTO campaigns (slug, name, created_at) VALUES (?, ?, ?) ON CONFLICT(slug) DO UPDATE SET name = excluded.name`)
      .run(slug, name, new Date().toISOString());
    return this.getCampaign(slug)!;
  }

  assignCampaign(slug: string, emailInput: string, assignedRecipients = 0): CampaignSummary {
    const campaign = this.getCampaignRow(slug);
    if (!campaign) throw new Error(`No encontré la campaña ${slug}.`);
    const email = validateEmail(emailInput);
    if (!this.isAllowed(email)) throw new Error(`${email} no pertenece al workspace.`);
    this.database
      .prepare(`
        INSERT INTO campaign_assignments (campaign_id, member_email, assigned_recipients)
        VALUES (?, ?, ?)
        ON CONFLICT(campaign_id, member_email) DO UPDATE SET assigned_recipients = excluded.assigned_recipients
      `)
      .run(campaign.id, email, Math.max(0, Math.trunc(assignedRecipients)));
    return this.getCampaign(slug)!;
  }

  recordDraft(slug: string, emailInput: string, draftId: string): void {
    const campaign = this.getCampaignRow(slug);
    if (!campaign) throw new Error(`No encontré la campaña ${slug}.`);
    const result = this.database
      .prepare(`UPDATE campaign_assignments SET gmail_draft_id = ?, status = 'draft_created', draft_created_at = ?, error = NULL WHERE campaign_id = ? AND member_email = ?`)
      .run(draftId, new Date().toISOString(), campaign.id, normalizeEmail(emailInput));
    if (!result.changes) throw new Error("Primero asigna esa cuenta a la campaña.");
  }

  recordSent(slug: string, emailInput: string, messageId: string): void {
    const campaign = this.getCampaignRow(slug);
    if (!campaign) throw new Error(`No encontré la campaña ${slug}.`);
    const result = this.database
      .prepare(`UPDATE campaign_assignments SET sent_message_id = ?, status = 'sent', sent_at = ?, error = NULL WHERE campaign_id = ? AND member_email = ?`)
      .run(messageId, new Date().toISOString(), campaign.id, normalizeEmail(emailInput));
    if (!result.changes) throw new Error("No existe una asignación para esa cuenta.");
  }

  listCampaigns(): CampaignSummary[] {
    const rows = this.database.prepare(`SELECT slug FROM campaigns ORDER BY created_at DESC`).all() as Array<{ slug: string }>;
    return rows.map((row) => this.getCampaign(row.slug)!);
  }

  getCampaign(slugInput: string): CampaignSummary | null {
    const campaign = this.getCampaignRow(slugInput);
    if (!campaign) return null;
    const assignments = this.database
      .prepare(`
        SELECT a.member_email AS email, m.name, a.status, a.assigned_recipients AS assignedRecipients,
          a.gmail_draft_id AS draftId, a.sent_at AS sentAt, a.error
        FROM campaign_assignments a JOIN workspace_members m ON m.email = a.member_email
        WHERE a.campaign_id = ? ORDER BY m.email
      `)
      .all(campaign.id) as CampaignSummary["assignments"];
    return { slug: campaign.slug, name: campaign.name, status: campaign.status, createdAt: campaign.createdAt, assignments };
  }

  private memberCount(): number {
    return Number((this.database.prepare("SELECT COUNT(*) AS count FROM workspace_members").get() as { count: number }).count);
  }

  private getCampaignRow(slugInput: string): { id: number; slug: string; name: string; status: string; createdAt: string } | null {
    const slug = slugInput.trim().toLocaleLowerCase("en-US");
    return (this.database
      .prepare(`SELECT id, slug, name, status, created_at AS createdAt FROM campaigns WHERE slug = ?`)
      .get(slug) as { id: number; slug: string; name: string; status: string; createdAt: string } | undefined) ?? null;
  }
}
