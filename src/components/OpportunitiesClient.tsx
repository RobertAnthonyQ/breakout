"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Opportunity,
  OpportunityCategory,
  OpportunityModality,
  OpportunityStats,
} from "../../types";
import { NavigationIsland } from "./NavigationIsland";
import { HeroSection } from "./HeroSection";
import { SearchDock } from "./SearchDock";
import { CategoryFilterRow } from "./CategoryFilterRow";
import { OpportunityCard } from "./OpportunityCard";
import { OpportunityModal } from "./OpportunityModal";
import { SubmitOpportunityModal } from "./SubmitOpportunityModal";
import { FooterIsland } from "./FooterIsland";
import { RefreshCcw, Bookmark } from "lucide-react";
import { withBasePath } from "../lib/base-path";

interface OpportunitiesClientProps {
  initialOpportunities: Opportunity[];
  stats: OpportunityStats;
}

export function OpportunitiesClient({
  initialOpportunities,
  stats: initialStats,
}: OpportunitiesClientProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | "all">("all");
  const [modality, setModality] = useState<OpportunityModality | "all">("all");
  const [sortBy, setSortBy] = useState<"deadline_asc" | "deadline_desc" | "newest">("deadline_asc");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Load bookmarked opportunities from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("breakout_saved_opps");
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch {
      // fallback
    }
  }, []);

  const toggleBookmark = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("breakout_saved_opps", JSON.stringify(next));
      } catch {
        // fallback
      }
      return next;
    });
  };

  // Client-side filtering
  const filteredOpportunities = useMemo(() => {
    let list = [...opportunities];

    // Filter by Saved / Bookmarked
    if (showSavedOnly) {
      list = list.filter((item) => savedIds.includes(item.id));
    }

    // Filter by Category
    if (category !== "all" && !showSavedOnly) {
      list = list.filter((item) => item.category === category);
    }

    // Filter by Modality
    if (modality !== "all") {
      list = list.filter((item) => item.modality === modality);
    }

    // Filter by Search Query
    if (query.trim().length > 0) {
      const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      list = list.filter((item) => {
        const title = item.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const org = item.organization.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const desc = item.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const loc = item.location ? item.location.toLowerCase() : "";
        const tags = item.tags.map((t) => t.toLowerCase());

        return (
          title.includes(q) ||
          org.includes(q) ||
          desc.includes(q) ||
          loc.includes(q) ||
          tags.some((t) => t.includes(q))
        );
      });
    }

    // Sorting
    list.sort((a, b) => {
      // Featured items come first
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      if (sortBy === "deadline_desc") {
        return b.deadline.localeCompare(a.deadline);
      }
      if (sortBy === "newest") {
        return b.created_at.localeCompare(a.created_at);
      }
      // default: deadline_asc
      return a.deadline.localeCompare(b.deadline);
    });

    return list;
  }, [opportunities, category, modality, query, sortBy, showSavedOnly, savedIds]);

  // Dynamic live stats calculation
  const stats = useMemo(() => {
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

    for (const item of opportunities) {
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
      total: opportunities.length,
      featuredCount,
      remoteCount,
      byCategory,
      imminentCount,
    };
  }, [opportunities]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setModality("all");
    setSortBy("deadline_asc");
    setShowSavedOnly(false);
  };

  const handleCreateOpportunity = async (payload: any): Promise<boolean> => {
    try {
      const res = await fetch(withBasePath("/api/opportunities"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error en servidor al guardar convocatoria");
      }

      const json = await res.json();
      if (json.success && json.data) {
        setOpportunities((prev) => [json.data, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error creating opportunity:", err);
      // Fallback local insertion
      const mockCreated = {
        ...payload,
        id: `opp-client-${Date.now()}`,
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        created_at: new Date().toISOString(),
      };
      setOpportunities((prev) => [mockCreated, ...prev]);
      return true;
    }
  };

  return (
    <div className="page">
      {/* Blue brand band: navigation + hero */}
      <header className="hero-band">
        <NavigationIsland onOpenSubmit={() => setIsSubmitOpen(true)} />
        <HeroSection />
      </header>

      <main className="content">
        {/* Search dock floats over the edge of the blue band */}
        <SearchDock
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          modality={modality}
          onModalityChange={setModality}
        />

        {/* Category Filter Pills & Bookmarks */}
        <CategoryFilterRow
          activeCategory={category}
          onSelectCategory={setCategory}
          stats={stats}
          savedCount={savedIds.length}
          showSavedOnly={showSavedOnly}
          onToggleSavedOnly={setShowSavedOnly}
        />

        {/* Section Subheading */}
        <div className="section-meta" id="convocatorias">
          <div>
            <h2 className="section-title">
              Convocatorias <em>{showSavedOnly ? "guardadas" : "abiertas"}</em>
            </h2>
            <p className="section-subtitle">
              {showSavedOnly
                ? "Tus oportunidades favoritas guardadas para postulación o seguimiento"
                : "Selección prioritaria para miembros de Breakout y postulaciones de la semana"}
            </p>
          </div>
          <div className="sort-control">
            <span>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="deadline_asc">Próximo cierre</option>
              <option value="deadline_desc">Cierre más lejano</option>
              <option value="newest">Más recientes</option>
            </select>
          </div>
        </div>

        {/* 2-Column Cards Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="cards-grid">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onOpenDetails={setSelectedOpportunity}
                isBookmarked={savedIds.includes(opportunity.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div
            className="opportunity-card empty-state"
          >
            {showSavedOnly ? (
              <>
                <div className="empty-state-icon">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="card-title" style={{ marginBottom: "8px" }}>
                  No tienes convocatorias guardadas
                </h3>
                <p className="card-desc" style={{ marginBottom: "20px" }}>
                  Haz clic en el icono de marcador en cualquier tarjeta para guardarla en esta lista de favoritos.
                </p>
              </>
            ) : (
              <>
                <h3 className="card-title" style={{ marginBottom: "8px" }}>
                  No se encontraron convocatorias
                </h3>
                <p className="card-desc" style={{ marginBottom: "20px" }}>
                  Prueba ajustando los términos de búsqueda o restableciendo los filtros de categoría y modalidad.
                </p>
              </>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="btn-card-cta"
              style={{ margin: "0 auto" }}
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Ver todas las convocatorias</span>
            </button>
          </div>
        )}

      </main>

      <FooterIsland onOpenSubmit={() => setIsSubmitOpen(true)} />

      {/* Detail modal (solid white sheet) */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        isBookmarked={
          selectedOpportunity ? savedIds.includes(selectedOpportunity.id) : false
        }
        onToggleBookmark={toggleBookmark}
      />

      {/* Submit Opportunity Modal */}
      <SubmitOpportunityModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitOpportunity={handleCreateOpportunity}
      />
    </div>
  );
}
