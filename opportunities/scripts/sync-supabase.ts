/**
 * Uploads the bundled catalog (data/opportunities.json) to Supabase as published rows.
 * Idempotent: upserts by id, so re-running after `bun run seed` refreshes the catalog.
 * Never touches community suggestions (different ids). Reads SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY from the environment (.env.local is loaded by Bun).
 *
 *   bun run db:sync
 */
import catalog from "../data/opportunities.json";
import { toCatalogRecord } from "../src/lib/opportunities";
import { getSupabaseClient } from "../src/lib/supabase";

const BATCH_SIZE = 100;

async function main() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.error("Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
    process.exit(1);
  }

  const rows = (catalog as unknown[]).map(toCatalogRecord);
  for (let start = 0; start < rows.length; start += BATCH_SIZE) {
    const batch = rows.slice(start, start + BATCH_SIZE);
    const { error } = await supabase.from("opportunities").upsert(batch, { onConflict: "id" });
    if (error) {
      console.error(`Falló el lote ${start}-${start + batch.length}:`, error.message);
      process.exit(1);
    }
    console.log(`✓ ${start + batch.length}/${rows.length}`);
  }

  const { count, error } = await supabase
    .from("opportunities")
    .select("id", { count: "exact", head: true })
    .eq("source", "catalog")
    .eq("status", "active");
  if (error) throw error;
  console.log(`Catálogo en Supabase: ${count} convocatorias publicadas.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
