import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { Cron } from "croner";

export type RoutineStatus = "active" | "paused" | "running" | "completed";

export type RoutineSchedule =
  | { kind: "once"; at: string }
  | { kind: "cron"; expression: string; timezone: string };

export type Routine = {
  id: string;
  name: string;
  prompt: string;
  groupId: string;
  schedule: RoutineSchedule;
  status: RoutineStatus;
  createdAt: string;
  updatedAt: string;
  nextRunAt: string | null;
  lastRunAt: string | null;
  lastError: string | null;
  runCount: number;
};

type RoutineDatabase = {
  version: 1;
  routines: Routine[];
};

export type CreateRoutineInput = {
  name: string;
  prompt: string;
  groupId: string;
  schedule: RoutineSchedule;
};

export class RoutineStore {
  private database: RoutineDatabase = { version: 1, routines: [] };
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  async initialize(): Promise<void> {
    try {
      const parsed = JSON.parse(await readFile(this.filePath, "utf8")) as RoutineDatabase;
      if (parsed.version === 1 && Array.isArray(parsed.routines)) {
        this.database = parsed;
        let recovered = false;
        for (const routine of this.database.routines) {
          if (routine.status !== "running") continue;
          routine.status = "active";
          routine.nextRunAt = new Date().toISOString();
          routine.lastError = "La ejecución anterior fue interrumpida; se reintentará.";
          routine.updatedAt = new Date().toISOString();
          recovered = true;
        }
        if (recovered) await this.save();
      }
    } catch {
      this.database = { version: 1, routines: [] };
    }
  }

  list(groupId?: string): Routine[] {
    return this.database.routines
      .filter((routine) => !groupId || routine.groupId === groupId)
      .map((routine) => structuredClone(routine));
  }

  async create(input: CreateRoutineInput): Promise<Routine> {
    const now = new Date().toISOString();
    const nextRunAt = this.nextRun(input.schedule);
    if (!nextRunAt) throw new Error("La rutina no tiene una próxima ejecución válida.");

    const routine: Routine = {
      id: randomUUID().slice(0, 8),
      name: input.name.trim(),
      prompt: input.prompt.trim(),
      groupId: input.groupId,
      schedule: input.schedule,
      status: "active",
      createdAt: now,
      updatedAt: now,
      nextRunAt,
      lastRunAt: null,
      lastError: null,
      runCount: 0,
    };
    if (!routine.name || !routine.prompt) throw new Error("Nombre y tarea son obligatorios.");
    this.database.routines.push(routine);
    await this.save();
    return structuredClone(routine);
  }

  async pause(reference: string, groupId: string): Promise<Routine> {
    return this.updateStatus(reference, groupId, "paused");
  }

  async resume(reference: string, groupId: string): Promise<Routine> {
    const routine = this.find(reference, groupId);
    routine.nextRunAt = this.nextRun(routine.schedule);
    if (!routine.nextRunAt) throw new Error("La rutina ya no tiene una fecha futura válida.");
    routine.status = "active";
    routine.updatedAt = new Date().toISOString();
    routine.lastError = null;
    await this.save();
    return structuredClone(routine);
  }

  async remove(reference: string, groupId: string): Promise<Routine> {
    const routine = this.find(reference, groupId);
    this.database.routines = this.database.routines.filter((item) => item.id !== routine.id);
    await this.save();
    return structuredClone(routine);
  }

  due(groupId: string, now = new Date()): Routine[] {
    return this.database.routines
      .filter(
        (routine) =>
          routine.groupId === groupId &&
          routine.status === "active" &&
          routine.nextRunAt !== null &&
          new Date(routine.nextRunAt).getTime() <= now.getTime(),
      )
      .map((routine) => structuredClone(routine));
  }

  async markRunning(id: string): Promise<void> {
    const routine = this.findById(id);
    routine.status = "running";
    routine.updatedAt = new Date().toISOString();
    await this.save();
  }

  async markFinished(id: string, error: string | null): Promise<void> {
    const routine = this.findById(id);
    const now = new Date();
    routine.lastRunAt = now.toISOString();
    routine.lastError = error;
    routine.runCount += 1;
    routine.updatedAt = now.toISOString();

    if (routine.schedule.kind === "once") {
      routine.status = "completed";
      routine.nextRunAt = null;
    } else {
      routine.status = "active";
      routine.nextRunAt = this.nextRun(routine.schedule, now);
      if (!routine.nextRunAt) routine.status = "completed";
    }
    await this.save();
  }

  private async updateStatus(
    reference: string,
    groupId: string,
    status: RoutineStatus,
  ): Promise<Routine> {
    const routine = this.find(reference, groupId);
    routine.status = status;
    routine.updatedAt = new Date().toISOString();
    await this.save();
    return structuredClone(routine);
  }

  private find(reference: string, groupId: string): Routine {
    const normalized = reference.trim().toLocaleLowerCase("es");
    const matches = this.database.routines.filter(
      (routine) =>
        routine.groupId === groupId &&
        (routine.id.toLocaleLowerCase("es") === normalized ||
          routine.name.toLocaleLowerCase("es") === normalized),
    );
    if (!matches.length) throw new Error(`No encontré la rutina "${reference}".`);
    if (matches.length > 1) throw new Error(`Hay varias rutinas llamadas "${reference}"; usa el ID.`);
    return matches[0]!;
  }

  private findById(id: string): Routine {
    const routine = this.database.routines.find((item) => item.id === id);
    if (!routine) throw new Error(`No encontré la rutina ${id}.`);
    return routine;
  }

  private nextRun(schedule: RoutineSchedule, after = new Date()): string | null {
    if (schedule.kind === "once") {
      const date = new Date(schedule.at);
      if (Number.isNaN(date.getTime()) || date.getTime() <= after.getTime()) return null;
      return date.toISOString();
    }

    const cron = new Cron(schedule.expression, {
      timezone: schedule.timezone,
      paused: true,
    });
    return cron.nextRun(after)?.toISOString() || null;
  }

  private async save(): Promise<void> {
    this.writeQueue = this.writeQueue.then(async () => {
      await mkdir(path.dirname(this.filePath), { recursive: true });
      const temporaryPath = `${this.filePath}.tmp`;
      await writeFile(temporaryPath, `${JSON.stringify(this.database, null, 2)}\n`, {
        mode: 0o600,
      });
      await rename(temporaryPath, this.filePath);
    });
    await this.writeQueue;
  }
}
