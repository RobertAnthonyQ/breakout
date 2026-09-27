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
