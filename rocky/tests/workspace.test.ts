import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { WorkspaceStore } from "../src/workspace/store.js";

test("administra miembros y el progreso de una campaña", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "rocky-workspace-"));
  try {
    const store = new WorkspaceStore(path.join(directory, "rocky.sqlite"));
    store.addMember("Robert@Example.com", "Robert", "owner");
    store.addMember("andrea@example.com", "Andrea");
    assert.equal(store.listMembers().length, 2);
    assert.equal(store.getMember("robert@example.com")?.role, "owner");

    store.createCampaign("Open World", "Open World");
    store.assignCampaign("open-world", "robert@example.com", 80);
    store.assignCampaign("open-world", "andrea@example.com", 70);
    store.recordDraft("open-world", "robert@example.com", "draft-1");
    store.recordSent("open-world", "robert@example.com", "message-1");

    const campaign = store.getCampaign("open-world");
    assert.equal(campaign?.assignments.length, 2);
    assert.equal(campaign?.assignments.find((item) => item.email === "robert@example.com")?.status, "sent");
    assert.equal(campaign?.assignments.find((item) => item.email === "andrea@example.com")?.status, "pending");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rechaza asignar una campaña a alguien fuera del workspace", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "rocky-workspace-"));
  try {
    const store = new WorkspaceStore(path.join(directory, "rocky.sqlite"));
    store.addMember("owner@example.com", null, "owner");
    store.createCampaign("test", "Test");
    assert.throws(() => store.assignCampaign("test", "intruso@example.com"), /no pertenece/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
