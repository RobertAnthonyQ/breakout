import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { RoutineStore } from "../src/routines/store.js";

test("persiste y administra una rutina de ejecución única", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "rocky-routines-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const databasePath = path.join(directory, "routines.json");
  const store = new RoutineStore(databasePath);
  await store.initialize();

  const at = new Date(Date.now() + 60_000).toISOString();
  const routine = await store.create({
    name: "Prueba",
    prompt: "Publica el resultado de prueba",
    groupId: "test@g.us",
    schedule: { kind: "once", at },
  });

  assert.equal(store.list("test@g.us").length, 1);
  assert.equal((await store.pause(routine.id, "test@g.us")).status, "paused");
  assert.equal((await store.resume(routine.id, "test@g.us")).status, "active");
  await store.markRunning(routine.id);
  await store.markFinished(routine.id, null);

  const completed = store.list("test@g.us")[0];
  assert.equal(completed?.status, "completed");
  assert.equal(completed?.runCount, 1);
  assert.equal(completed?.nextRunAt, null);
  assert.match(await readFile(databasePath, "utf8"), /"version": 1/);
});

test("calcula la próxima ejecución de una rutina cron", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "rocky-cron-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const store = new RoutineStore(path.join(directory, "routines.json"));
  await store.initialize();

  const routine = await store.create({
    name: "Cada hora",
    prompt: "Comprueba el estado",
    groupId: "test@g.us",
    schedule: { kind: "cron", expression: "0 * * * *", timezone: "America/Lima" },
  });

  assert.equal(routine.status, "active");
  assert.ok(routine.nextRunAt);
  assert.ok(new Date(routine.nextRunAt).getTime() > Date.now());
});
