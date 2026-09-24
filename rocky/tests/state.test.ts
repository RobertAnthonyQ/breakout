import assert from "node:assert/strict";
import test from "node:test";

import { StatusStore } from "../src/state.js";

test("publica cambios de estado sin exponer el objeto interno", () => {
  const store = new StatusStore();
  let observed = "";
  const unsubscribe = store.subscribe((status) => {
    observed = status.phase;
  });

  store.update({ phase: "connected", phone: "51999999999" });
  unsubscribe();

  assert.equal(observed, "connected");
  assert.equal(store.get().phone, "51999999999");
  assert.deepEqual(store.get().groups, []);
});
