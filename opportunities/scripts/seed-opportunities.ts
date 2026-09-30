import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { opportunitySchema, type Opportunity, type OpportunityCategory, type OpportunityModality } from "../types";

/**
 * CSV Parser supporting quoted fields and multiline entries
 */
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let current = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === "\"" && inQuotes && nextChar === "\"") {
      current += "\"";
      i++;
    } else if (char === "\"") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      row.push(current.trim());
      if (row.length > 1 || row[0] !== "") lines.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.length > 1 || row[0] !== "") lines.push(row);
  }
  return lines;
}

/**
 * Helper to slugify a string
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/**
 * Helper to parse deadline dates into ISO YYYY-MM-DD
 */
function parseDeadlineDate(raw: string, defaultDate: string = "2026-12-31"): { iso: string; display?: string } {
  if (!raw || raw.trim().length === 0) {
    return { iso: defaultDate, display: "Rolling / Abierto continuo" };
  }

  const clean = raw.trim();

  // If already standard ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return { iso: clean, display: clean };
  }

  const lower = clean.toLowerCase();

  // Specific well-known extracted deadlines
  if (lower.includes("29 de setiembre") || lower.includes("29 de septiembre")) {
    return { iso: "2026-09-29", display: clean };
  }
  if (lower.includes("02 de octubre") || lower.includes("2 de octubre")) {
    return { iso: "2026-10-02", display: clean };
  }
  if (lower.includes("05 de octubre") || lower.includes("5 de octubre")) {
    return { iso: "2026-10-05", display: clean };
  }
  if (lower.includes("16 de octubre")) {
    return { iso: "2026-10-16", display: clean };
  }
  if (lower.includes("30 de octubre") || lower.includes("31 de octubre")) {
    return { iso: "2026-10-31", display: clean };
  }
  if (lower.includes("14 de noviembre") || lower.includes("15 de noviembre")) {
    return { iso: "2026-11-15", display: clean };
  }
  if (lower.includes("30 de noviembre")) {
    return { iso: "2026-11-30", display: clean };
  }
  if (lower.includes("03 de diciembre") || lower.includes("3 de diciembre")) {
    return { iso: "2026-12-03", display: clean };
  }
  if (lower.includes("febrero 2027") || lower.includes("febrero de 2027")) {
    return { iso: "2027-02-28", display: clean };
  }
  if (lower.includes("julio de 2027") || lower.includes("julio 2027")) {
    return { iso: "2027-07-12", display: clean };
  }

  // Check DD/MM/YYYY
  const dmyMatch = clean.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, "0");
    const month = dmyMatch[2].padStart(2, "0");
    let year = parseInt(dmyMatch[3], 10);
    if (year < 2026) year = 2026;
    let iso = `${year}-${month}-${day}`;
    if (iso < "2026-09-26") {
      iso = `2027-${month}-${day}`;
    }
    return { iso, display: clean };
  }

  // Generic Rolling / Convocatoria continua
  if (
    lower.includes("rolling") ||
    lower.includes("abierto") ||
    lower.includes("continua") ||
    lower.includes("sin deadline") ||
    lower.includes("no indica")
  ) {
    return { iso: defaultDate, display: clean };
  }

  return { iso: defaultDate, display: clean };
}

/**
 * Normalizes category string to OpportunityCategory enum
 */
function normalizeCategory(raw: string): OpportunityCategory {
  const lower = (raw || "").toLowerCase();

  if (lower.includes("hackathon")) return "hackathon";
  if (lower.includes("accelerator") || lower.includes("aceleradora") || lower.includes("venture capital")) return "accelerator";
  if (lower.includes("grant") || lower.includes("fondo") || lower.includes("subsidio")) return "grant";
  if (lower.includes("fellowship") || lower.includes("residency") || lower.includes("residencia")) return "fellowship";
  if (lower.includes("internship") || lower.includes("pasantia") || lower.includes("job") || lower.includes("empleo")) return "internship";
  if (lower.includes("incubator") || lower.includes("incubadora")) return "incubator";
  if (
    lower.includes("scholarship") ||
    lower.includes("beca") ||
    lower.includes("bootcamp") ||
    lower.includes("training") ||
    lower.includes("course") ||
    lower.includes("masters") ||
    lower.includes("doctorate") ||
    lower.includes("postgraduate") ||
    lower.includes("postdoc") ||
    lower.includes("summer_school") ||
    lower.includes("workshop")
  ) {
    return "scholarship";
  }
  return "contest";
}

