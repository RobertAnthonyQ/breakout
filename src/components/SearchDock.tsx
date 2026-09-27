"use client";

import React from "react";
import { OpportunityCategory, OpportunityModality } from "../../types";

interface SearchDockProps {
  query: string;
  onQueryChange: (q: string) => void;
  category: OpportunityCategory | "all";
  onCategoryChange: (cat: OpportunityCategory | "all") => void;
  modality: OpportunityModality | "all";
  onModalityChange: (m: OpportunityModality | "all") => void;
}

export function SearchDock({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  modality,
  onModalityChange,
}: SearchDockProps) {
  return (
    <div className="dock-container">
      <div className="glass-dock">
        <div className="search-input-wrap">
          <svg
            className="search-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar por startup, tecnología, grant, ProInnóvate, IA..."
          />
        </div>

        <div className="dock-divider" />

        <select
          className="dock-select"
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value as OpportunityCategory | "all")
          }
        >
          <option value="all">Categoría: Todas</option>
          <option value="accelerator">Aceleradoras</option>
          <option value="grant">Grants & Fondos</option>
          <option value="hackathon">Hackathons</option>
          <option value="scholarship">Becas</option>
          <option value="incubator">Incubadoras</option>
          <option value="contest">Concursos</option>
        </select>

        <div className="dock-divider" />

        <select
          className="dock-select"
          value={modality}
          onChange={(e) =>
            onModalityChange(e.target.value as OpportunityModality | "all")
          }
        >
          <option value="all">Modalidad: Todas</option>
          <option value="remoto">100% Remoto</option>
          <option value="presencial">Presencial</option>
          <option value="hibrido">Híbrido</option>
        </select>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("convocatorias");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="btn-dock-search"
        >
          Explorar
        </button>
      </div>
    </div>
  );
}
