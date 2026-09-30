import rawSeedData from "../../data/opportunities.json";
import {
  Opportunity,
  OpportunityCategory,
  OpportunityFilters,
  OpportunityStats,
  SuggestionInput,
  opportunitySchema,
  suggestionInputSchema,
} from "../../types";
import { daysUntil } from "./deadline";
import { getSupabaseClient } from "./supabase";

const TABLE = "opportunities";
/** Columns the app reads; keeps admin-only fields (status, source) out of public responses. */
const PUBLIC_COLUMNS =
  "id, slug, title, organization, category, description, deadline, deadline_display, funding_or_prize, eligibility, modality, location, application_url, tags, featured, verified, created_at";

/**
 * Normalizes text for accent-insensitive search
 */
function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Read-only catalog bundled with the app: the fallback when Supabase is not configured or fails
const localOpportunities: Opportunity[] = (rawSeedData as unknown[]).map((item) => {
  const parsed = opportunitySchema.parse(item);
  return {
    ...parsed,
    slug: parsed.slug || parsed.id.replace("opp-", ""),
  };
});

function getLocalOpportunities(): Opportunity[] {
  return [...localOpportunities];
}

/** Maps a database row (nulls for empty columns) onto the app's Opportunity shape. */
export function fromRow(row: Record<string, unknown>): Opportunity {
  const withoutNulls = Object.fromEntries(Object.entries(row).filter(([, value]) => value !== null));
  return opportunitySchema.parse({ tags: [], ...withoutNulls });
}


/**
 * Fetches opportunities with filtering, search and sorting.
 * Attempts Supabase query first; seamlessly falls back to local validated JSON.
 */
export async function getOpportunities(
  filters: OpportunityFilters = {}
): Promise<Opportunity[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      let query = supabase
        .from(TABLE)
        .select(PUBLIC_COLUMNS)
        .eq("status", "active")
        .eq("verified", true);

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      if (filters.modality && filters.modality !== "all") {
        query = query.eq("modality", filters.modality);
      }

      if (filters.featuredOnly) {
        query = query.eq("featured", true);
      }

      if (filters.query && filters.query.trim().length > 0) {
        // Strip PostgREST filter syntax (commas, parentheses, wildcards) so a search term cannot inject filters
        const cleanQuery = filters.query.trim().replace(/[,()%*\\]/g, " ");
        query = query.or(
          `title.ilike.%${cleanQuery}%,organization.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,location.ilike.%${cleanQuery}%`
        );
      }

      // Default sorting: featured first, then deadline ascending
      query = query
        .order("featured", { ascending: false })
        .order("deadline", { ascending: filters.sortBy !== "deadline_desc" });

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((row) => fromRow(row as Record<string, unknown>));
    } catch (error) {
      // Keep the page up with the bundled catalog, but leave a trace for the logs
      console.error("[opportunities] Supabase read failed, serving local catalog:", error);
    }
  }

  // --- LOCAL FALLBACK ENGINE ---
  let list = getLocalOpportunities();

  // Category filter
  if (filters.category && filters.category !== "all") {
    list = list.filter((item) => item.category === filters.category);
  }

  // Modality filter
  if (filters.modality && filters.modality !== "all") {
    list = list.filter((item) => item.modality === filters.modality);
  }

  // Featured only
  if (filters.featuredOnly) {
    list = list.filter((item) => item.featured);
  }

  // Text search
  if (filters.query && filters.query.trim().length > 0) {
    const qNorm = normalizeSearchText(filters.query.trim());
    list = list.filter((item) => {
      const titleNorm = normalizeSearchText(item.title);
      const orgNorm = normalizeSearchText(item.organization);
      const descNorm = normalizeSearchText(item.description);
      const locNorm = item.location ? normalizeSearchText(item.location) : "";
      const tagsNorm = item.tags.map((t) => normalizeSearchText(t));

      return (
        titleNorm.includes(qNorm) ||
        orgNorm.includes(qNorm) ||
        descNorm.includes(qNorm) ||
        locNorm.includes(qNorm) ||
        tagsNorm.some((t) => t.includes(qNorm))
      );
    });
  }

  // Sorting
  list.sort((a, b) => {
    // Featured first
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }

    if (filters.sortBy === "deadline_desc") {
      return b.deadline.localeCompare(a.deadline);
    }
    if (filters.sortBy === "newest") {
      return b.created_at.localeCompare(a.created_at);
    }

    // Default: deadline_asc (earliest deadline first)
    return a.deadline.localeCompare(b.deadline);
  });

  return list;
}

/**
 * Retrieves a single opportunity by slug or id
 */
