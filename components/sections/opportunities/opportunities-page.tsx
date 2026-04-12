"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X } from "lucide-react"

import type {
  Opportunity,
  OpportunityType,
} from "./opportunities.types"
import { opportunities } from "./opportunities.data"
import SearchFilters from "./search-filters"
import OpportunityCard from "./opportunity-card"
import OpportunityPanel from "./opportunity-panel"

// ---------------------------------------------------------------------------
// Globe loading skeleton
// ---------------------------------------------------------------------------
function GlobeLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[500px]">
      <div className="relative flex items-center justify-center">
        <span className="absolute h-28 w-28 animate-ping rounded-full bg-white/[0.02]" />
        <span className="absolute h-20 w-20 animate-pulse rounded-full bg-white/[0.03]" />
        <span className="relative h-12 w-12 rounded-full border border-white/[0.06] bg-white/[0.02]" />
      </div>
      <p className="mt-5 text-xs font-medium tracking-widest uppercase text-white/15 select-none">
        Cargando
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dynamic globe
// ---------------------------------------------------------------------------
const GlobeViewer = dynamic(() => import("./globe-viewer"), {
  ssr: false,
  loading: () => <GlobeLoadingState />,
})

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export default function OpportunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTypes, setActiveTypes] = useState<OpportunityType[]>([])
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null)
  const [hoveredOpportunity, setHoveredOpportunity] =
    useState<Opportunity | null>(null)

  // ---- filtering -----------------------------------------------------------
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Exclude remote / no-country entries from globe (lat=0, lng=0)
      if (opp.lat === 0 && opp.lng === 0) return false

      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const searchable = [
          opp.title,
          opp.country,
          opp.city,
          opp.institution,
          opp.area,
          opp.targetAudience,
          opp.note,
        ]
          .join(" ")
          .toLowerCase()
        if (!searchable.includes(q)) return false
      }
      if (activeTypes.length > 0 && !activeTypes.includes(opp.type))
        return false
      return true
    })
  }, [searchQuery, activeTypes])

  const panelOpen = selectedOpportunity !== null

  const handleSelect = (opp: Opportunity) => {
    setSelectedOpportunity((prev) => (prev?.id === opp.id ? null : opp))
  }

  const handleClosePanel = () => setSelectedOpportunity(null)

  // ---- render --------------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-[#030305] text-white selection:bg-white/10 overflow-hidden">
      {/* ====== Globe — Full background on desktop ====== */}
      <div className="hidden lg:block fixed inset-0 z-0">
        <GlobeViewer
          opportunities={filteredOpportunities}
          selectedOpportunity={selectedOpportunity}
          hoveredOpportunity={hoveredOpportunity}
          onSelectOpportunity={handleSelect}
          onHoverOpportunity={setHoveredOpportunity}
        />
      </div>

      {/* ====== Left overlay panel ====== */}
      <div className="relative z-10 flex flex-col h-screen lg:flex-row lg:min-h-screen lg:h-auto pointer-events-none">
        {/* ── Left sidebar (search + cards) ── */}
        <div
          className="
            w-full lg:w-[420px] lg:min-w-[420px]
            flex flex-col shrink-0
            lg:h-screen
            bg-[#030305]/40 lg:bg-[#030305]/30
            lg:backdrop-blur-2xl
            lg:border-r lg:border-white/[0.04]
            pointer-events-auto
          "
        >
          {/* Header */}
          <header className="flex items-center justify-between px-5 h-16 border-b border-white/[0.04] shrink-0">
            <Link
              href="/"
              className="group flex items-center gap-2 text-xs font-medium text-white/30 transition-colors hover:text-white/60"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline tracking-wide">Volver</span>
            </Link>

            <h1
              className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-white/80 to-blue-400/60 bg-clip-text text-transparent"
            >
              Oportunidades
            </h1>

            <div className="w-12" />
          </header>

          {/* Search + filters */}
          <div className="px-5 py-4 border-b border-white/[0.04] shrink-0">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeTypes={activeTypes}
              onTypeToggle={(type) =>
                setActiveTypes((prev) =>
                  prev.includes(type)
                    ? prev.filter((t) => t !== type)
                    : [...prev, type],
                )
              }
              totalResults={filteredOpportunities.length}
              onClearFilters={() => {
                setSearchQuery("")
                setActiveTypes([])
              }}
            />
          </div>

          {/* Scrollable card list */}
          <div
            className="
              flex-1 overflow-y-auto
              px-4 py-4
              [scrollbar-width:thin]
              [scrollbar-color:rgba(255,255,255,0.04)_transparent]
              [&::-webkit-scrollbar]:w-[3px]
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-white/[0.04]
              [&::-webkit-scrollbar-thumb]:rounded-full
            "
          >
            <div className="space-y-2">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  isSelected={selectedOpportunity?.id === opp.id}
                  isHovered={hoveredOpportunity?.id === opp.id}
                  onSelect={handleSelect}
                  onHover={setHoveredOpportunity}
                />
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm text-white/20">
                  Sin resultados
                </p>
                <p className="mt-1 text-xs text-white/10">
                  Intenta ajustar los filtros
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile globe ── */}
        <div className="lg:hidden relative flex-1 min-h-[300px] bg-[#030305] pointer-events-auto">
          <GlobeViewer
            opportunities={filteredOpportunities}
            selectedOpportunity={selectedOpportunity}
            hoveredOpportunity={hoveredOpportunity}
            onSelectOpportunity={handleSelect}
            onHoverOpportunity={setHoveredOpportunity}
          />
        </div>

        {/* ── Desktop detail panel ── */}
        <AnimatePresence mode="wait">
          {panelOpen && (
            <motion.aside
              key="detail-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="
                hidden lg:block
                fixed right-0 top-0 bottom-0 z-20
                overflow-hidden
                bg-[#030305]/30 backdrop-blur-2xl
                border-l border-white/[0.04]
                pointer-events-auto
              "
            >
              <div className="h-full w-[380px] overflow-y-auto">
                <OpportunityPanel
                  opportunity={selectedOpportunity!}
                  onClose={handleClosePanel}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ====== Mobile detail overlay ====== */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] lg:hidden pointer-events-auto"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={handleClosePanel}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="
                absolute inset-x-0 bottom-0 top-14
                overflow-hidden rounded-t-2xl
                border-t border-white/[0.06]
                bg-[#030305]/50 backdrop-blur-2xl
              "
            >
              {/* Mobile close */}
              <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20">
                  Detalle
                </span>
                <button
                  onClick={handleClosePanel}
                  className="flex items-center justify-center rounded-full bg-white/[0.05] p-1.5 transition-colors hover:bg-white/[0.1] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5 text-white/30" />
                </button>
              </div>

              <div className="h-full overflow-y-auto pb-20">
                <OpportunityPanel
                  opportunity={selectedOpportunity!}
                  onClose={handleClosePanel}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
