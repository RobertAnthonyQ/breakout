import { z } from "zod";

export const opportunityCategorySchema = z.enum([
  "hackathon",
  "grant",
  "accelerator",
  "incubator",
  "scholarship",
  "fellowship",
  "internship",
  "contest",
]);

export type OpportunityCategory = z.infer<typeof opportunityCategorySchema>;

export const opportunityModalitySchema = z.enum([
  "remoto",
  "presencial",
  "hibrido",
]);

export type OpportunityModality = z.infer<typeof opportunityModalitySchema>;

export const opportunitySchema = z.object({
  id: z.string().min(1),
  slug: z.string().optional(),
  title: z.string().min(3),
  organization: z.string().min(2),
  category: opportunityCategorySchema,
  description: z.string().min(10),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  deadline_display: z.string().optional(),
  funding_or_prize: z.string().optional().default("No especificado"),
  eligibility: z.string(),
  modality: opportunityModalitySchema,
  location: z.string().optional(),
  application_url: z.string().url(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  verified: z.boolean().default(true),
  created_at: z.string().default(() => new Date().toISOString()),
});

export type Opportunity = z.infer<typeof opportunitySchema>;

/**
 * What a visitor may send through "Sugerir oportunidad". Unknown keys (verified, featured, status…)
 * are stripped, and every field is bounded so the table cannot be flooded.
 */
export const suggestionInputSchema = z.object({
  title: z.string().trim().min(3).max(200),
  organization: z.string().trim().min(2).max(200),
  category: opportunityCategorySchema,
  modality: opportunityModalitySchema,
  location: z.string().trim().max(200).optional(),
  funding_or_prize: z.string().trim().min(1).max(300),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  description: z.string().trim().min(10).max(5000),
  eligibility: z.string().trim().min(3).max(2000),
  application_url: z
    .string()
    .trim()
    .max(500)
    .url()
    .refine((url) => /^https?:\/\//i.test(url), "Must be an http(s) link"),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
});

export type SuggestionInput = z.infer<typeof suggestionInputSchema>;

export interface OpportunityFilters {
  category?: OpportunityCategory | "all";
  modality?: OpportunityModality | "all";
  query?: string;
  sortBy?: "deadline_asc" | "deadline_desc" | "newest";
  featuredOnly?: boolean;
}

export interface OpportunityStats {
  total: number;
  featuredCount: number;
  remoteCount: number;
  byCategory: Record<OpportunityCategory, number>;
  imminentCount: number; // closing within 30 days
}
