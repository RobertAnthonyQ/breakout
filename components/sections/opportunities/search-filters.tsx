"use client"

import { useRef, useCallback } from "react"
import { Search, X } from "lucide-react"
import {
  OpportunityType,
  OPPORTUNITY_TYPES,
} from "./opportunities.types"

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeTypes: OpportunityType[]
  onTypeToggle: (type: OpportunityType) => void
  totalResults: number
  onClearFilters: () => void
}

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  activeTypes,
  onTypeToggle,
  totalResults,
  onClearFilters,
}: SearchFiltersProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const hasActiveFilters =
    searchQuery.length > 0 ||
    activeTypes.length > 0

  const handleClearSearch = useCallback(() => {
    onSearchChange("")
    inputRef.current?.focus()
  }, [onSearchChange])

  return (
    <div className="space-y-3">
      {/* ── Search Bar ────────────────────────────────────────── */}
      <div className="relative group">
        <div
          className={[
            "relative flex items-center h-12 rounded-2xl overflow-hidden",
            "bg-white/[0.04] backdrop-blur-2xl",
            "border transition-all duration-300",
            "border-white/[0.06]",
            "focus-within:border-white/[0.12]",
            "focus-within:bg-white/[0.06]",
          ].join(" ")}
        >
          <Search
            className="absolute left-4 h-4 w-4 text-white/25 pointer-events-none transition-colors duration-300 group-focus-within:text-white/40"
            strokeWidth={1.5}
          />

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar oportunidades, países, áreas..."
            className={[
              "w-full h-full bg-transparent",
              "pl-11 pr-11",
              "text-[14px] text-white/90 placeholder:text-white/20",
              "outline-none",
              "font-light tracking-wide",
            ].join(" ")}
          />

          {searchQuery.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className={[
                "absolute right-3 flex items-center justify-center",
                "h-7 w-7 rounded-lg",
                "bg-white/[0.06] hover:bg-white/[0.1]",
                "text-white/30 hover:text-white/60",
                "transition-all duration-200",
                "cursor-pointer",
              ].join(" ")}
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Chips ──────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none md:flex-wrap md:overflow-x-visible md:pb-0">
        {(
          Object.entries(OPPORTUNITY_TYPES) as [
            OpportunityType,
            (typeof OPPORTUNITY_TYPES)[OpportunityType],
          ][]
        ).map(([type, config]) => {
          const isActive = activeTypes.includes(type)

          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeToggle(type)}
              className={[
                "whitespace-nowrap",
                "rounded-full px-3.5 py-1.5",
                "text-xs font-medium tracking-wide",
                "border transition-all duration-300 cursor-pointer",
                "shrink-0 md:shrink",
                isActive
                  ? "bg-white/[0.1] border-white/[0.15] text-white"
                  : "bg-white/[0.03] border-white/[0.05] text-white/30 hover:bg-white/[0.06] hover:text-white/50",
              ].join(" ")}
            >
              {config.label}
            </button>
          )
        })}
      </div>

      {/* ── Results Count + Clear ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/25 font-light tracking-wide">
          <span className="text-white/40 font-medium tabular-nums">
            {totalResults}
          </span>{" "}
          resultados
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className={[
              "text-xs font-medium",
              "text-white/30 hover:text-white/60",
              "transition-colors duration-200",
              "cursor-pointer",
            ].join(" ")}
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
