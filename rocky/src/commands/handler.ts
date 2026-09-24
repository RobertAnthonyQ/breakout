import { readdir, stat } from "node:fs/promises";
import path from "node:path";

import type { RockyAgent } from "../agent/codex-agent.js";
import type { RockyConfig } from "../config.js";
import type { Routine, RoutineStore } from "../routines/store.js";
import type { StatusStore } from "../state.js";
import type { RockyCommandName } from "./parser.js";
import type { WorkspaceStore } from "../workspace/store.js";

type Creation = {
  relativePath: string;
  modifiedAt: number;
};

const helpMessage = `🤖 *Comandos internos de Rocky*

• \`--help\` — muestra esta ayuda.
• \`--status\` — estado de WhatsApp y Codex.
• \`--clear\` — inicia una conversación nueva.
• \`--cancel\` — cancela la tarea en curso.
• \`--memory\` — resume la memoria temporal.
• \`--files\` — muestra creaciones recientes.
• \`--groups\` — muestra los grupos detectados.
• \`--routines\` — muestra rutinas activas, pausadas y completadas.
• \`--campaigns\` — lista las campañas de correo.
• \`--campaign <slug>\` — muestra quién tiene borrador y quién ya envió.
• \`--approve\` — aprueba una acción pendiente.
• \`--reject\` — rechaza una acción pendiente.

También funcionan en español: \`--ayuda\`, \`--estado\`, \`--limpiar\`, \`--cancelar\`, \`--memoria\`, \`--archivos\`, \`--grupos\`, \`--rutinas\`, \`--aprobar\` y \`--rechazar\`.`;

export class CommandHandler {
  constructor(
    private readonly config: RockyConfig,
    private readonly status: StatusStore,
    private readonly agent: RockyAgent,
    private readonly routines: RoutineStore,
    private readonly workspace: WorkspaceStore,
  ) {}

  async execute(name: RockyCommandName, argument?: string): Promise<string> {
    switch (name) {
      case "help":
        return helpMessage;
      case "status":
        return this.statusMessage();
      case "clear":
        this.agent.cancel(this.config.allowedGroupId);
        await this.agent.clear(this.config.allowedGroupId);
        return "🧹 Memoria temporal eliminada. La siguiente solicitud comenzará una conversación nueva.";
      case "cancel":
        return this.agent.cancel(this.config.allowedGroupId)
          ? "🛑 Solicitud de cancelación enviada."
          : "ℹ️ No hay ninguna tarea de Codex ejecutándose.";
      case "memory":
        return this.memoryMessage();
      case "files":
        return this.filesMessage();
      case "groups":
        return this.groupsMessage();
      case "routines":
        return this.routinesMessage();
      case "campaigns":
        return this.campaignsMessage();
      case "campaign":
        return this.campaignMessage(argument);
      case "approve":
      case "reject":
        return "ℹ️ No hay ninguna acción externa pendiente de confirmación.";
    }
  }

  private campaignsMessage(): string {
    const campaigns = this.workspace.listCampaigns();
    if (!campaigns.length) return "📨 No hay campañas registradas. Milagrosamente, nadie pidió correos todavía.";
    const lines = campaigns.slice(0, 15).map((campaign) => {
      const sent = campaign.assignments.filter((item) => item.status === "sent").length;
      return `• *${campaign.name}* [\`${campaign.slug}\`] — ${sent}/${campaign.assignments.length} enviados`;
    });
    return `📨 *Campañas de correo*\n${lines.join("\n")}\n\nConsulta una con \`--campaign <slug>\`.`;
  }

  private campaignMessage(slug?: string): string {
    if (!slug) return "ℹ️ Usa `--campaign <slug>`. Hasta los robots necesitan saber cuál campaña, humano.";
    const campaign = this.workspace.getCampaign(slug);
    if (!campaign) return `⚠️ No encontré la campaña \`${slug}\`.`;
    const labels = { pending: "⏳ pendiente", draft_created: "📝 borrador listo", reviewed: "👀 revisado", approved: "✅ aprobado", sending: "📤 enviando", sent: "✅ enviado", failed: "❌ error", cancelled: "🚫 cancelado" } as const;
    const lines = campaign.assignments.map((item) => {
      const detail = item.status === "sent" && item.sentAt ? ` · ${this.formatDate(item.sentAt)}` : "";
      const recipients = item.assignedRecipients ? ` · ${item.assignedRecipients} destinatarios` : "";
      return `• ${item.name || item.email} — ${labels[item.status]}${recipients}${detail}`;
    });
    const sentRecipients = campaign.assignments.filter((item) => item.status === "sent").reduce((total, item) => total + item.assignedRecipients, 0);
    const totalRecipients = campaign.assignments.reduce((total, item) => total + item.assignedRecipients, 0);
    return `📨 *${campaign.name}*\n${lines.length ? lines.join("\n") : "• Sin integrantes asignados"}\n\n*Progreso:* ${sentRecipients} de ${totalRecipients} destinatarios procesados.`;
  }

