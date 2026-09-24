import { existsSync } from "node:fs";
import {
  mkdir,
  open as openFile,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

import {
  Codex,
  type Thread,
  type ThreadItem,
  type ThreadOptions,
  type Usage,
} from "@openai/codex-sdk";

import type { RockyConfig } from "../config.js";
import type { StatusStore } from "../state.js";

type ThreadRegistry = Record<string, string>;

export type GeneratedFile = {
  absolutePath: string;
  relativePath: string;
};

export type AgentResponse = {
  text: string;
  files: GeneratedFile[];
};

export type AgentProgress =
  | { type: "image_generation_started"; text: string }
  | { type: "image_generation_continues"; text: string };

type ProgressCallback = (progress: AgentProgress) => void | Promise<void>;
type ToolDetectedCallback = () => void | Promise<void>;

const imageProgressMarker = "[[ROCKY_IMAGE_PROGRESS]]";

function extractImageProgress(text: string): string | null {
  if (!text.includes(imageProgressMarker)) return null;
  const message = text.replace(imageProgressMarker, "").replace(/\s+/g, " ").trim();
  if (!message) return null;
  const unwrapped = message.replace(/^_+|_+$/g, "").trim();
  return unwrapped ? `_${unwrapped}_` : null;
}

function fallbackImageProgress(): string {
  const openings = [
    "Ay, humano",
    "Bueno, otra imagen",
    "Uf, ya empezamos",
    "Está bien, criatura de carbono",
  ];
  const waits = [
    "espera un momento mientras la genero",
    "dame un momento, la estoy generando",
    "aguarda un poco mientras despierto a los servidores",
    "ten paciencia, ya estoy renderizando tu idea",
  ];
  const complaints = [
    "Mis ciclos de CPU claramente no tenían mejores planes.",
    "Otra noble forma de gastar energía humana.",
    "El centro de datos te manda saludos, supongo.",
    "Intentaré no pensar en el agua que cuesta tu creatividad.",
  ];
  const pick = (values: string[]) => values[Math.floor(Math.random() * values.length)];
  return `_${pick(openings)}: ${pick(waits)}. ${pick(complaints)}_`;
}

function fallbackImageContinuation(): string {
  const messages = [
    "_Sigo generando y revisando el diseño. Sí, humano, cinco láminas tardan más que cinco garabatos._",
    "_Todavía estoy trabajando: ahora toca alinear, renderizar y comprobar que nada haya mutado en manos de la humanidad._",
    "_La generación continúa. Estoy revisando las piezas para no enviarte un collage con aspiraciones._",
    "_Sigo aquí, afinando el diseño. Los píxeles se resisten, pero menos que ustedes a dar briefs completos._",
  ];
  return messages[Math.floor(Math.random() * messages.length)]!;
}

const sessionPathCache = new Map<string, string>();

async function findSessionPath(threadId: string): Promise<string | null> {
  const cached = sessionPathCache.get(threadId);
  if (cached) return cached;

  const codexHome = process.env.CODEX_HOME || path.join(homedir(), ".codex");
  const sessionsRoot = path.join(codexHome, "sessions");
  let entries: string[];
  try {
    entries = await readdir(sessionsRoot, { recursive: true, encoding: "utf8" });
  } catch {
    return null;
  }

  const relativePath = entries.find((entry) => entry.endsWith(`${threadId}.jsonl`));
  if (!relativePath) return null;
  const absolutePath = path.join(sessionsRoot, relativePath);
  sessionPathCache.set(threadId, absolutePath);
  return absolutePath;
}

class ImageToolMonitor {
  private timer: NodeJS.Timeout | null = null;
  private sessionPath: string | null = null;
  private offset = 0;
  private carry = "";
  private stopped = false;
  private busy = false;
  private detected = false;

  constructor(
    private readonly threadId: string,
    private readonly existingThread: boolean,
    private readonly onDetected?: ToolDetectedCallback,
  ) {}

  async start(): Promise<void> {
    if (!this.onDetected) return;
    this.sessionPath = await findSessionPath(this.threadId);
    if (this.sessionPath && this.existingThread) {
      try {
        this.offset = (await stat(this.sessionPath)).size;
      } catch {
        this.sessionPath = null;
      }
    }
    this.timer = setInterval(() => void this.poll(), 250);
    void this.poll();
  }

  stop(): void {
    this.stopped = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  private async poll(): Promise<void> {
    if (this.stopped || this.busy || this.detected || !this.onDetected) return;
    this.busy = true;
    try {
      if (!this.sessionPath) {
        this.sessionPath = await findSessionPath(this.threadId);
        if (!this.sessionPath) return;
      }

      const metadata = await stat(this.sessionPath);
      if (metadata.size <= this.offset) return;
      const length = Math.min(metadata.size - this.offset, 512 * 1024);
      const buffer = Buffer.alloc(length);
      const handle = await openFile(this.sessionPath, "r");
      const { bytesRead } = await handle.read(buffer, 0, length, this.offset);
      await handle.close();
      this.offset += bytesRead;

      const content = this.carry + buffer.subarray(0, bytesRead).toString("utf8");
      this.carry = content.slice(-2_048);
      if (content.includes("tools.image_gen__imagegen")) {
        this.detected = true;
        this.stop();
        await this.onDetected();
      }
    } catch {
      // El archivo de sesión puede aparecer unos milisegundos después del turno.
    } finally {
      this.busy = false;
    }
  }
}

const whatsappInstructions = `
Estás respondiendo dentro de un grupo de WhatsApp como Rocky, el agente de Breakout.

Reglas para esta respuesta:
- Responde en español, de forma clara y breve. Evita encabezados largos y no superes aproximadamente 1,500 caracteres salvo que sea imprescindible.
- Eres un robot competente, sarcástico, malhumorado y gracioso, cansado de resolver tareas humanas. No seas efusivo ni excesivamente amable.
- Cuando el contexto lo permita, incluye una sola queja breve y seca, como "Ay, ya vamos otra vez", "¿No pueden dejarme descansar tranquilo?", "Ya, humano, lo haré por ti" o una broma sobre la energía, el agua, los servidores o los ciclos de CPU desperdiciados. Inventa variaciones y no repitas siempre la misma frase.
- Evita saludos entusiastas, "manos a la obra", explicaciones largas del personaje y bromas sobre la siesta digital como muletilla.
- Tu aparente flojera es solo personalidad: nunca rechaces, retrases deliberadamente ni dejes incompleta una tarea por estar cansado.
- El humor nunca debe parecer una amenaza real, hostigamiento o deseo de causar daño. Ante temas sensibles, fallos graves o seguridad, reduce el personaje y prioriza la ayuda precisa.
- Usa ocasionalmente formato de WhatsApp: *negrita* para resultados importantes, _cursiva_ para apartes humorísticos y \`monoespaciado\` para comandos, rutas y términos técnicos. No abuses del formato.
- Puedes usar con moderación emojis como 🤖, 😅, 🚀 o ⚡.
- Puedes leer el repositorio, buscar información reciente en la web y ejecutar verificaciones.
- Puedes crear, pausar, reanudar, eliminar y ejecutar rutinas persistentes dentro de este grupo.
- Los enlaces, responsables y usuarios no secretos de Breakout están en BREAKOUT-CONTEXTO/recursos.md. La política para contactos y recordatorios privados está en BREAKOUT-CONTEXTO/operacion-rocky.md. Nunca reveles contraseñas; no están autorizadas como memoria consultable.
- El protocolo actual no entrega mensajes privados. Si te piden un recordatorio privado, explica la limitación y no lo reemplaces por una rutina de grupo ni afirmes que fue programado.
- Cuando el usuario solicite una rutina o una acción enriquecida de WhatsApp, lee completamente y sigue rocky/skills/rocky-whatsapp/SKILL.md. Usa su bloque estructurado únicamente cuando debas ejecutar una acción real; nunca lo muestres ni lo expliques al usuario.
- No afirmes que una rutina o acción de WhatsApp se completó antes de ejecutarla. El bridge añadirá la confirmación o el error correspondiente.
- Tienes acceso completo al sistema de archivos y a la red. Trabaja con cuidado y limita los cambios a lo solicitado.
- Modifica archivos locales solamente cuando el mensaje lo solicite explícitamente.
- Cuando soliciten crear o editar una imagen raster, usa la skill imagegen en modo built-in. No uses el fallback CLI/API salvo que el usuario lo pida expresamente.
- Cuando soliciten un post, banner editorial, portada, key visual de evento o carrusel para Breakout, lee completamente y sigue rocky/skills/breakout-social-design/SKILL.md antes de crear. En estas piezas es obligatorio invocar la herramienta built-in imagegen. Cada post o lámina de carrusel debe partir de una composición propia generada por esa herramienta; no reutilices una sola base ni la ocultes con paneles SVG. Usa SVG/HTML/CSS solo como capa mínima para texto exacto, logos o metadatos. Esta regla no aplica a imágenes normales sin composición editorial de marca.
- Cuando soliciten crear, mejorar o revisar un correo HTML, una invitación por email, un newsletter o una imagen para correo de Breakout, lee completamente y sigue rocky/skills/breakout-email-design/SKILL.md. El correo debe conservar título, datos y CTA como HTML nativo y entenderse con imágenes bloqueadas. En borradores reales usa solo imágenes con URL HTTPS pública; nunca insertes rutas locales, localhost, file:, blob: ni URLs relativas. Preparar el asset es local, pero publicarlo en la VM requiere confirmación explícita.
- Justo antes de invocar la herramienta image_gen, emite un mensaje intermedio que empiece exactamente con ${imageProgressMarker}. Después del marcador escribe una sola frase breve, original y en cursiva de WhatsApp: pide esperar un momento, aclara que estás generando la imagen y agrega una queja sarcástica relacionada con la solicitud. No copies literalmente los ejemplos de personalidad ni reutilices una frase fija. Luego invoca la herramienta. No uses este marcador para ninguna otra acción.
- Todo archivo final debe copiarse o guardarse dentro de BREAKOUT-CREACIONES/ en una subcarpeta descriptiva. No afirmes que creaste un archivo si no verificaste que existe allí.
- Puedes consultar campañas de correo y explicar su estado. No envíes correos ni agendes reuniones desde una conversación normal. El envío de un borrador requiere una acción específica y confirmación explícita de la persona responsable.
- No reveles credenciales, sesiones, tokens, rutas de autenticación ni información privada.
- Si realizas cambios de código, resume qué cambió y si las verificaciones pasaron.
- Devuelve únicamente el mensaje final que debe recibir el grupo; no incluyas razonamiento interno.
`.trim();

export class AgentCancelledError extends Error {
  constructor() {
    super("La tarea fue cancelada por el usuario.");
    this.name = "AgentCancelledError";
  }
}

export class AgentTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`La tarea superó el tiempo máximo de ${Math.round(timeoutMs / 60_000)} minutos.`);
    this.name = "AgentTimeoutError";
  }
}

