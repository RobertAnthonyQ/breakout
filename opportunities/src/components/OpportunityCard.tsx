"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import { Opportunity } from "../../types";
import { getDeadlineBadge } from "../lib/deadline";
import { getCategoryLabel, getModalityLabel } from "../lib/labels";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onOpenDetails: (opp: Opportunity) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

function getBenefitLabel(category: string): string {
  switch (category) {
    case "grant":
      return "Monto no reembolsable";
    case "hackathon":
      return "Premios por tracks";
    case "accelerator":
      return "Financiamiento disponible";
    case "scholarship":
      return "Beneficio de la beca";
    default:
      return "Financiamiento / Premio";
  }
}

export function OpportunityCard({
  opportunity,
  onOpenDetails,
  isBookmarked = false,
  onToggleBookmark,
}: OpportunityCardProps) {
  const deadline = getDeadlineBadge(opportunity.deadline, opportunity.deadline_display);
  const benefitLabel = getBenefitLabel(opportunity.category);

  // Only the flagship opportunity (YC) gets the full cobalt card: one blue "winner" per screen
  const isPrimaryFeatured = opportunity.id === "opp-yc-w27";

  return (
    <article className={`opportunity-card ${isPrimaryFeatured ? "featured" : ""}`}>
      <div>
        <div className="card-top">
          <div className="badge-group">
            <span className="badge-category">{getCategoryLabel(opportunity.category)}</span>
            <span className={`badge-deadline deadline-${deadline.state}`}>{deadline.label}</span>
          </div>

          <div className="card-top-meta">
            <span className="modality-indicator">{getModalityLabel(opportunity.modality)}</span>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(opportunity.id);
                }}
                className={`btn-card-bookmark ${isBookmarked ? "active" : ""}`}
                title={isBookmarked ? "Quitar de guardadas" : "Guardar convocatoria"}
                aria-label={isBookmarked ? "Quitar de guardadas" : "Guardar convocatoria"}
                aria-pressed={isBookmarked}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        </div>

        <h3 className="card-title">{opportunity.title}</h3>
        <div className="card-org">
          {opportunity.organization}
          {opportunity.location ? ` · ${opportunity.location}` : ""}
        </div>
        <p className="card-desc">{opportunity.description}</p>

        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="card-tags-row">
            {opportunity.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="card-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="benefit-wrap">
          <span className="benefit-label">{benefitLabel}</span>
          <span className="benefit-val">{opportunity.funding_or_prize}</span>
        </div>

        <button type="button" onClick={() => onOpenDetails(opportunity)} className="btn-card-cta">
          <span>Ver convocatoria</span>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </article>
  );
}
