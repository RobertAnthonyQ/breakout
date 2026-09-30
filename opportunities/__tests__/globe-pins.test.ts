import { describe, expect, test } from "bun:test";
import { BASE_TILT, CARD_SHOW_Z, GLOBE_PINS, pinPoint, rotator } from "../src/lib/globe-pins";
import opportunitiesData from "../data/opportunities.json";

const opportunities = (Array.isArray(opportunitiesData)
  ? opportunitiesData
  : (opportunitiesData as { opportunities: unknown[] }).opportunities) as { id: string }[];

describe("globe pins", () => {
  test("every pin points at a real opportunity in the catalog", () => {
    const ids = new Set(opportunities.map((o) => o.id));
    for (const pin of GLOBE_PINS) {
      expect(ids.has(pin.opportunityId)).toBe(true);
    }
  });

  test("pins are unique and have copy for the card", () => {
    const ids = GLOBE_PINS.map((pin) => pin.opportunityId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const pin of GLOBE_PINS) {
      expect(pin.headline.length).toBeGreaterThan(0);
      expect(pin.detail.length).toBeGreaterThan(0);
    }
  });

  test("pin points lie on the unit sphere", () => {
    GLOBE_PINS.forEach((_, index) => {
      const [x, y, z] = pinPoint(index);
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
    });
  });

  test("at least 6 cards face the viewer at every point of the rotation", () => {
    let fewest = Infinity;
    for (let step = 0; step < 720; step++) {
      const rotate = rotator((step / 720) * 2 * Math.PI, BASE_TILT);
      const facing = GLOBE_PINS.filter((_, index) => rotate(pinPoint(index))[2] > CARD_SHOW_Z).length;
      fewest = Math.min(fewest, facing);
    }
    expect(fewest).toBeGreaterThanOrEqual(6);
  });
});
