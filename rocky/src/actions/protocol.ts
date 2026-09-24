import type { RoutineSchedule } from "../routines/store.js";

export type RockyAction =
  | {
      type: "routine.create";
      name: string;
      prompt: string;
      schedule: RoutineSchedule;
    }
  | { type: "routine.pause" | "routine.resume" | "routine.delete"; routine: string }
  | {
      type: "whatsapp.poll";
      question: string;
      options: string[];
      selectableCount?: number;
    }
  | {
      type: "whatsapp.location";
      latitude: number;
      longitude: number;
      name?: string;
      address?: string;
    }
  | {
      type: "whatsapp.contact";
      displayName: string;
      fullName: string;
      phone: string;
      organization?: string;
    }
  | { type: "whatsapp.sticker"; path: string }
  | { type: "whatsapp.file"; path: string; caption?: string }
  | { type: "whatsapp.reaction"; emoji: string };

export type AgentEnvelope = {
  text: string;
  actions: RockyAction[];
};

const actionsPattern = /\[\[ROCKY_ACTIONS\]\]([\s\S]*?)\[\[\/ROCKY_ACTIONS\]\]/g;

export function parseAgentEnvelope(input: string): AgentEnvelope {
  const actions: RockyAction[] = [];
  const text = input.replace(actionsPattern, (_match, json: string) => {
    try {
      const parsed = JSON.parse(json.trim()) as { actions?: unknown };
      if (Array.isArray(parsed.actions)) {
        for (const action of parsed.actions) {
          if (isRockyAction(action)) actions.push(action);
        }
      }
    } catch {
      // El bloque inválido se oculta; nunca se ejecuta parcialmente.
    }
    return "";
  });

  return { text: text.trim(), actions };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRockyAction(value: unknown): value is RockyAction {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  switch (value.type) {
    case "routine.create":
      return (
        typeof value.name === "string" &&
        typeof value.prompt === "string" &&
        isRecord(value.schedule) &&
        ((value.schedule.kind === "once" && typeof value.schedule.at === "string") ||
          (value.schedule.kind === "cron" &&
            typeof value.schedule.expression === "string" &&
            typeof value.schedule.timezone === "string"))
      );
    case "routine.pause":
    case "routine.resume":
    case "routine.delete":
      return typeof value.routine === "string";
    case "whatsapp.poll":
      return (
        typeof value.question === "string" &&
        Array.isArray(value.options) &&
        value.options.every((option) => typeof option === "string") &&
        (value.selectableCount === undefined || typeof value.selectableCount === "number")
      );
    case "whatsapp.location":
      return typeof value.latitude === "number" && typeof value.longitude === "number";
    case "whatsapp.contact":
      return (
        typeof value.displayName === "string" &&
        typeof value.fullName === "string" &&
        typeof value.phone === "string"
      );
    case "whatsapp.sticker":
    case "whatsapp.file":
      return typeof value.path === "string";
    case "whatsapp.reaction":
      return typeof value.emoji === "string";
    default:
      return false;
  }
}
