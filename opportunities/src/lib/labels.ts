import { Opportunity } from "../../types";

const CATEGORY_LABELS: Record<string, string> = {
  accelerator: "ACELERADORA",
  grant: "GRANT NO REEMBOLSABLE",
  hackathon: "HACKATHON",
  fellowship: "FELLOWSHIP",
  scholarship: "BECA & BOOTCAMP",
  internship: "PASANTÍA / EMPLEO",
  incubator: "INCUBADORA",
  contest: "CONCURSO",
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.toUpperCase();
}

export function getModalityLabel(modality: Opportunity["modality"]): string {
  if (modality === "remoto") return "REMOTO";
  if (modality === "hibrido") return "HÍBRIDO";
  return "PRESENCIAL";
}
