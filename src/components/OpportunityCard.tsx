"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import { Opportunity } from "../../types";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onOpenDetails: (opp: Opportunity) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

const MONTH_NAMES = [
  "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
  "JUL", "AGO", "SET", "OCT", "NOV", "DIC",
];

function formatDeadlineTag(deadlineStr: string): string {
  try {
    const parts = deadlineStr.split("-");
    if (parts.length === 3) {
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return `CIERRA ${day} ${MONTH_NAMES[monthIdx] || ""}`;
    }
  } catch {
    // fallback
  }
  return deadlineStr;
}

function getCategoryBadge(category: string): { label: string; className: string } {
  switch (category) {
    case "accelerator":
      return { label: "ACELERADORA", className: "badge-category badge-accelerator" };
    case "grant":
      return { label: "GRANT NO REEMBOLSABLE", className: "badge-category badge-grant" };
    case "hackathon":
      return { label: "HACKATHON GLOBAL", className: "badge-category badge-hackathon" };
    case "fellowship":
      return { label: "FELLOWSHIP & RESIDENCIA", className: "badge-category badge-fellowship" };
    case "scholarship":
      return { label: "BECA & BOOTCAMP", className: "badge-category badge-scholarship" };
    case "internship":
      return { label: "PASANTÍA TECH / EMPLEO", className: "badge-category badge-internship" };
    case "incubator":
      return { label: "INCUBADORA", className: "badge-category badge-incubator" };
    default:
      return { label: "CONCURSO", className: "badge-category badge-contest" };
  }
}

function getModalityIndicator(opportunity: Opportunity): string {
  if (opportunity.modality === "remoto") {
    return `🌐 ${opportunity.location || "Online"} (100% Remoto)`;
  }
  if (opportunity.modality === "hibrido") {
    return `⚡ ${opportunity.location || "LatAm"} (Híbrido)`;
  }
  return `📍 ${opportunity.location || "Presencial"}`;
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
  const cat = getCategoryBadge(opportunity.category);
  const deadlineText =
    opportunity.deadline_display &&
    (opportunity.deadline_display.toLowerCase().includes("rolling") ||
      opportunity.deadline_display.toLowerCase().includes("abierto") ||
      opportunity.deadline_display.toLowerCase().includes("sin deadline"))
      ? opportunity.deadline_display.toUpperCase().slice(0, 20)
      : formatDeadlineTag(opportunity.deadline);
  const modalityText = getModalityIndicator(opportunity);
  const benefitLabel = getBenefitLabel(opportunity.category);

  // Only the primary flagship opportunity (YC) gets the prominent cobalt specular rim
  const isPrimaryFeatured = opportunity.id === "opp-yc-w27";

  return (
    <article
      className={`glass-card ${isPrimaryFeatured ? "card-featured" : ""}`}
    >
      <div>
        <div className="card-top">
          <div className="badge-group">
            <span className={cat.className}>{cat.label}</span>
            <span
              className={`badge-urgency ${
                isPrimaryFeatured ? "urgency-high" : "urgency-med"
              }`}
            >
              ⏰ {deadlineText}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="modality-indicator">{modalityText}</div>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(opportunity.id);
                }}
                className={`btn-card-bookmark ${isBookmarked ? "active" : ""}`}
                title={isBookmarked ? "Quitar de guardadas" : "Guardar convocatoria"}
                aria-label="Guardar convocatoria"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarked ? "fill-[#214FDD] text-[#214FDD]" : "text-slate-400"
                  }`}
                />
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

        {/* Tags */}
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
          <span
            className={`benefit-val ${
              opportunity.category === "accelerator" ? "blue-val" : ""
            }`}
          >
            {opportunity.funding_or_prize}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetails(opportunity)}
          className="btn-card-cta"
        >
          <span>Ver Convocatoria</span>
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