/**
 * Normalizes modality
 */
function normalizeModality(rawModalityLoc: string, isRemoteHint?: boolean): OpportunityModality {
  if (isRemoteHint) return "remoto";
  const lower = (rawModalityLoc || "").toLowerCase();
  if (lower.includes("remoto") || lower.includes("online") || lower.includes("virtual")) return "remoto";
  if (lower.includes("hibrido") || lower.includes("híbrido")) return "hibrido";
  return "presencial";
}

/**
 * Cleans application URL
 */
function normalizeUrl(rawUrl: string, fallbackSlug: string): string {
  if (!rawUrl || rawUrl.trim().length === 0) {
    return `https://breakout.lat/opportunities/${fallbackSlug}`;
  }
  let clean = rawUrl.trim();
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    clean = `https://${clean}`;
  }
  try {
    new URL(clean);
    return clean;
  } catch {
    return `https://breakout.lat/opportunities/${fallbackSlug}`;
  }
}

/**
 * Main seeding function
 */
export async function seedOpportunities(): Promise<{
  totalLoaded: number;
  addedFromCSV: number;
  addedFromEnriched: number;
  addedFromExisting: number;
  deduplicatedCount: number;
}> {
  console.log("==================================================================");
  console.log("   BREAKOUT OPPORTUNITIES HUB — PROGRAMMATIC INGESTION & SEED");
  console.log("==================================================================\n");

  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const consolidated: Opportunity[] = [];

  function isDuplicate(title: string, url: string): boolean {
    const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normUrl = url.toLowerCase().replace(/https?:\/\/(www\.)?/, "").replace(/\/+$/, "");

    if (seenTitles.has(normTitle) || (normUrl.length > 5 && seenUrls.has(normUrl))) {
      return true;
    }
    seenTitles.add(normTitle);
    if (normUrl.length > 5) seenUrls.add(normUrl);
    return false;
  }

  // -------------------------------------------------------------------------
  // 1. INGESTION FROM EDGE EXTRACTION CSV (48 High-Priority Opportunities)
  // -------------------------------------------------------------------------
  const csvPath = resolve(__dirname, "../data/oportunidades-edge-consolidadas.csv");
  let addedFromCSV = 0;

  try {
    const csvContent = readFileSync(csvPath, "utf-8");
    const csvRows = parseCSV(csvContent).slice(1); // skip header

    console.log(`[1/3] Parsing CSV (${csvRows.length} convocatorias de Edge & Deep Research)...`);

    for (const row of csvRows) {
      if (row.length < 11) continue;

      const [
        rawId,
        rawName,
        rawOrg,
        rawCat,
        rawFunding,
        rawEquity,
        rawModalityLoc,
        rawDuration,
        rawEligibility,
        rawDeadline,
        rawUrl,
        rawDesc,
        rawPerks,
      ] = row;

      const title = rawName.trim();
      const slug = slugify(title);
      const url = normalizeUrl(rawUrl, slug);

      if (isDuplicate(title, url)) continue;

      const category = normalizeCategory(rawCat);
      const modality = normalizeModality(rawModalityLoc);
      const deadlineParsed = parseDeadlineDate(rawDeadline, "2026-12-31");

      // Extract location
      let location = "Global / Remoto";
      if (rawModalityLoc.includes("—")) {
        location = rawModalityLoc.split("—")[1]?.trim() || "Global";
      } else if (rawModalityLoc.includes("-")) {
        location = rawModalityLoc.split("-")[1]?.trim() || "Global";
      } else {
        location = rawModalityLoc.trim();
      }

      // Build tags
      const tags = new Set<string>();
      tags.add(category);
      if (modality === "remoto") tags.add("remoto");
      if (location.toLowerCase().includes("peru") || location.toLowerCase().includes("lima")) tags.add("peru");
      if (location.toLowerCase().includes("san francisco") || location.toLowerCase().includes("silicon valley")) tags.add("silicon-valley");
      if (rawEquity && rawEquity.toLowerCase().includes("0%")) tags.add("equity-free");
      if (title.toLowerCase().includes("ai") || title.toLowerCase().includes("ia")) tags.add("ia");
      if (rawFunding && rawFunding.includes("$")) tags.add("funding-usd");

      // Description with perks and equity
      let description = rawDesc?.trim() || "";
      if (rawEquity && rawEquity !== "No-Equity / 0%") {
        description += ` • Términos: ${rawEquity}.`;
      }
      if (rawPerks && rawPerks.length > 5) {
        description += ` • Beneficios destacados: ${rawPerks}.`;
      }
      if (description.length < 10) {
        description = `Convocatoria oficial de ${rawOrg}: ${title}. Postulaciones abiertas.`;
      }

      const oppData = {
        id: rawId.trim().startsWith("opp-") ? rawId.trim() : `opp-${slug}`,
        slug,
        title,
        organization: rawOrg.trim(),
        category,
        description,
        deadline: deadlineParsed.iso,
        deadline_display: deadlineParsed.display || rawDeadline,
        funding_or_prize: rawFunding?.trim() || "No especificado",
        eligibility: rawEligibility?.trim() || "Builders, emprendedores y tecnólogos.",
        modality,
        location,
        application_url: url,
        tags: Array.from(tags).slice(0, 6),
        featured:
          title.includes("Y Combinator") ||
          title.includes("Thiel Fellowship") ||
          title.includes("Platanus") ||
          title.includes("BBVA") ||
          title.includes("Datafest") ||
          title.includes("NVIDIA") ||
          title.includes("SkyDeck") ||
          title.includes("Start-Up Chile") ||
          title.includes("Techstars"),
        verified: true,
        created_at: new Date().toISOString(),
      };

      const parsed = opportunitySchema.parse(oppData);
      consolidated.push(parsed);
      addedFromCSV++;
    }
    console.log(`✓ Añadidas ${addedFromCSV} oportunidades curadas desde el CSV.`);
  } catch (err) {
    console.warn("Advertencia al leer CSV consolidado:", err);
  }

  // -------------------------------------------------------------------------
  // 2. INGESTION FROM LANDING DOCUMENTATION (204 Enriched Opportunities)
  // -------------------------------------------------------------------------
  const enrichedPath = resolve(__dirname, "../../landing/components/sections/opportunities/opportunities-enriched.json");
  let addedFromEnriched = 0;

  try {
    const enrichedContent = readFileSync(enrichedPath, "utf-8");
    const enrichedItems: any[] = JSON.parse(enrichedContent);

    console.log(`\n[2/3] Parsing Landing Enriched JSON (${enrichedItems.length} items de investigación y becas)...`);

    for (const item of enrichedItems) {
      if (!item.title || !item.url) continue;

      const title = item.title.trim();
      const slug = slugify(title);
      const url = normalizeUrl(item.url, slug);

      if (isDuplicate(title, url)) continue;

      const category = normalizeCategory(item.type);
      const isRemote = Boolean(item.isRemote);
      const modality = isRemote ? "remoto" : "presencial";
      const deadlineParsed = parseDeadlineDate(item.deadline, "2026-12-31");

      const locationParts = [item.city, item.country].filter(Boolean);
      const location = locationParts.length > 0 ? locationParts.join(", ") : (isRemote ? "Remoto / Global" : "Internacional");

      const tags = new Set<string>();
      tags.add(category);
      if (item.area && item.area !== "Todas") tags.add(slugify(item.area));
      if (item.country) tags.add(slugify(item.country));
      if (isRemote) tags.add("remoto");

      let description = item.note || "";
      if (item.targetAudience) {
        description = description ? `${description} • Dirigido a: ${item.targetAudience}` : `Dirigido a: ${item.targetAudience}`;
      }
      if (description.length < 10) {
        description = `Oportunidad académica y profesional: ${title} ofrecida por ${item.institution || "entidad convocante"}.`;
      }

      const oppData = {
        id: `opp-${item.id || slug}`,
        slug,
        title,
        organization: item.institution || item.organization || "Entidad Convocante",
        category,
        description,
        deadline: deadlineParsed.iso,
        deadline_display: item.deadline || deadlineParsed.display,
        funding_or_prize: item.phase || "Beca o estipendio según programa",
        eligibility: item.targetAudience || "Estudiantes de pregrado, posgrado e investigadores.",
        modality,
        location,
        application_url: url,
        tags: Array.from(tags).slice(0, 6),
        featured: false,
        verified: Boolean(item.isActive !== false),
        created_at: new Date().toISOString(),
      };

      try {
        const parsed = opportunitySchema.parse(oppData);
        consolidated.push(parsed);
        addedFromEnriched++;
      } catch (validationErr) {
        // Skip malformed records silently
      }
    }
    console.log(`✓ Añadidas ${addedFromEnriched} oportunidades desde la base de documentación de la landing.`);
  } catch (err) {
    console.warn("Advertencia al leer opportunities-enriched.json:", err);
  }

  // -------------------------------------------------------------------------
  // 3. INGESTION FROM EXISTING OPPORTUNITIES.JSON (14 Handcrafted Flagships)
  // -------------------------------------------------------------------------
  const existingPath = resolve(__dirname, "../data/opportunities.json");
  let addedFromExisting = 0;

  try {
    const existingContent = readFileSync(existingPath, "utf-8");
    const existingItems: any[] = JSON.parse(existingContent);

    console.log(`\n[3/3] Checking Existing Opportunities (${existingItems.length} items vigentes)...`);

    for (const item of existingItems) {
      const title = item.title.trim();
      const slug = item.slug || slugify(title);
      const url = normalizeUrl(item.application_url, slug);

      if (isDuplicate(title, url)) continue;

      const parsed = opportunitySchema.parse(item);
      consolidated.push(parsed);
      addedFromExisting++;
    }
    console.log(`✓ Mantenidas ${addedFromExisting} convocatorias insignia existentes.`);
  } catch (err) {
    console.warn("Advertencia al leer opportunities.json existente:", err);
  }

  // -------------------------------------------------------------------------
  // 4. WRITE CONSOLIDATED DATASET TO DISK
  // -------------------------------------------------------------------------
  writeFileSync(existingPath, JSON.stringify(consolidated, null, 2), "utf-8");
  console.log(`\n💾 Archivo consolidado guardado en: data/opportunities.json`);
  console.log(`Total oportunidades activas indexadas: ${consolidated.length}`);

  // Supabase is loaded separately with `bun run db:sync` (scripts/sync-supabase.ts)
  console.log("Para publicarlo en Supabase: bun run db:sync");

  return {
    totalLoaded: consolidated.length,
    addedFromCSV,
    addedFromEnriched,
    addedFromExisting,
    deduplicatedCount: seenTitles.size,
  };
}

// Execute when run directly
if (import.meta.main) {
  seedOpportunities()
    .then((stats) => {
      console.log("\n==================================================================");
      console.log("             RESUMEN DE INGESTA PROGRAMÁTICA");
      console.log("==================================================================");
      console.log(`Total consolidado indexado:  ${stats.totalLoaded} oportunidades`);
      console.log(`Desde CSV Edge/Research:     ${stats.addedFromCSV}`);
      console.log(`Desde Enriched Landing Docs: ${stats.addedFromEnriched}`);
      console.log(`Desde Flagships existentes:  ${stats.addedFromExisting}`);
      console.log("==================================================================\n");
    })
    .catch((err) => {
      console.error("Error fatal en seed script:", err);
      process.exit(1);
    });
}
