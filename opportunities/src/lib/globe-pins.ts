/**
 * Flagship opportunities pinned on the hero globe as hooks.
 * Every pin is a real catalog entry (checked by __tests__/globe-pins.test.ts).
 * `opportunityId` is there so the pins can open the detail modal once they become clickable.
 *
 * Placement is computed, not geographic: pins sit in latitude "lanes", spread evenly around
 * each lane, so every lane always has one pin facing the viewer. That keeps at least one card
 * per lane on screen at any point of the rotation, and lanes at different heights never collide.
 */
export interface GlobePin {
  opportunityId: string;
  headline: string;
  detail: string;
}

export const GLOBE_PINS: GlobePin[] = [
  { opportunityId: "opp-yc-w27", headline: "YC W27: postulaciones abiertas", detail: "$500K USD" },
  { opportunityId: "opp-12-mit-solve-global-challeng", headline: "MIT Solve", detail: "+$1M USD en premios" },
  { opportunityId: "opp-07-thiel-fellowship-2026-202", headline: "Thiel Fellowship", detail: "$250K USD equity-free" },
  { opportunityId: "opp-eth-student-summer-research-fellowship-201", headline: "Research fellowship en ETH", detail: "Zúrich" },
  { opportunityId: "opp-proinnovate-startup-peru", headline: "StartUp Perú 11G", detail: "S/ 60K no reembolsables" },
  { opportunityId: "opp-ethglobal-hackathon", headline: "ETHGlobal Hackathon", detail: "+$150K USD en premios" },
  { opportunityId: "opp-13-500-global-flagship-regio", headline: "500 Global", detail: "$150K USD" },
  { opportunityId: "opp-google-for-startups-latam", headline: "Google for Startups LatAm", detail: "$100K USD en créditos" },
  { opportunityId: "opp-cambridge-eraai-fellowship-23", headline: "Cambridge ERA:AI Fellowship", detail: "Research en IA · UK" },
  { opportunityId: "opp-03-techstars-accelerator", headline: "Techstars", detail: "$120K USD" },
  { opportunityId: "opp-openai-research-grant", headline: "OpenAI Research Grants", detail: "Hasta $50K USD" },
  { opportunityId: "opp-google-phd-fellowship-13", headline: "Google PhD Fellowship", detail: "Mountain View" },
  { opportunityId: "opp-18-platanus-ventures-batch-2", headline: "Platanus Ventures", detail: "$100K USD · LatAm" },
  { opportunityId: "opp-beca-de-posgrado-fulbright-14", headline: "Beca Fulbright", detail: "Posgrado en EE. UU." },
  { opportunityId: "opp-39-a16z-portfolio-tech-inter", headline: "Internships a16z", detail: "Hasta $175K USD al año" },
  { opportunityId: "opp-37-nvidia-x-ytu-ai-engineer-", headline: "NVIDIA AI Bootcamp", detail: "Gratis + certificación DLI" },
  { opportunityId: "opp-stanford-venture-fellowship-29", headline: "Stanford Venture Fellowship", detail: "Stanford, EE. UU." },
  { opportunityId: "opp-45-make-something-agents-wan", headline: "Hackathon de YC", detail: "+$10K USD en premios" },
  { opportunityId: "opp-santander-open-academy", headline: "Becas Santander Tech & AI", detail: "100% subvencionadas" },
  { opportunityId: "opp-cambridge-digital-minds-fellowship-47", headline: "Cambridge Digital Minds", detail: "Fellowship · UK" },
  { opportunityId: "opp-google-summer-of-code-38", headline: "Google Summer of Code", detail: "Remoto" },
  { opportunityId: "opp-mit-innovators-35", headline: "MIT Innovators Under 35", detail: "LatAm" },
  { opportunityId: "opp-stanford-code-in-place-26", headline: "Stanford Code in Place", detail: "Remoto" },
  { opportunityId: "opp-2026-caltech-ligo-summer-program-caltechmit-188", headline: "Caltech LIGO Summer", detail: "Research · Pasadena" },
];

export type Vec3 = [number, number, number];

/** Axis tilt toward the viewer (radians), like Earth's; northern lanes face the viewer more. */
export const BASE_TILT = 0.35;
/** A card shows once its pin's depth passes this; it hides again below CARD_HIDE_Z (hysteresis). */
export const CARD_SHOW_Z = 0.12;
export const CARD_HIDE_Z = 0.05;
export const MAX_CARDS = 7;

// Six lanes, shifted north because the tilt pushes the southern hemisphere away from the viewer
const LANE_LATITUDES = [58, 40, 22, 4, -14, -30];
const LANE_STAGGER = 40; // degrees, so lanes don't line up in vertical columns

export function pinPoint(index: number): Vec3 {
  const lane = index % LANE_LATITUDES.length;
  const slot = Math.floor(index / LANE_LATITUDES.length);
  const lat = (LANE_LATITUDES[lane] * Math.PI) / 180;
  const pinsPerLane = Math.ceil(GLOBE_PINS.length / LANE_LATITUDES.length);
  const lon = ((slot * (360 / pinsPerLane) + lane * LANE_STAGGER) * Math.PI) / 180;
  return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
}

/** Spin around the vertical axis, then tilt toward the viewer. z > 0 faces the viewer. */
export function rotator(spin: number, tilt: number) {
  const [cosS, sinS, cosT, sinT] = [Math.cos(spin), Math.sin(spin), Math.cos(tilt), Math.sin(tilt)];
  return ([x, y, z]: Vec3): Vec3 => {
    const [rx, rz] = [x * cosS + z * sinS, -x * sinS + z * cosS];
    return [rx, y * cosT - rz * sinT, y * sinT + rz * cosT];
  };
}