  private statusMessage(): string {
    const current = this.status.get();
    return `✅ *Estado de Rocky*
• WhatsApp: ${current.phase === "connected" ? "conectado" : current.phase}
• Codex: ${current.agentBusy ? "trabajando" : current.lastAgentError ? "con error" : "disponible"}
• Acceso de Codex: completo
• Memoria temporal: ${this.agent.hasThread(this.config.allowedGroupId) ? "activa" : "nueva"}
• Grupo autorizado: ${this.authorizedGroupName()}`;
  }

  private memoryMessage(): string {
    const current = this.status.get();
    return `🧠 *Memoria de Rocky*
• Thread compartido: ${this.agent.hasThread(this.config.allowedGroupId) ? "activo" : "todavía no creado"}
• Menciones procesadas desde el último reinicio: ${current.messagesSeen}
• Última ejecución: ${this.formatDate(current.lastAgentAt)}

Esta es memoria temporal de Codex. La memoria permanente todavía no está habilitada.`;
  }

  private async filesMessage(): Promise<string> {
    const creationsRoot = path.join(this.config.projectRoot, "BREAKOUT-CREACIONES");
    const files = await this.collectFiles(creationsRoot);
    if (!files.length) return "📂 No encontré archivos en BREAKOUT-CREACIONES.";

    const lines = files
      .sort((left, right) => right.modifiedAt - left.modifiedAt)
      .slice(0, 10)
      .map((file) => `• ${file.relativePath}`);
    return `📂 *Creaciones recientes*\n${lines.join("\n")}`;
  }

  private groupsMessage(): string {
    const groups = this.status.get().groups;
    if (!groups.length) return "👥 No se encontraron grupos disponibles.";
    const lines = groups.map((group) => {
      const authorized = group.id === this.config.allowedGroupId ? " ✅ autorizado" : "";
      return `• ${group.name} — ${group.participants} miembros${authorized}`;
    });
    return `👥 *Grupos detectados*\n${lines.join("\n")}`;
  }

  private routinesMessage(): string {
    const routines = this.routines.list(this.config.allowedGroupId);
    if (!routines.length) {
      return "🗓️ No hay rutinas guardadas. Por una vez, nadie programó trabajo futuro para el robot.";
    }

    const order: Record<Routine["status"], number> = {
      running: 0,
      active: 1,
      paused: 2,
      completed: 3,
    };
    const labels: Record<Routine["status"], string> = {
      running: "🔄 ejecutando",
      active: "✅ activa",
      paused: "⏸️ pausada",
      completed: "☑️ completada",
    };
    const lines = routines
      .sort((left, right) => order[left.status] - order[right.status])
      .slice(0, 20)
      .map((routine) => {
        const next = routine.nextRunAt ? ` · próxima: ${this.formatDate(routine.nextRunAt)}` : "";
        return `• *${routine.name}* [\`${routine.id}\`] — ${labels[routine.status]}${next}`;
      });
    return `🗓️ *Rutinas de Rocky*\n${lines.join("\n")}`;
  }

  private authorizedGroupName(): string {
    return (
      this.status.get().groups.find((group) => group.id === this.config.allowedGroupId)?.name ||
      "sin configurar"
    );
  }

  private formatDate(value: string | null): string {
    if (!value) return "—";
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Lima",
    }).format(new Date(value));
  }

  private async collectFiles(root: string, current = root): Promise<Creation[]> {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return [];
    }

    const results: Creation[] = [];
    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        results.push(...(await this.collectFiles(root, absolutePath)));
      } else if (entry.isFile() && entry.name !== ".DS_Store") {
        const metadata = await stat(absolutePath);
        results.push({
          relativePath: path.relative(root, absolutePath),
          modifiedAt: metadata.mtimeMs,
        });
      }
    }
    return results;
  }
}
