import { createAdminServer } from "./admin/server.js";
import { RockyAgent } from "./agent/codex-agent.js";
import { loadConfig } from "./config.js";
import { GmailIntegration } from "./google/gmail.js";
import { RoutineStore } from "./routines/store.js";
import { StatusStore } from "./state.js";
import { WhatsAppClient } from "./whatsapp/client.js";
import { WorkspaceStore } from "./workspace/store.js";

function loadOptionalEnvFile(filePath: string): void {
  try {
    process.loadEnvFile?.(filePath);
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
    if (code !== "ENOENT") throw error;
  }
}

loadOptionalEnvFile(".env.local");
loadOptionalEnvFile(".env.google.local");

const config = loadConfig();
const status = new StatusStore();
const agent = new RockyAgent(config, status);
await agent.initialize();
const routines = new RoutineStore(config.routinesPath);
await routines.initialize();
const workspace = new WorkspaceStore(config.databasePath);
status.update({ agentThreadActive: agent.hasThread(config.allowedGroupId) });
const whatsapp = new WhatsAppClient(config, status, agent, routines, workspace);
const gmail = new GmailIntegration(config, workspace);
const server = createAdminServer(config, status, whatsapp, gmail, workspace);

server.listen(config.port, config.host, () => {
  console.log(`Rocky está disponible en http://${config.host}:${config.port}`);
  void whatsapp.start();
});

function shutdown(signal: string): void {
  console.log(`\n${signal}: cerrando Rocky...`);
  whatsapp.stop();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