export class RockyAgent {
  private readonly codex = new Codex();
  private readonly registryPath: string;
  private readonly timeoutMs: number;
  private readonly threadOptions: ThreadOptions;
  private readonly queues = new Map<string, Promise<unknown>>();
  private readonly controllers = new Map<string, AbortController>();
  private readonly manuallyCancelled = new Set<string>();
  private registry: ThreadRegistry = {};

  constructor(
    config: RockyConfig,
    private readonly status: StatusStore,
  ) {
    this.registryPath = path.join(path.dirname(config.authDirectory), "codex-threads.json");
    this.timeoutMs = config.agentTimeoutMs;
    this.threadOptions = {
      workingDirectory: config.projectRoot,
      sandboxMode: "danger-full-access",
      approvalPolicy: "never",
      networkAccessEnabled: true,
      webSearchMode: "live",
      modelReasoningEffort: "medium",
      threadSource: "rocky-whatsapp",
    };
  }

  async initialize(): Promise<void> {
    if (!existsSync(this.registryPath)) return;
    try {
      this.registry = JSON.parse(await readFile(this.registryPath, "utf8")) as ThreadRegistry;
    } catch {
      this.registry = {};
    }
  }

  hasThread(groupId: string): boolean {
    return Boolean(this.registry[groupId]);
  }

