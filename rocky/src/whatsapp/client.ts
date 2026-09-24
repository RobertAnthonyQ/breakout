import { Boom } from "@hapi/boom";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import makeWASocket, {
  Browsers,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  normalizeMessageContent,
  useMultiFileAuthState,
  type proto,
  type WAMessage,
  type WASocket,
} from "@whiskeysockets/baileys";
import pino from "pino";
import QRCode from "qrcode";
import sharp from "sharp";

import { parseAgentEnvelope, type RockyAction } from "../actions/protocol.js";
import {
  AgentCancelledError,
  AgentTimeoutError,
  type GeneratedFile,
  type RockyAgent,
} from "../agent/codex-agent.js";
import { CommandHandler } from "../commands/handler.js";
import { parseRockyCommand } from "../commands/parser.js";
import type { RockyConfig } from "../config.js";
import { type Routine, type RoutineStore } from "../routines/store.js";
import { StatusStore, type WhatsAppGroup } from "../state.js";
import type { WorkspaceStore } from "../workspace/store.js";

const logger = pino({ level: process.env.ROCKY_LOG_LEVEL || "silent" });

function phoneFromJid(jid: string | undefined): string | null {
  if (!jid) return null;
  return jid.split(":")[0]?.split("@")[0] || null;
}

function normalizeJid(jid: string | null | undefined): string {
  return (jid || "").replace(/:\d+(?=@)/, "");
}

function messageDetails(message: proto.IMessage): {
  text: string;
  mentions: string[];
} {
  const content = normalizeMessageContent(message);
  const text =
    content?.conversation ||
    content?.extendedTextMessage?.text ||
    content?.imageMessage?.caption ||
    content?.videoMessage?.caption ||
    content?.documentMessage?.caption ||
    "";
  const context =
    content?.extendedTextMessage?.contextInfo ||
    content?.imageMessage?.contextInfo ||
    content?.videoMessage?.contextInfo ||
    content?.documentMessage?.contextInfo;

  return {
    text,
    mentions: (context?.mentionedJid || []).filter(
      (jid): jid is string => typeof jid === "string",
    ),
  };
}

function cleanPrompt(text: string): string {
  return text.replace(/@\S+/g, "").trim();
}

