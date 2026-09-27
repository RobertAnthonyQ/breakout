"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import { OpportunityCategory, OpportunityStats } from "../../types";

interface CategoryFilterRowProps {
  activeCategory: OpportunityCategory | "all";
  onSelectCategory: (cat: OpportunityCategory | "all") => void;
  stats?: OpportunityStats;
  savedCount?: number;
  showSavedOnly?: boolean;
  onToggleSavedOnly?: (show: boolean) => void;
}

const CATEGORIES: {
  key: OpportunityCategory | "all";
  label: string;
}[] = [
  { key: "all", label: "Todas las convocatorias" },
  { key: "accelerator", label: "Aceleradoras" },
  { key: "grant", label: "Grants & Fondos" },
  { key: "hackathon", label: "Hackathons" },
  { key: "fellowship", label: "Fellowships & Residencias" },
  { key: "scholarship", label: "Becas & Bootcamps" },
  { key: "internship", label: "Pasantías & Jobs" },
  { key: "incubator", label: "Incubadoras" },
  { key: "contest", label: "Concursos" },
];

export function CategoryFilterRow({
  activeCategory,
  onSelectCategory,
  stats,
  savedCount = 0,
  showSavedOnly = false,
  onToggleSavedOnly,
}: CategoryFilterRowProps) {
  return (
    <div className="filter-pills-row">
      {CATEGORIES.map((cat) => {
        const isActive = !showSavedOnly && activeCategory === cat.key;
        const count =
          cat.key === "all"
            ? stats?.total
            : stats?.byCategory[cat.key];

        // Hide 0-count categories unless selected
        if (cat.key !== "all" && stats && count === 0 && !isActive) {
          return null;
        }

        const countText = typeof count === "number" ? ` (${count})` : "";

        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => {
              if (showSavedOnly && onToggleSavedOnly) {
                onToggleSavedOnly(false);
              }
              onSelectCategory(cat.key);
            }}
            className={`pill-filter ${isActive ? "active" : ""}`}
          >
            {cat.label}
            {countText}
          </button>
        );
      })}

      {/* Bookmarked / Saved Opportunities Tab */}
      {savedCount > 0 && onToggleSavedOnly && (
        <button
          type="button"
          onClick={() => onToggleSavedOnly(!showSavedOnly)}
          className={`pill-filter flex items-center gap-1.5 ${
            showSavedOnly ? "active" : ""
          }`}
          style={
            showSavedOnly
              ? { background: "#214FDD", color: "#FFFFFF" }
              : { borderColor: "rgba(33, 79, 221, 0.3)", color: "#214FDD" }
          }
        >
          <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-white" : "fill-[#214FDD]"}`} />
          <span>Guardadas ({savedCount})</span>
        </button>
      )}
    </div>
  );
}
