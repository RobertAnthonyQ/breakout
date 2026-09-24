import assert from "node:assert/strict";
import test from "node:test";

import { loadConfig } from "../src/config.js";

test("usa localhost y el puerto 3100 de forma predeterminada", () => {
  const config = loadConfig({}, "/tmp/rocky-test");
  assert.equal(config.host, "127.0.0.1");
  assert.equal(config.port, 3100);
  assert.equal(config.authDirectory, "/tmp/rocky-test/data/whatsapp-auth");
  assert.equal(config.routinesPath, "/tmp/rocky-test/data/routines.json");
  assert.equal(config.databasePath, "/tmp/rocky-test/data/rocky.sqlite");
  assert.equal(config.agentTimeoutMs, 900_000);
  assert.equal(config.googleOnlyPage, false);
});

test("muestra solo Google en producción o cuando se fuerza desde configuración", () => {
  assert.equal(loadConfig({ NODE_ENV: "production" }, "/tmp/rocky-test").googleOnlyPage, true);
  assert.equal(
    loadConfig({ ROCKY_GOOGLE_ONLY_PAGE: "true" }, "/tmp/rocky-test").googleOnlyPage,
    true,
  );
});

test("normaliza la lista inicial de correos autorizados", () => {
  const config = loadConfig(
    { ROCKY_GOOGLE_ALLOWED_EMAILS: " Robert@Example.com, andrea@example.com " },
    "/tmp/rocky-test",
  );
  assert.deepEqual(config.googleAllowedEmails, ["robert@example.com", "andrea@example.com"]);
});

test("rechaza tiempos de ejecución peligrosamente cortos o largos", () => {
  assert.throws(
    () => loadConfig({ ROCKY_AGENT_TIMEOUT_MS: "1000" }, "/tmp/rocky-test"),
    /ROCKY_AGENT_TIMEOUT_MS/,
  );
  assert.throws(
    () => loadConfig({ ROCKY_AGENT_TIMEOUT_MS: "9999999" }, "/tmp/rocky-test"),
    /ROCKY_AGENT_TIMEOUT_MS/,
  );
});

test("exige token cuando el panel se expone fuera de localhost", () => {
  assert.throws(
    () => loadConfig({ ROCKY_HOST: "0.0.0.0" }, "/tmp/rocky-test"),
    /ROCKY_ADMIN_TOKEN/,
  );
});

test("acepta un host público cuando existe token", () => {
  const config = loadConfig(
    { ROCKY_HOST: "0.0.0.0", ROCKY_ADMIN_TOKEN: "secreto" },
    "/tmp/rocky-test",
  );
  assert.equal(config.host, "0.0.0.0");
  assert.equal(config.adminToken, "secreto");
});
