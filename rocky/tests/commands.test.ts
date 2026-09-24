import assert from "node:assert/strict";
import test from "node:test";

import { parseRockyCommand } from "../src/commands/parser.js";

test("reconoce comandos con dos guiones normales", () => {
  assert.deepEqual(parseRockyCommand("--status"), { name: "status" });
  assert.deepEqual(parseRockyCommand("--clear"), { name: "clear" });
});

test("reconoce comandos corregidos por WhatsApp con raya larga o media", () => {
  assert.deepEqual(parseRockyCommand("—status"), { name: "status" });
  assert.deepEqual(parseRockyCommand("–clear"), { name: "clear" });
  assert.deepEqual(parseRockyCommand("— status"), { name: "status" });
});

test("no confunde una consulta normal con un comando", () => {
  assert.equal(parseRockyCommand("dime el status del proyecto"), null);
});

test("acepta el slug al consultar una campaña", () => {
  assert.deepEqual(parseRockyCommand("--campaign open-world"), {
    name: "campaign",
    argument: "open-world",
  });
  assert.deepEqual(parseRockyCommand("--campaña open-world"), {
    name: "campaign",
    argument: "open-world",
  });
});

test("reconoce todos los comandos y sus alias en español", () => {
  const expected = [
    ["--help", "help"], ["--ayuda", "help"],
    ["--cancel", "cancel"], ["--cancelar", "cancel"],
    ["--memory", "memory"], ["--memoria", "memory"],
    ["--files", "files"], ["--archivos", "files"],
    ["--groups", "groups"], ["--grupos", "groups"],
    ["--routines", "routines"], ["--rutinas", "routines"],
    ["--approve", "approve"], ["--aprobar", "approve"],
    ["--reject", "reject"], ["--rechazar", "reject"],
  ] as const;

  for (const [input, name] of expected) {
    assert.deepEqual(parseRockyCommand(input), { name });
  }
});
