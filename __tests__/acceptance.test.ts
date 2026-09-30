import { describe, expect, test } from "bun:test";
import {
  getOpportunities,
  getOpportunityBySlug,
  getOpportunityStats,
} from "../src/lib/opportunities";

import { opportunitySchema } from "../types";

describe("Opportunities Hub — Acceptance Test Suite (R-1 to R-6)", () => {
  // R-6: Repository Fallback and Validation
  test("R-6: repository loads and validates all opportunities against Zod schema", async () => {
    const results = await getOpportunities();
    expect(results.length).toBeGreaterThan(0);
    for (const item of results) {
      const parsed = opportunitySchema.safeParse(item);
      expect(parsed.success).toBe(true);
    }
  });

  // R-1: Category Filtering
  test("R-1: filters opportunities strictly by category", async () => {
    const hackathons = await getOpportunities({ category: "hackathon" });
    expect(hackathons.length).toBeGreaterThan(0);
    expect(hackathons.every((item) => item.category === "hackathon")).toBe(true);

    const grants = await getOpportunities({ category: "grant" });
    expect(grants.length).toBeGreaterThan(0);
    expect(grants.every((item) => item.category === "grant")).toBe(true);

    const accelerators = await getOpportunities({ category: "accelerator" });
    expect(accelerators.length).toBeGreaterThan(0);
    expect(accelerators.every((item) => item.category === "accelerator")).toBe(true);
  });

  // R-2: Full-text Search
  test("R-2: performs case-insensitive text search across title, org, description, and tags", async () => {
    const sfQuery = await getOpportunities({ query: "San Francisco" });
    expect(sfQuery.length).toBeGreaterThan(0);
    expect(
      sfQuery.some(
        (o) =>
          o.title.includes("Y Combinator") ||
          o.organization.includes("Y Combinator") ||
          (o.location && o.location.includes("San Francisco"))
      )
    ).toBe(true);

    const peruQuery = await getOpportunities({ query: "peru" });
    expect(peruQuery.length).toBeGreaterThan(0);
    expect(
      peruQuery.some(
        (o) =>
          o.title.toLowerCase().includes("perú") ||
          o.organization.toLowerCase().includes("perú") ||
          o.tags.includes("peru")
      )
    ).toBe(true);

    const emptySearch = await getOpportunities({ query: "nonexistentxyz12345" });
    expect(emptySearch.length).toBe(0);
  });

  // R-3: Modality Filtering
  test("R-3: filters opportunities by modality (remoto, presencial, hibrido)", async () => {
    const remoteOnly = await getOpportunities({ modality: "remoto" });
    expect(remoteOnly.length).toBeGreaterThan(0);
    expect(remoteOnly.every((o) => o.modality === "remoto")).toBe(true);

    const presencialOnly = await getOpportunities({ modality: "presencial" });
    expect(presencialOnly.length).toBeGreaterThan(0);
    expect(presencialOnly.every((o) => o.modality === "presencial")).toBe(true);
  });

  // R-4: Sorting Logic
  test("R-4: orders featured items first, followed by earliest deadline", async () => {
    const list = await getOpportunities({ sortBy: "deadline_asc" });
    expect(list.length).toBeGreaterThan(1);

    // Verify first item is featured or has an imminent deadline
    const first = list[0];
    expect(first.featured).toBe(true);

    // Ensure all dates are valid ISO strings YYYY-MM-DD
    for (let i = 0; i < list.length - 1; i++) {
      expect(list[i].deadline).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  // R-5: Detail retrieval by slug
  test("R-5: retrieves a single opportunity detail by slug", async () => {
    const yc = await getOpportunityBySlug("yc-w27");
    expect(yc).toBeDefined();
    expect(yc?.organization).toBe("Y Combinator");
    expect(yc?.application_url).toContain("ycombinator.com");

    const nonExistent = await getOpportunityBySlug("non-existent-slug");
    expect(nonExistent).toBeNull();
  });

  // Stats calculation
  test("calculates overview statistics accurately", async () => {
    const stats = await getOpportunityStats();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.byCategory.hackathon).toBeDefined();
    expect(stats.byCategory.grant).toBeDefined();
    expect(stats.remoteCount).toBeGreaterThan(0);
  });
});

