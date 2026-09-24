import path from "node:path";

export type RockyConfig = {
  host: string;
  port: number;
  adminToken: string;
  authDirectory: string;
  routinesPath: string;
  agentTimeoutMs: number;
  allowedGroupId: string;
  projectRoot: string;
  googleClientId: string;
  googleClientSecret: string;
  googleRedirectUri: string;
  googleTokenPath: string;
  databasePath: string;
  googleTokenEncryptionKey: string;
  googleAllowedEmails: string[];
  googleOnlyPage: boolean;
};

const loopbackHosts = new Set(["127.0.0.1", "::1", "localhost"]);

export function loadConfig(
  environment: NodeJS.ProcessEnv = process.env,
  workingDirectory = process.cwd(),
): RockyConfig {
  const host = environment.ROCKY_HOST?.trim() || "127.0.0.1";
  const port = Number(environment.ROCKY_PORT || 3100);
  const adminToken = environment.ROCKY_ADMIN_TOKEN?.trim() || "";
  const authPath = environment.ROCKY_AUTH_DIR?.trim() || "data/whatsapp-auth";
  const routinesPath = environment.ROCKY_ROUTINES_PATH?.trim() || "data/routines.json";
  const agentTimeoutMs = Number(environment.ROCKY_AGENT_TIMEOUT_MS || 900_000);
  const allowedGroupId = environment.ROCKY_ALLOWED_GROUP_ID?.trim() || "";
  const projectRootPath = environment.ROCKY_PROJECT_ROOT?.trim() || "..";
  const googleClientId = environment.GOOGLE_CLIENT_ID?.trim() || "";
  const googleClientSecret = environment.GOOGLE_CLIENT_SECRET?.trim() || "";
  const googleRedirectUri =
    environment.GOOGLE_REDIRECT_URI?.trim() ||
    `http://localhost:${port}/api/integrations/google/callback`;
  const googleTokenPath = environment.GOOGLE_TOKEN_PATH?.trim() || "data/google-oauth.json";
  const databasePath = environment.ROCKY_DATABASE_PATH?.trim() || "data/rocky.sqlite";
  const googleTokenEncryptionKey =
    environment.ROCKY_TOKEN_ENCRYPTION_KEY?.trim() || googleClientSecret;
  const googleAllowedEmails = (environment.ROCKY_GOOGLE_ALLOWED_EMAILS || "")
    .split(/[;,]/)
    .map((email) => email.trim().toLocaleLowerCase("en-US"))
    .filter(Boolean);
  const googleOnlyPage =
    environment.ROCKY_GOOGLE_ONLY_PAGE?.trim().toLocaleLowerCase("en-US") === "true" ||
    environment.NODE_ENV?.trim().toLocaleLowerCase("en-US") === "production";

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("ROCKY_PORT debe ser un puerto válido entre 1 y 65535.");
  }

  if (!Number.isInteger(agentTimeoutMs) || agentTimeoutMs < 60_000 || agentTimeoutMs > 3_600_000) {
    throw new Error("ROCKY_AGENT_TIMEOUT_MS debe estar entre 60000 y 3600000 milisegundos.");
  }

  if (!loopbackHosts.has(host) && !adminToken) {
    throw new Error(
      "ROCKY_ADMIN_TOKEN es obligatorio cuando ROCKY_HOST se expone fuera de localhost.",
    );
  }

  return {
    host,
    port,
    adminToken,
    authDirectory: path.resolve(workingDirectory, authPath),
    routinesPath: path.resolve(workingDirectory, routinesPath),
    agentTimeoutMs,
    allowedGroupId,
    projectRoot: path.resolve(workingDirectory, projectRootPath),
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
    googleTokenPath: path.resolve(workingDirectory, googleTokenPath),
    databasePath: path.resolve(workingDirectory, databasePath),
    googleTokenEncryptionKey,
    googleAllowedEmails,
    googleOnlyPage,
  };
}
