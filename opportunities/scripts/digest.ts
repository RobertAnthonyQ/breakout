import { readFileSync } from "fs";
import { resolve } from "path";
import { opportunitySchema, type Opportunity } from "../types";

const dataPath = resolve(__dirname, "../data/opportunities.json");
const rawData = JSON.parse(readFileSync(dataPath, "utf-8"));

const opportunities: Opportunity[] = rawData.map((item: unknown) => {
  const result = opportunitySchema.safeParse(item);
  if (!result.success) {
    console.error("Invalid opportunity record:", result.error.format());
    process.exit(1);
  }
  return result.data;
});

// Sort by closest deadline
const sorted = [...opportunities].sort((a, b) => a.deadline.localeCompare(b.deadline));

console.log("==================================================================");
console.log("       BREAKOUT — DIGEST SEMANAL: MARTES DE OPORTUNIDADES");
console.log("==================================================================\n");

console.log("Total convocatorias activas:", sorted.length);
console.log("Fecha de corte:", new Date().toISOString().split("T")[0]);
console.log("\n------------------------------------------------------------------");
console.log("CONVOCATORIAS DESTACADAS (Para Guion de Video & IA Talks):");
console.log("------------------------------------------------------------------");

for (const opp of sorted) {
  const star = opp.featured ? "⭐ [DESTACADA] " : "";
  console.log(`\n• ${star}${opp.title.toUpperCase()} (${opp.organization})`);
  console.log(`  Categoría:      ${opp.category.toUpperCase()}`);
  console.log(`  Cierre límite:  ${opp.deadline}`);
  console.log(`  Premio/Fondo:   ${opp.funding_or_prize}`);
  console.log(`  Modalidad:      ${opp.modality.toUpperCase()}${opp.location ? ` - ${opp.location}` : ""}`);
  console.log(`  Postulación:    ${opp.application_url}`);
  console.log(`  Resumen breve:  ${opp.description}`);
}

console.log("\n==================================================================");
