import rawSeedData from "../../data/opportunities.json";
import {
  Opportunity,
  OpportunityCategory,
  OpportunityFilters,
  OpportunityStats,
  opportunitySchema,
} from "../../types";
import { getSupabaseClient } from "./supabase";

/**
 * Normalizes text for accent-insensitive search
 */
function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

let inMemoryStore: Opportunity[] = (rawSeedData as unknown[]).map((item) => {
  const parsed = opportunitySchema.parse(item);
  return {
    ...parsed,
    slug: parsed.slug || parsed.id.replace("opp-", ""),
  };
});

/**
 * Loads and validates local fallback data
 */
function getLocalOpportunities(): Opportunity[] {
  return inMemoryStore;
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
        .from("opportunities")
        .select("*")
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
        const cleanQuery = filters.query.trim();
        query = query.or(
          `title.ilike.%${cleanQuery}%,organization.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,location.ilike.%${cleanQuery}%`
        );
      }

      // Default sorting: featured first, then deadline ascending
      query = query
        .order("featured", { ascending: false })
        .order("deadline", { ascending: filters.sortBy !== "deadline_desc" });

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item) => opportunitySchema.parse(item));
      }
    } catch {
      // Fallback silently to local dataset if Supabase network/auth fails
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
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .single();

      if (!error && data) {
        return opportunitySchema.parse(data);
      }
    } catch {
      // Fallback to local
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

/**
 * Creates and validates a new opportunity, inserting into Supabase or fallback memory
 */
export async function createOpportunity(
  input: Omit<Opportunity, "id" | "created_at"> & { id?: string; created_at?: string }
): Promise<Opportunity> {
  const slug =
    input.slug ||
    input.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const id = input.id || `opp-${slug}-${Date.now().toString(36)}`;
  const created_at = input.created_at || new Date().toISOString();

  const newOpportunity = opportunitySchema.parse({
    ...input,
    id,
    slug,
    created_at,
  });

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .insert({
          ...newOpportunity,
          status: "active",
        })
        .select()
        .single();

      if (!error && data) {
        const validated = opportunitySchema.parse(data);
        inMemoryStore.unshift(validated);
        return validated;
      }
    } catch {
      // Fallback to in-memory persistence
    }
  }

  // Prepend to in-memory list
  inMemoryStore.unshift(newOpportunity);
  return newOpportunity;
}

export function getAllOpportunitiesIncludingPending(): Opportunity[] {
  return [...inMemoryStore];
}

export function approveOpportunityById(id: string): boolean {
  const opp = inMemoryStore.find(o => o.id === id);
  if (opp) {
    opp.verified = true;
    return true;
  }
  return false;
}

export function rejectOpportunityById(id: string): boolean {
  const idx = inMemoryStore.findIndex(o => o.id === id);
  if (idx !== -1) {
    inMemoryStore.splice(idx, 1);
    return true;
  }
  return false;
}

