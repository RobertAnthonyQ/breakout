import { describe, expect, test } from "bun:test";
import { suggestionInputSchema } from "../types";
import { buildSuggestionRecord, fromRow, SuggestionsUnavailableError, submitSuggestion } from "../src/lib/opportunities";

const TODAY = new Date(2026, 8, 29);

const validInput = {
  title: "Hackathon IA Lima 2026",
  organization: "Comunidad IA Perú",
  category: "hackathon",
  modality: "presencial",
  location: "Lima, Perú",
  funding_or_prize: "S/ 5,000 PEN",
  deadline: "2026-11-15",
  description: "Hackathon de 48 horas para construir productos con IA generativa.",
  eligibility: "Estudiantes universitarios en equipos de 3 a 5 personas.",
  application_url: "https://example.org/hackathon",
  tags: ["ia", "hackathon"],
};

describe("suggestionInputSchema", () => {
  test("accepts a complete suggestion", () => {
    expect(suggestionInputSchema.safeParse(validInput).success).toBe(true);
  });

  test("rejects non-http(s) links", () => {
    const result = suggestionInputSchema.safeParse({ ...validInput, application_url: "javascript:alert(1)" });
    expect(result.success).toBe(false);
  });

  test("rejects oversized fields so the table cannot be flooded", () => {
    expect(suggestionInputSchema.safeParse({ ...validInput, description: "x".repeat(5001) }).success).toBe(false);
    expect(suggestionInputSchema.safeParse({ ...validInput, tags: Array(21).fill("t") }).success).toBe(false);
  });

  test("rejects unknown categories and malformed dates", () => {
    expect(suggestionInputSchema.safeParse({ ...validInput, category: "crypto" }).success).toBe(false);
    expect(suggestionInputSchema.safeParse({ ...validInput, deadline: "15/11/2026" }).success).toBe(false);
  });

  test("strips fields a visitor must not control", () => {
    const parsed = suggestionInputSchema.parse({ ...validInput, verified: true, featured: true, status: "active" });
    expect(parsed).not.toHaveProperty("verified");
    expect(parsed).not.toHaveProperty("featured");
    expect(parsed).not.toHaveProperty("status");
  });
});

describe("buildSuggestionRecord", () => {
  test("always lands as an unverified community draft", () => {
    const record = buildSuggestionRecord(suggestionInputSchema.parse(validInput), TODAY);
    expect(record.status).toBe("draft");
    expect(record.source).toBe("community");
    expect(record.verified).toBe(false);
    expect(record.featured).toBe(false);
  });

  test("gets a unique id and slug even for repeated titles", () => {
    const input = suggestionInputSchema.parse(validInput);
    const a = buildSuggestionRecord(input, TODAY);
    const b = buildSuggestionRecord(input, TODAY);
    expect(a.slug.startsWith("hackathon-ia-lima-2026-")).toBe(true);
    expect(a.id).not.toBe(b.id);
    expect(a.slug).not.toBe(b.slug);
  });

  test("rejects deadlines that already passed", () => {
    const input = suggestionInputSchema.parse({ ...validInput, deadline: "2026-09-28" });
    expect(() => buildSuggestionRecord(input, TODAY)).toThrow();
  });
});

describe("fromRow", () => {
  test("maps database nulls to the optional fields the app expects", () => {
    const opportunity = fromRow({
      ...validInput,
      id: "opp-x",
      slug: "x",
      location: null,
      deadline_display: null,
      funding_or_prize: null,
      tags: null,
      featured: false,
      verified: true,
      status: "active",
      source: "catalog",
      created_at: "2026-09-29T20:00:00+00:00",
    });
    expect(opportunity.location).toBeUndefined();
    expect(opportunity.deadline_display).toBeUndefined();
    expect(opportunity.funding_or_prize).toBe("No especificado");
    expect(opportunity.tags).toEqual([]);
  });
});

describe("submitSuggestion without Supabase", () => {
  test("refuses instead of pretending to save", async () => {
    const saved = { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    try {
      await expect(submitSuggestion(validInput)).rejects.toBeInstanceOf(SuggestionsUnavailableError);
    } finally {
      if (saved.url) process.env.SUPABASE_URL = saved.url;
      if (saved.key) process.env.SUPABASE_SERVICE_ROLE_KEY = saved.key;
    }
  });
});

describe("toCatalogRecord", () => {
  test("every bundled opportunity satisfies the database constraints", async () => {
    const { toCatalogRecord } = await import("../src/lib/opportunities");
    const { default: data } = await import("../data/opportunities.json");
    const rows = (data as unknown[]).map((item) => toCatalogRecord(item));
    expect(rows.length).toBe((data as unknown[]).length);
    for (const row of rows) {
      expect(row.status).toBe("active");
      expect(row.source).toBe("catalog");
      expect(row.title.length).toBeGreaterThanOrEqual(3);
      expect(row.title.length).toBeLessThanOrEqual(200);
      expect(row.description.length).toBeLessThanOrEqual(5000);
      expect(row.application_url).toMatch(/^https?:\/\//i);
    }
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
    expect(new Set(rows.map((row) => row.slug)).size).toBe(rows.length);
  });
});
