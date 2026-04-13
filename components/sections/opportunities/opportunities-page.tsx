"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"

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
    <div className="relative bg-[#030305] text-white selection:bg-white/10">

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

      {/* ====== MOBILE layout (< lg) ====== */}
      <div className="lg:hidden flex flex-col min-h-screen">

        {/* Header mobile */}
        <header className="flex items-center justify-between px-5 h-16 border-b border-white/[0.04] shrink-0 bg-[#030305]">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-medium text-white/30 transition-colors hover:text-white/60"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-white/80 to-blue-400/60 bg-clip-text text-transparent">
            Oportunidades
          </h1>
          <div className="w-8" />
        </header>

        {/* Globe mobile — altura fija visible */}
        <div className="relative w-full h-[45vh] min-h-[220px] bg-[#030305] shrink-0 overflow-hidden">
          <GlobeViewer
            opportunities={filteredOpportunities}
            selectedOpportunity={selectedOpportunity}
            hoveredOpportunity={hoveredOpportunity}
            onSelectOpportunity={handleSelect}
            onHoverOpportunity={setHoveredOpportunity}
          />
        </div>

        {/* Search + filters mobile */}
        <div className="px-4 py-3 border-b border-white/[0.04] shrink-0 bg-[#030305]">
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

        {/* Card list mobile — scroll natural */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#030305]">
          <div className="space-y-2">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isSelected={selectedOpportunity?.id === opp.id}
                isHovered={false}
                onSelect={handleSelect}
                onHover={() => {}}
              />
            ))}
          </div>
          {filteredOpportunities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-white/20">Sin resultados</p>
              <p className="mt-1 text-xs text-white/10">Intenta ajustar los filtros</p>
            </div>
          )}
        </div>
      </div>

      {/* ====== DESKTOP layout (>= lg) ====== */}
      <div className="hidden lg:flex lg:flex-row relative z-10 min-h-screen pointer-events-none">
        {/* ── Left sidebar (search + cards) ── */}
        <div
          className="
            w-[420px] min-w-[420px]
            flex flex-col shrink-0
            h-screen
            bg-[#030305]/30
            backdrop-blur-2xl
            border-r border-white/[0.04]
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
              <span className="tracking-wide">Volver</span>
            </Link>
            <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-white/80 to-blue-400/60 bg-clip-text text-transparent">
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
                <p className="text-sm text-white/20">Sin resultados</p>
                <p className="mt-1 text-xs text-white/10">Intenta ajustar los filtros</p>
              </div>
            )}
          </div>
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

      {/* ====== Mobile detail overlay — slides up below globe ====== */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed inset-x-0 bottom-0 z-[60] lg:hidden
              overflow-hidden rounded-t-2xl
              border-t border-white/[0.06]
              bg-[#030305] shadow-[0_-8px_40px_rgba(0,0,0,0.7)]
            "
            style={{ top: "calc(45vh + 64px)" }}
          >
            <div className="h-full overflow-y-auto pb-10">
              <OpportunityPanel
                opportunity={selectedOpportunity!}
                onClose={handleClosePanel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
