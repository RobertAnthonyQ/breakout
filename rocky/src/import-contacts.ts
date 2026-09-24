import { readFile } from "node:fs/promises";

import { loadConfig } from "./config.js";
import { type ContactInput, WorkspaceStore } from "./workspace/store.js";

async function main(): Promise<void> {
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error("Uso: node dist/import-contacts.js <contactos.json>");
  const payload = JSON.parse(await readFile(inputPath, "utf8")) as unknown;
  if (!Array.isArray(payload)) throw new Error("El archivo de importación debe contener una lista JSON.");

  const config = loadConfig();
  const store = new WorkspaceStore(config.databasePath);
  const result = store.upsertContacts(payload as ContactInput[]);
  process.stdout.write(`${JSON.stringify({ ...result, ...store.getContactSummary() })}\n`);
}

await main();