function splitForWhatsApp(text: string, maximumLength = 3_500): string[] {
  if (text.length <= maximumLength) return [text];
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > maximumLength) {
    const candidate = remaining.slice(0, maximumLength);
    const boundary = Math.max(candidate.lastIndexOf("\n"), candidate.lastIndexOf(" "));
    const end = boundary > maximumLength * 0.6 ? boundary : maximumLength;
    chunks.push(remaining.slice(0, end).trim());
    remaining = remaining.slice(end).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export class WhatsAppClient {
  private socket: WASocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private generation = 0;
  private stopped = false;
  private routineTimer: NodeJS.Timeout | null = null;
  private routineTickBusy = false;
  private readonly commands: CommandHandler;

  constructor(
    private readonly config: RockyConfig,
    private readonly status: StatusStore,
    private readonly agent: RockyAgent,
    private readonly routines: RoutineStore,
    private readonly workspace: WorkspaceStore,
  ) {
    this.commands = new CommandHandler(config, status, agent, routines, workspace);
  }

  async start(): Promise<void> {
    this.stopped = false;
    this.startRoutineLoop();
    await this.connect(false);
  }

  async reconnect(): Promise<void> {
    this.clearReconnectTimer();
    this.generation += 1;
    const previousSocket = this.socket;
    this.socket = null;
    previousSocket?.end(new Error("Reconexión solicitada desde el panel"));
    this.status.update({
      phase: "reconnecting",
      qrDataUrl: null,
      lastError: null,
    });
    await this.connect(true);
  }

  stop(): void {
    this.stopped = true;
    this.generation += 1;
    this.clearReconnectTimer();
    if (this.routineTimer) clearInterval(this.routineTimer);
    this.routineTimer = null;
    this.socket?.end(new Error("Rocky detenido"));
    this.socket = null;
  }

  async sendTestMessage(): Promise<void> {
    if (!this.socket || this.status.get().phase !== "connected") {
      throw new Error("WhatsApp no está conectado.");
    }
    if (!this.config.allowedGroupId) {
      throw new Error("No hay un grupo autorizado configurado.");
    }

    await this.socket.sendMessage(this.config.allowedGroupId, {
      text: "🧪 Rocky está conectado y ya puede responder menciones en este grupo.",
    });
    this.status.update({ lastResponseAt: new Date().toISOString() });
  }

  private async connect(isReconnect: boolean): Promise<void> {
    if (this.stopped || this.socket) return;

    const currentGeneration = ++this.generation;
    const current = this.status.get();
    this.status.update({
      phase: isReconnect ? "reconnecting" : "connecting",
      reconnectAttempt: isReconnect ? current.reconnectAttempt + 1 : 0,
      lastError: null,
    });

    try {
      const { state, saveCreds } = await useMultiFileAuthState(
        this.config.authDirectory,
      );

      const socket = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        browser: Browsers.ubuntu("Rocky"),
        logger,
        markOnlineOnConnect: false,
        syncFullHistory: false,
      });

      this.socket = socket;
      socket.ev.on("creds.update", saveCreds);
      socket.ev.on("messages.upsert", async ({ messages, type }) => {
        if (currentGeneration !== this.generation || type !== "notify") return;

        for (const message of messages) {
          if (
            !message.message ||
            message.key.fromMe ||
            message.key.remoteJid !== this.config.allowedGroupId
          ) {
            continue;
          }

          const { text, mentions } = messageDetails(message.message);
          const selfJids = new Set(
            [socket.user?.id, socket.user?.lid, socket.user?.phoneNumber]
              .filter((jid): jid is string => Boolean(jid))
              .map(normalizeJid),
          );
          const mentionsRocky = mentions.some((jid) => selfJids.has(normalizeJid(jid)));
          const namesRocky = /(^|\s)@~?rocky\b/i.test(text);

          if (!mentionsRocky && !namesRocky) continue;

          const now = new Date().toISOString();
          this.status.update({
            messagesSeen: this.status.get().messagesSeen + 1,
            lastMessageAt: now,
          });

          try {
            const prompt = cleanPrompt(text);
            const command = parseRockyCommand(prompt);
            if (command) {
              const commandResponse = await this.commands.execute(command.name, command.argument);
              await socket.sendMessage(
                this.config.allowedGroupId,
                { text: commandResponse },
                { quoted: message },
              );
              this.status.update({ lastResponseAt: new Date().toISOString() });
              continue;
            }

            await socket.sendPresenceUpdate("composing", this.config.allowedGroupId);
            try {
              const answer = await this.agent.respond(
                this.config.allowedGroupId,
                message.pushName || message.key.participant || "Integrante de Breakout",
                prompt || "Saluda brevemente al grupo.",
                async (progress) => {
                  await socket.sendMessage(
                    this.config.allowedGroupId,
                    { text: progress.text },
                    { quoted: message },
                  );
                },
              );
              const envelope = parseAgentEnvelope(answer.text);
              const actionMessages = await this.executeActions(
                socket,
                envelope.actions,
                message,
              );
              const visibleText = [envelope.text, ...actionMessages]
                .filter(Boolean)
                .join("\n\n");
              const chunks = splitForWhatsApp(
                visibleText || "Listo. La humanidad puede continuar con su agenda.",
              );
              for (const [index, chunk] of chunks.entries()) {
                await socket.sendMessage(
                  this.config.allowedGroupId,
                  { text: chunk },
                  index === 0 ? { quoted: message } : undefined,
                );
              }
              for (const file of this.deliverableFiles(answer.files).slice(0, 10)) {
                await this.sendGeneratedFile(socket, file);
              }
              this.status.update({ lastResponseAt: new Date().toISOString() });
            } finally {
              await socket.sendPresenceUpdate("paused", this.config.allowedGroupId);
            }
          } catch (error) {
            if (error instanceof AgentCancelledError) continue;
            const responseError = error instanceof Error ? error.message : String(error);
            this.status.update({ lastError: `No pude responder: ${responseError}` });
            await socket.sendPresenceUpdate("paused", this.config.allowedGroupId);
            await socket.sendMessage(
              this.config.allowedGroupId,
              {
                text:
                  error instanceof AgentTimeoutError
                    ? `⚠️ La tarea superó el límite de tiempo y fue detenida de forma segura: ${responseError}`
                    : "⚠️ No pude completar esa solicitud. Revisa el panel de Rocky para ver el error.",
              },
              { quoted: message },
            );
          }
        }
      });

      socket.ev.on("connection.update", async (update) => {
        if (currentGeneration !== this.generation) return;

        if (update.qr) {
          const qrDataUrl = await QRCode.toDataURL(update.qr, {
            errorCorrectionLevel: "M",
            margin: 2,
            width: 420,
          });
          this.status.update({
            phase: "waiting_for_qr",
            qrDataUrl,
            qrUpdatedAt: new Date().toISOString(),
            lastError: null,
          });
        }

        if (update.connection === "open") {
          this.clearReconnectTimer();
          this.status.update({
            phase: "connected",
            qrDataUrl: null,
            phone: phoneFromJid(socket.user?.id),
            lastConnectedAt: new Date().toISOString(),
            lastError: null,
            reconnectAttempt: 0,
          });
          await this.refreshGroups(socket);
        }

        if (update.connection === "close") {
          this.socket = null;
          const error = update.lastDisconnect?.error;
          const statusCode = error instanceof Boom ? error.output.statusCode : undefined;
          const loggedOut = statusCode === DisconnectReason.loggedOut;
          const message = error instanceof Error ? error.message : "Conexión cerrada";

          this.status.update({
            phase: loggedOut ? "logged_out" : "disconnected",
            qrDataUrl: null,
            phone: loggedOut ? null : this.status.get().phone,
            lastDisconnectedAt: new Date().toISOString(),
            lastError: message,
          });

          if (!loggedOut && !this.stopped) this.scheduleReconnect();
        }
      });
    } catch (error) {
      this.socket = null;
      const message = error instanceof Error ? error.message : String(error);
      this.status.update({ phase: "error", lastError: message });
      if (!this.stopped) this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    const attempt = this.status.get().reconnectAttempt + 1;
    const delay = Math.min(30_000, 2_000 * 2 ** Math.min(attempt - 1, 4));
    this.status.update({ phase: "reconnecting", reconnectAttempt: attempt });
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.connect(true);
    }, delay);
  }

  private async refreshGroups(socket: WASocket): Promise<void> {
    try {
      const metadata = await socket.groupFetchAllParticipating();
      const groups: WhatsAppGroup[] = Object.values(metadata)
        .map((group) => ({
          id: group.id,
          name: group.subject || "Grupo sin nombre",
          participants: group.participants.length,
          isCommunity: Boolean(group.isCommunity),
          isAnnouncement: Boolean(group.announce),
        }))
        .sort((left, right) => left.name.localeCompare(right.name, "es"));

      this.status.update({
        groups,
        groupsUpdatedAt: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn({ error: message }, "No se pudieron consultar los grupos");
    }
  }

  private async executeActions(
    socket: WASocket,
    actions: RockyAction[],
    quotedMessage?: WAMessage,
  ): Promise<string[]> {
    const messages: string[] = [];
    for (const action of actions.slice(0, 10)) {
      try {
        switch (action.type) {
          case "routine.create": {
            const routine = await this.routines.create({
              name: action.name,
              prompt: action.prompt,
              groupId: this.config.allowedGroupId,
              schedule: action.schedule,
            });
            messages.push(
              `🗓️ Rutina *${routine.name}* creada [\`${routine.id}\`]. Próxima: ${this.formatRoutineDate(routine.nextRunAt)}.`,
            );
            break;
          }
          case "routine.pause": {
            const routine = await this.routines.pause(
              action.routine,
              this.config.allowedGroupId,
            );
            messages.push(`⏸️ Rutina *${routine.name}* pausada.`);
            break;
          }
          case "routine.resume": {
            const routine = await this.routines.resume(
              action.routine,
              this.config.allowedGroupId,
            );
            messages.push(
              `▶️ Rutina *${routine.name}* reanudada. Próxima: ${this.formatRoutineDate(routine.nextRunAt)}.`,
            );
            break;
          }
          case "routine.delete": {
            const routine = await this.routines.remove(
              action.routine,
              this.config.allowedGroupId,
            );
            messages.push(`🗑️ Rutina *${routine.name}* eliminada.`);
            break;
          }
          case "whatsapp.poll": {
            const options = action.options.map((option) => option.trim()).filter(Boolean);
            if (options.length < 2 || options.length > 12) {
              throw new Error("Una encuesta necesita entre 2 y 12 opciones.");
            }
            const selectableCount = Math.max(
              1,
              Math.min(action.selectableCount || 1, options.length),
            );
            await socket.sendMessage(this.config.allowedGroupId, {
              poll: { name: action.question, values: options, selectableCount },
            });
            break;
          }
          case "whatsapp.location":
            await socket.sendMessage(this.config.allowedGroupId, {
              location: {
                degreesLatitude: action.latitude,
                degreesLongitude: action.longitude,
                name: action.name,
                address: action.address,
              },
            });
            break;
          case "whatsapp.contact": {
            const phone = action.phone.replace(/[^\d+]/g, "");
            const waid = phone.replace(/\D/g, "");
            const organization = action.organization
              ? `\nORG:${action.organization.replace(/\n/g, " ")}`
              : "";
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${action.fullName.replace(/\n/g, " ")}${organization}\nTEL;type=CELL;waid=${waid}:${phone}\nEND:VCARD`;
            await socket.sendMessage(this.config.allowedGroupId, {
              contacts: {
                displayName: action.displayName,
                contacts: [{ vcard }],
              },
            });
            break;
          }
          case "whatsapp.sticker": {
            const file = await this.resolveCreation(action.path);
            const sticker = await sharp(await readFile(file.absolutePath))
              .resize(512, 512, {
                fit: "contain",
                background: { r: 0, g: 0, b: 0, alpha: 0 },
              })
              .webp({ quality: 90 })
              .toBuffer();
            await socket.sendMessage(this.config.allowedGroupId, { sticker });
            break;
          }
          case "whatsapp.file": {
            const file = await this.resolveCreation(action.path);
            await this.sendGeneratedFile(socket, file, action.caption);
            break;
          }
          case "whatsapp.reaction":
            if (!quotedMessage) throw new Error("No hay mensaje al cual reaccionar.");
            await socket.sendMessage(this.config.allowedGroupId, {
              react: { text: action.emoji, key: quotedMessage.key },
            });
            break;
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        messages.push(`⚠️ No pude ejecutar \`${action.type}\`: ${reason}`);
      }
    }
    return messages;
  }

  private startRoutineLoop(): void {
    if (this.routineTimer) return;
    this.routineTimer = setInterval(() => void this.tickRoutines(), 15_000);
    this.routineTimer.unref();
  }

  private async tickRoutines(): Promise<void> {
    if (
      this.routineTickBusy ||
      !this.socket ||
      this.status.get().phase !== "connected" ||
      !this.config.allowedGroupId
    ) {
      return;
    }

    this.routineTickBusy = true;
    try {
      for (const routine of this.routines.due(this.config.allowedGroupId)) {
        await this.executeRoutine(this.socket, routine);
      }
    } finally {
      this.routineTickBusy = false;
    }
  }

  private async executeRoutine(socket: WASocket, routine: Routine): Promise<void> {
    await this.routines.markRunning(routine.id);
    await socket.sendMessage(this.config.allowedGroupId, {
      text: `⏰ Ejecutando rutina *${routine.name}* [\`${routine.id}\`]. Porque al parecer el tiempo humano tampoco se administra solo.`,
    });

    try {
      const answer = await this.agent.respond(
        this.config.allowedGroupId,
        "Rutina programada",
        `Ejecuta ahora la rutina "${routine.name}". No crees otra rutina ni cambies su programación. Tarea: ${routine.prompt}`,
        async (progress) => {
          await socket.sendMessage(this.config.allowedGroupId, { text: progress.text });
        },
      );
      const envelope = parseAgentEnvelope(answer.text);
      const actionMessages = await this.executeActions(socket, envelope.actions);
      const visibleText = [envelope.text, ...actionMessages].filter(Boolean).join("\n\n");
      for (const chunk of splitForWhatsApp(visibleText || "Rutina terminada.")) {
        await socket.sendMessage(this.config.allowedGroupId, { text: chunk });
      }
      for (const file of this.deliverableFiles(answer.files).slice(0, 10)) {
        await this.sendGeneratedFile(socket, file);
      }
      await this.routines.markFinished(routine.id, null);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      await this.routines.markFinished(routine.id, reason);
      await socket.sendMessage(this.config.allowedGroupId, {
        text: `⚠️ La rutina *${routine.name}* falló: ${reason}`,
      });
    }
  }

  private async resolveCreation(requestedPath: string): Promise<GeneratedFile> {
    const root = path.resolve(this.config.projectRoot, "BREAKOUT-CREACIONES");
    const candidate = path.isAbsolute(requestedPath)
      ? path.resolve(requestedPath)
      : path.resolve(this.config.projectRoot, requestedPath);
    if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
      throw new Error("Solo puedo enviar archivos de BREAKOUT-CREACIONES.");
    }

    const [realRoot, realCandidate] = await Promise.all([realpath(root), realpath(candidate)]);
    if (realCandidate !== realRoot && !realCandidate.startsWith(`${realRoot}${path.sep}`)) {
      throw new Error("La ruta solicitada sale de BREAKOUT-CREACIONES.");
    }
    return {
      absolutePath: realCandidate,
      relativePath: path.relative(realRoot, realCandidate),
    };
  }

  private formatRoutineDate(value: string | null): string {
    if (!value) return "sin próxima ejecución";
    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Lima",
    }).format(new Date(value));
  }

  private deliverableFiles(files: GeneratedFile[]): GeneratedFile[] {
    const pngStems = new Set(
      files
        .filter((file) => path.extname(file.relativePath).toLowerCase() === ".png")
        .map((file) => file.relativePath.slice(0, -path.extname(file.relativePath).length)),
    );
    return files.filter((file) => {
      const extension = path.extname(file.relativePath).toLowerCase();
      if (extension !== ".svg") return true;
      const stem = file.relativePath.slice(0, -extension.length);
      return !pngStems.has(stem);
    });
  }

  private clearReconnectTimer(): void {
    if (!this.reconnectTimer) return;
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }

  private async sendGeneratedFile(
    socket: WASocket,
    file: GeneratedFile,
    caption?: string,
  ): Promise<void> {
    const metadata = await stat(file.absolutePath);
    if (metadata.size > 50 * 1024 * 1024) {
      await socket.sendMessage(this.config.allowedGroupId, {
        text: `⚠️ No envié ${file.relativePath} porque supera los 50 MB.`,
      });
      return;
    }

    const contents = await readFile(file.absolutePath);
    const extension = path.extname(file.absolutePath).toLowerCase();
    const fileName = path.basename(file.absolutePath);
    const imageMimeTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    };
    const documentMimeTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".html": "text/html",
      ".htm": "text/html",
      ".svg": "image/svg+xml",
      ".txt": "text/plain",
      ".md": "text/markdown",
      ".csv": "text/csv",
      ".zip": "application/zip",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };

    const imageMimeType = imageMimeTypes[extension];
    if (imageMimeType) {
      await socket.sendMessage(this.config.allowedGroupId, {
        image: contents,
        mimetype: imageMimeType,
        caption: caption || `🎨 ${file.relativePath}`,
      });
      return;
    }

    await socket.sendMessage(this.config.allowedGroupId, {
      document: contents,
      mimetype: documentMimeTypes[extension] || "application/octet-stream",
      fileName,
      caption: caption || `📎 ${file.relativePath}`,
    });
  }

}
