import { describe, expect, test } from "bun:test";
import { daysUntil, formatLongDate, getDeadlineBadge } from "../src/lib/deadline";

// Fixed "today" so the suite never depends on the real clock.
const TODAY = new Date(2026, 8, 29, 17, 30); // Tue 29 Sep 2026, local time

describe("daysUntil", () => {
  test("same calendar day is 0 regardless of the hour", () => {
    expect(daysUntil("2026-09-29", TODAY)).toBe(0);
    expect(daysUntil("2026-09-29", new Date(2026, 8, 29, 23, 59))).toBe(0);
  });

  test("counts whole calendar days forward and backward", () => {
    expect(daysUntil("2026-09-30", TODAY)).toBe(1);
    expect(daysUntil("2026-10-02", TODAY)).toBe(3);
    expect(daysUntil("2026-09-28", TODAY)).toBe(-1);
  });

  test("crosses a month and a year boundary", () => {
    expect(daysUntil("2026-10-29", TODAY)).toBe(30);
    expect(daysUntil("2027-01-01", TODAY)).toBe(94);
  });

  test("returns null for a malformed date", () => {
    expect(daysUntil("31/01/2026", TODAY)).toBeNull();
    expect(daysUntil("", TODAY)).toBeNull();
  });
});

describe("getDeadlineBadge", () => {
  test("closing today and tomorrow are urgent with human wording", () => {
    expect(getDeadlineBadge("2026-09-29", undefined, TODAY)).toEqual({ state: "urgent", label: "CIERRA HOY" });
    expect(getDeadlineBadge("2026-09-30", undefined, TODAY)).toEqual({ state: "urgent", label: "CIERRA MAÑANA" });
  });

  test("within 7 days is urgent and counts days", () => {
    expect(getDeadlineBadge("2026-10-02", undefined, TODAY)).toEqual({ state: "urgent", label: "CIERRA EN 3 DÍAS" });
    expect(getDeadlineBadge("2026-10-06", undefined, TODAY).state).toBe("urgent");
  });

  test("8 to 30 days is soon, beyond is open, both show the date", () => {
    expect(getDeadlineBadge("2026-10-07", undefined, TODAY)).toEqual({ state: "soon", label: "CIERRA 7 OCT" });
    expect(getDeadlineBadge("2026-10-29", undefined, TODAY).state).toBe("soon");
    expect(getDeadlineBadge("2026-10-30", undefined, TODAY)).toEqual({ state: "open", label: "CIERRA 30 OCT" });
  });

  test("past deadlines are closed", () => {
    expect(getDeadlineBadge("2026-09-28", undefined, TODAY)).toEqual({ state: "closed", label: "CERRÓ 28 SET" });
  });

  test("rolling wording in the display text wins over the date", () => {
    expect(getDeadlineBadge("2026-12-31", "Rolling", TODAY)).toEqual({ state: "rolling", label: "ABIERTA TODO EL AÑO" });
    expect(getDeadlineBadge("2026-12-31", "Sin deadline", TODAY).state).toBe("rolling");
    expect(getDeadlineBadge("2026-12-31", "Convocatoria abierta", TODAY).state).toBe("rolling");
  });

  test("unparseable dates fall back to open with the raw text", () => {
    expect(getDeadlineBadge("pronto", undefined, TODAY)).toEqual({ state: "open", label: "PRONTO" });
  });
});

describe("formatLongDate", () => {
  test("spells the month out in Spanish (Peru uses setiembre)", () => {
    expect(formatLongDate("2026-09-29")).toBe("29 de setiembre de 2026");
    expect(formatLongDate("2027-01-05")).toBe("5 de enero de 2027");
  });

  test("returns the input untouched when it is not an ISO date", () => {
    expect(formatLongDate("Rolling")).toBe("Rolling");
  });
});
