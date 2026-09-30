import { describe, expect, test } from "bun:test";
import { BASE_PATH, withBasePath } from "../src/lib/base-path";

describe("withBasePath", () => {
  test("the hub is served under /opportunities (breakout.lat/opportunities)", () => {
    expect(BASE_PATH).toBe("/opportunities");
  });

  test("prefixes absolute app paths used by fetch and <img>", () => {
    expect(withBasePath("/api/opportunities")).toBe("/opportunities/api/opportunities");
    expect(withBasePath("/logo-breakout-white.png")).toBe("/opportunities/logo-breakout-white.png");
  });

  test("rejects relative paths instead of silently building a wrong URL", () => {
    expect(() => withBasePath("api/opportunities")).toThrow();
  });
});
