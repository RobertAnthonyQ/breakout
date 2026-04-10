"use client"

import { cn } from "@/lib/utils"
import type { Opportunity } from "./opportunities.types"
import { OPPORTUNITY_TYPES } from "./opportunities.types"

// ── Component ────────────────────────────────────────────────────────

interface OpportunityCardProps {
  opportunity: Opportunity
  isSelected: boolean
  isHovered: boolean
  onSelect: (opportunity: Opportunity) => void
  onHover: (opportunity: Opportunity | null) => void
}

export default function OpportunityCard({
  opportunity,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: OpportunityCardProps) {
  const typeConfig = OPPORTUNITY_TYPES[opportunity.type]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(opportunity)}
      onMouseEnter={() => onHover(opportunity)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(opportunity)
        }
      }}
      className={cn(
        "relative rounded-2xl p-4 cursor-pointer",
        "border transition-all duration-300 ease-out",
        "outline-none focus-visible:ring-1 focus-visible:ring-white/20",
        "backdrop-blur-2xl",
        // Default
        "bg-white/[0.03] border-white/[0.05]",
        // Hover
        isHovered &&
          !isSelected &&
          "bg-white/[0.06] border-white/[0.1] -translate-y-[1px]",
        // Selected
        isSelected && "bg-white/[0.08] border-white/[0.14]",
      )}
    >
      {/* Selected indicator bar */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-white/60" />
      )}

      {/* ── Top Row ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-[11px] font-medium tracking-wide uppercase text-white/30">
          {typeConfig?.label ?? opportunity.type}
        </span>

        {opportunity.area && opportunity.area !== "Todas" && (
          <span className="text-[11px] whitespace-nowrap shrink-0 text-white/20 truncate max-w-[120px]">
            {opportunity.area}
          </span>
        )}
      </div>

      {/* ── Title ────────────────────────────────────────────── */}
      <h3 className="text-[13px] font-semibold text-white/90 line-clamp-2 mb-1 leading-snug">
        {opportunity.title}
      </h3>

      {/* ── Country + Institution ──────────────────────────────── */}
      <p className="text-[11px] text-white/25 truncate mb-3">
        {opportunity.institution && (
          <span className="text-white/35">{opportunity.institution} · </span>
        )}
        {opportunity.city && opportunity.city !== "Remoto" && (
          <span>{opportunity.city}, </span>
        )}
        {opportunity.country || "Remoto"}{" "}
        {opportunity.isRemote && (
          <span className="text-white/15">· Remoto</span>
        )}
      </p>

      {/* ── Bottom Row ───────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2">
        {opportunity.deadline && (
          <span className="text-[11px] text-white/20 truncate">
            {opportunity.deadline}
          </span>
        )}

        {opportunity.targetAudience && (
          <span className="text-[11px] text-white/15 truncate max-w-[140px]">
            {opportunity.targetAudience}
          </span>
        )}
      </div>
    </div>
  )
}