export async function getOpportunityBySlug(
  slugOrId: string
): Promise<Opportunity | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      // Two exact matches instead of an .or() string, so the slug cannot inject PostgREST filters
      for (const column of ["slug", "id"]) {
        const { data, error } = await supabase
          .from(TABLE)
          .select(PUBLIC_COLUMNS)
          .eq(column, slugOrId)
          .eq("status", "active")
          .eq("verified", true)
          .maybeSingle();
        if (error) throw error;
        if (data) return fromRow(data as Record<string, unknown>);
      }
      return null;
    } catch (error) {
      console.error("[opportunities] Supabase lookup failed, using local catalog:", error);
    }
  }

  const all = getLocalOpportunities();
  const found = all.find(
    (item) => item.slug === slugOrId || item.id === slugOrId
  );
  return found || null;
}

/**
 * Computes live statistics across all available opportunities
 */
export async function getOpportunityStats(): Promise<OpportunityStats> {
  const all = await getOpportunities();

  const byCategory: Record<OpportunityCategory, number> = {
    hackathon: 0,
    grant: 0,
    accelerator: 0,
    incubator: 0,
    scholarship: 0,
    fellowship: 0,
    internship: 0,
    contest: 0,
  };

  let featuredCount = 0;
  let remoteCount = 0;
  let imminentCount = 0;

  const now = new Date();
  const thirtyDaysAhead = new Date();
  thirtyDaysAhead.setDate(now.getDate() + 30);

  for (const item of all) {
    if (item.category in byCategory) {
      byCategory[item.category]++;
    }
    if (item.featured) featuredCount++;
    if (item.modality === "remoto") remoteCount++;

    const deadlineDate = new Date(`${item.deadline}T23:59:59Z`);
    if (deadlineDate >= now && deadlineDate <= thirtyDaysAhead) {
      imminentCount++;
    }
  }

  return {
    total: all.length,
    featuredCount,
    remoteCount,
    byCategory,
    imminentCount,
  };
}

/** Shape of a bundled catalog entry as a database row (published, curated by Breakout). */
export function toCatalogRecord(item: unknown) {
  const opportunity = opportunitySchema.parse(item);
  return {
    ...opportunity,
    slug: opportunity.slug || opportunity.id.replace("opp-", ""),
    status: "active" as const,
    source: "catalog" as const,
  };
}

export class SuggestionsUnavailableError extends Error {
  constructor() {
    super("Suggestions need Supabase (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)");
    this.name = "SuggestionsUnavailableError";
  }
}

export class SuggestionRejectedError extends Error {}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** A visitor's suggestion always lands as an unverified community draft until an admin approves it. */
export function buildSuggestionRecord(input: SuggestionInput, today: Date = new Date()) {
  const days = daysUntil(input.deadline, today);
  if (days === null || days < 0) {
    throw new SuggestionRejectedError("La fecha límite ya pasó");
  }
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const slug = `${slugify(input.title) || "oportunidad"}-${suffix}`;
  return {
    ...input,
    id: `opp-${slug}`,
    slug,
    featured: false,
    verified: false,
    status: "draft" as const,
    source: "community" as const,
  };
}

export async function submitSuggestion(payload: unknown): Promise<{ id: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new SuggestionsUnavailableError();

  const record = buildSuggestionRecord(suggestionInputSchema.parse(payload));
  const { error } = await supabase.from(TABLE).insert(record);
  if (error) throw error;
  return { id: record.id };
}

export interface SuggestionSummary {
  id: string;
  title: string;
  organization: string;
  category: string;
  deadline: string;
  description: string;
  application_url: string;
  status: "draft" | "active" | "archived";
  created_at: string;
}

function requireSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new SuggestionsUnavailableError();
  return supabase;
}

/** Community suggestions for the admin panel: pending drafts plus the most recent reviewed ones. */
export async function listSuggestions(): Promise<SuggestionSummary[]> {
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .select("id, title, organization, category, deadline, description, application_url, status, created_at")
    .eq("source", "community")
    .in("status", ["draft", "active", "archived"])
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as SuggestionSummary[];
}

/** Approve publishes the suggestion; reject archives it (kept for the record, never shown). */
export async function reviewSuggestion(id: string, action: "approve" | "reject"): Promise<boolean> {
  const changes =
    action === "approve"
      ? { status: "active", verified: true, reviewed_at: new Date().toISOString() }
      : { status: "archived", verified: false, reviewed_at: new Date().toISOString() };
  const { data, error } = await requireSupabase()
    .from(TABLE)
    .update(changes)
    .eq("id", id)
    .eq("source", "community")
    .select("id");
  if (error) throw error;
  return (data ?? []).length > 0;
}