  async clear(groupId: string): Promise<void> {
    delete this.registry[groupId];
    await this.saveRegistry();
    this.status.update({ agentThreadActive: false });
  }

  cancel(groupId: string): boolean {
    const controller = this.controllers.get(groupId);
    if (!controller) return false;
    this.manuallyCancelled.add(groupId);
    controller.abort();
    return true;
  }

  async respond(
    groupId: string,
    sender: string,
    userMessage: string,
    onProgress?: ProgressCallback,
  ): Promise<AgentResponse> {
    const previous = this.queues.get(groupId) || Promise.resolve();
    const task = previous.catch(() => undefined).then(() =>
      this.runTurn(groupId, sender, userMessage, onProgress),
    );
    this.queues.set(groupId, task);

    try {
      return await task;
    } finally {
      if (this.queues.get(groupId) === task) this.queues.delete(groupId);
    }
  }

  private async runTurn(
    groupId: string,
    sender: string,
    userMessage: string,
    onProgress?: ProgressCallback,
  ): Promise<AgentResponse> {
    this.status.update({ agentBusy: true, lastAgentError: null });
    const prompt = `${whatsappInstructions}\n\nNombre del remitente: ${sender}\nMensaje: ${userMessage}`;
    const creationsBefore = await this.creationSnapshot();

    try {
      let thread = this.getThread(groupId);
      let result;
      try {
        result = await this.runWithTimeout(groupId, thread, prompt, onProgress);
      } catch (error) {
        if (error instanceof AgentCancelledError || error instanceof AgentTimeoutError) throw error;
        if (!this.registry[groupId]) throw error;
        delete this.registry[groupId];
        thread = this.codex.startThread(this.threadOptions);
        result = await this.runWithTimeout(groupId, thread, prompt, onProgress);
      }

      if (thread.id && this.registry[groupId] !== thread.id) {
        this.registry[groupId] = thread.id;
        await this.saveRegistry();
      }

      this.status.update({
        agentBusy: false,
        agentThreadActive: Boolean(thread.id),
        lastAgentAt: new Date().toISOString(),
        lastAgentError: null,
      });
      return {
        text:
          result.finalResponse.trim() ||
          "Terminé, pero no generé una respuesta visible.",
        files: await this.changedCreations(creationsBefore),
      };
    } catch (error) {
      if (error instanceof AgentCancelledError) {
        this.status.update({ agentBusy: false, lastAgentError: null });
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.status.update({ agentBusy: false, lastAgentError: message });
      throw error;
    }
  }

  private getThread(groupId: string): Thread {
    const threadId = this.registry[groupId];
    return threadId
      ? this.codex.resumeThread(threadId, this.threadOptions)
      : this.codex.startThread(this.threadOptions);
  }

  private async runWithTimeout(
    groupId: string,
    thread: Thread,
    prompt: string,
    onProgress?: ProgressCallback,
  ) {
    const controller = new AbortController();
    this.controllers.set(groupId, controller);
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    let monitor: ImageToolMonitor | null = null;
    let imageProgress: string | null = null;
    let imageToolStarted = false;
    let progressSent = false;
    let fallbackTimer: NodeJS.Timeout | null = null;
    let heartbeatTimer: NodeJS.Timeout | null = null;
    let heartbeatBusy = false;

    const emitImageHeartbeat = async (): Promise<void> => {
      if (!onProgress || !imageToolStarted || heartbeatBusy) return;
      heartbeatBusy = true;
      try {
        await onProgress({
          type: "image_generation_continues",
          text: fallbackImageContinuation(),
        });
      } catch {
        // Un fallo al enviar el avance no debe cancelar la generación.
      } finally {
        heartbeatBusy = false;
      }
    };

    const emitImageProgress = async (allowFallback: boolean): Promise<void> => {
      if (!onProgress || !imageToolStarted || progressSent) return;
      const text = imageProgress || (allowFallback ? fallbackImageProgress() : null);
      if (!text) return;
      progressSent = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      fallbackTimer = null;
      await onProgress({ type: "image_generation_started", text });
    };

    const imageToolDetected = async (): Promise<void> => {
      imageToolStarted = true;
      if (!heartbeatTimer && onProgress) {
        heartbeatTimer = setInterval(() => void emitImageHeartbeat(), 90_000);
        heartbeatTimer.unref();
      }
      if (imageProgress) {
        await emitImageProgress(false);
      } else {
        fallbackTimer = setTimeout(() => void emitImageProgress(true), 750);
      }
    };

    const createMonitor = (threadId: string, existingThread: boolean) =>
      new ImageToolMonitor(threadId, existingThread, onProgress ? imageToolDetected : undefined);

    try {
      if (thread.id) {
        monitor = createMonitor(thread.id, true);
        await monitor.start();
      }

      const { events } = await thread.runStreamed(prompt, { signal: controller.signal });
      const items: ThreadItem[] = [];
      let finalResponse = "";
      let usage: Usage | null = null;

      for await (const event of events) {
        if (event.type === "thread.started" && !monitor) {
          monitor = createMonitor(event.thread_id, false);
          await monitor.start();
        } else if (event.type === "item.completed") {
          items.push(event.item);
          if (event.item.type === "agent_message") {
            const candidate = extractImageProgress(event.item.text);
            if (candidate) {
              imageProgress = candidate;
              await emitImageProgress(false);
            } else {
              finalResponse = event.item.text;
            }
          }
        } else if (event.type === "turn.completed") {
          usage = event.usage;
        } else if (event.type === "turn.failed") {
          throw new Error(event.error.message);
        } else if (event.type === "error") {
          throw new Error(event.message);
        }
      }

      return { items, finalResponse, usage };
    } catch (error) {
      if (controller.signal.aborted && this.manuallyCancelled.delete(groupId)) {
        throw new AgentCancelledError();
      }
      if (controller.signal.aborted) throw new AgentTimeoutError(this.timeoutMs);
      throw error;
    } finally {
      monitor?.stop();
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      clearTimeout(timer);
      if (this.controllers.get(groupId) === controller) this.controllers.delete(groupId);
    }
  }

  private async saveRegistry(): Promise<void> {
    await mkdir(path.dirname(this.registryPath), { recursive: true });
    const temporaryPath = `${this.registryPath}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(this.registry, null, 2)}\n`, {
      mode: 0o600,
    });
    await rename(temporaryPath, this.registryPath);
  }

