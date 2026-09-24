export type RockyCommandName =
  | "help"
  | "status"
  | "clear"
  | "cancel"
  | "memory"
  | "files"
  | "groups"
  | "routines"
  | "campaigns"
  | "campaign"
  | "approve"
  | "reject";

export type RockyCommand = {
  name: RockyCommandName;
  argument?: string;
} | null;

const aliases: Record<string, RockyCommandName> = {
  help: "help",
  ayuda: "help",
  status: "status",
  estado: "status",
  clear: "clear",
  limpiar: "clear",
  cancel: "cancel",
  cancelar: "cancel",
  memory: "memory",
  memoria: "memory",
  files: "files",
  archivos: "files",
  groups: "groups",
  grupos: "groups",
  routines: "routines",
  rutinas: "routines",
  campaigns: "campaigns",
  campanas: "campaigns",
  campañas: "campaigns",
  campaign: "campaign",
  campana: "campaign",
  campaña: "campaign",
  approve: "approve",
  aprobar: "approve",
  reject: "reject",
  rechazar: "reject",
};

export function parseRockyCommand(input: string): RockyCommand {
  const normalized = input
    .trim()
    .toLocaleLowerCase("es")
    .replace(/^[\u2012\u2013\u2014\u2212-]{1,2}\s*/, "--");

  const match = /^--([a-záéíóúñ]+)(?:\s+(.+))?$/.exec(normalized);
  const name = match?.[1] ? aliases[match[1]] : undefined;
  if (!name) return null;
  const argument = match?.[2]?.trim();
  return argument ? { name, argument } : { name };
}
