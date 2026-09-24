import assert from "node:assert/strict";
import test from "node:test";

import { parseAgentEnvelope } from "../src/actions/protocol.js";

test("separa el texto visible de acciones válidas", () => {
  const result = parseAgentEnvelope(`Ya, humano, programaré tu resumen.
[[ROCKY_ACTIONS]]
{"actions":[{"type":"routine.create","name":"Resumen","prompt":"Publica un resumen","schedule":{"kind":"cron","expression":"0 9 * * 1","timezone":"America/Lima"}},{"type":"whatsapp.poll","question":"¿Vamos?","options":["Sí","No"],"selectableCount":1}]}
[[/ROCKY_ACTIONS]]`);

  assert.equal(result.text, "Ya, humano, programaré tu resumen.");
  assert.equal(result.actions.length, 2);
  assert.equal(result.actions[0]?.type, "routine.create");
  assert.equal(result.actions[1]?.type, "whatsapp.poll");
});

test("oculta bloques inválidos y no ejecuta acciones parciales", () => {
  const result = parseAgentEnvelope(
    "Texto visible\n[[ROCKY_ACTIONS]]{esto no es json}[[/ROCKY_ACTIONS]]",
  );

  assert.equal(result.text, "Texto visible");
  assert.deepEqual(result.actions, []);
});

test("ignora tipos desconocidos", () => {
  const result = parseAgentEnvelope(
    '[[ROCKY_ACTIONS]]{"actions":[{"type":"whatsapp.destroy_everything"}]}[[/ROCKY_ACTIONS]]',
  );

  assert.deepEqual(result.actions, []);
});