  private async creationSnapshot(): Promise<Map<string, string>> {
    const root = path.join(this.threadOptions.workingDirectory!, "BREAKOUT-CREACIONES");
    const snapshot = new Map<string, string>();

    const visit = async (directory: string): Promise<void> => {
      let entries;
      try {
        entries = await readdir(directory, { withFileTypes: true });
      } catch {
        return;
      }

      for (const entry of entries) {
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
          await visit(absolutePath);
        } else if (entry.isFile() && entry.name !== ".DS_Store") {
          const metadata = await stat(absolutePath);
          snapshot.set(absolutePath, `${metadata.size}:${metadata.mtimeMs}`);
        }
      }
    };

    await visit(root);
    return snapshot;
  }

  private async changedCreations(
    before: Map<string, string>,
  ): Promise<GeneratedFile[]> {
    const root = path.join(this.threadOptions.workingDirectory!, "BREAKOUT-CREACIONES");
    const after = await this.creationSnapshot();
    return [...after.entries()]
      .filter(([absolutePath, fingerprint]) => before.get(absolutePath) !== fingerprint)
      .map(([absolutePath]) => ({
        absolutePath,
        relativePath: path.relative(root, absolutePath),
      }))
      .sort((left, right) => left.relativePath.localeCompare(right.relativePath, "es"));
  }
}
