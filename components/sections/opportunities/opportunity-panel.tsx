"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  MapPin,
  Calendar,
  Globe,
  GraduationCap,
  Layers,
  StickyNote,
  ExternalLink,
} from "lucide-react"
import {
  Opportunity,
  OPPORTUNITY_TYPES,
} from "./opportunities.types"

interface OpportunityPanelProps {
  opportunity: Opportunity | null
  onClose: () => void
}

// ── Animation ────────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as const

const stagger = {
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function OpportunityPanel({
  opportunity,
  onClose,
}: OpportunityPanelProps) {
  const typeInfo = opportunity ? OPPORTUNITY_TYPES[opportunity.type] : null

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mx-auto mb-4">
          <Globe className="w-7 h-7 text-white/15" />
        </div>
        <p className="text-sm text-white/20 leading-relaxed max-w-[200px]">
          Selecciona un punto en el globo para ver detalles
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={opportunity.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="flex flex-col h-full"
      >
        {/* Scrollable body */}
        <div
          className="
            flex-1 overflow-y-auto
            px-6 pt-5 pb-4
            [scrollbar-width:thin]
            [scrollbar-color:rgba(255,255,255,0.06)_transparent]
            [&::-webkit-scrollbar]:w-[4px]
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-white/[0.06]
            [&::-webkit-scrollbar-thumb]:rounded-full
          "
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* ── Header ────────────────────────────────────────────── */}
            <motion.div variants={fadeUp} className="mb-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/30">
                  {typeInfo?.label ?? opportunity.type}
                </span>
                <button
                  onClick={onClose}
                  aria-label="Cerrar panel"
                  className="
                    p-1.5 rounded-lg
                    text-white/20 hover:text-white/50
                    bg-white/[0.03] hover:bg-white/[0.07]
                    border border-white/[0.04] hover:border-white/[0.08]
                    transition-all duration-200
                    cursor-pointer shrink-0
                  "
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-white/95 leading-tight mb-1">
                {opportunity.title}
              </h2>
              {opportunity.institution && (
                <p className="text-sm text-white/35">{opportunity.institution}</p>
              )}
            </motion.div>

            {/* ── Meta grid ─────────────────────────────────────────── */}
            <motion.div
              variants={fadeUp}
              className="
                grid grid-cols-2 gap-px
                rounded-2xl overflow-hidden
                border border-white/[0.04]
                bg-white/[0.02]
                mb-5
              "
            >
              <MetaCell icon={MapPin} label="Ubicación">
                {opportunity.city && opportunity.city !== "Remoto" && (
                  <span>{opportunity.city}, </span>
                )}
                {opportunity.country || "Remoto"}
                {opportunity.isRemote && (
                  <span className="text-white/30 text-[11px] ml-1">· Remoto</span>
                )}
              </MetaCell>

              <MetaCell icon={Calendar} label="Fecha límite">
                {opportunity.deadline || "No especificada"}
              </MetaCell>

              <MetaCell icon={Layers} label="Área">
                {opportunity.area}
              </MetaCell>

              <MetaCell icon={GraduationCap} label="Dirigido a">
                <span className="line-clamp-2 text-[12px]">
                  {opportunity.targetAudience || "--"}
                </span>
              </MetaCell>
            </motion.div>

            {/* ── Note ─────────────────────────────────────────────── */}
            {opportunity.note && (
              <motion.div variants={fadeUp} className="mb-5">
                <SectionTitle>Nota</SectionTitle>
                <div className="flex gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <StickyNote className="w-3.5 h-3.5 text-white/20 shrink-0 mt-0.5" />
                  <p className="text-[13px] text-white/40 leading-relaxed">
                    {opportunity.note}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Open date ────────────────────────────────────────── */}
            {opportunity.openDate && (
              <motion.div variants={fadeUp} className="mb-5">
                <SectionTitle>Apertura de solicitudes</SectionTitle>
                <p className="text-[13px] text-white/40">
                  {opportunity.openDate}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-white/[0.04]">
          <a
            href={opportunity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              w-full text-center
              bg-white/[0.08] hover:bg-white/[0.12]
              border border-white/[0.08] hover:border-white/[0.14]
              text-white/80 hover:text-white font-semibold text-sm
              rounded-xl py-3.5
              backdrop-blur-xl
              transition-all duration-200
              active:scale-[0.98]
            "
          >
            Ver convocatoria
            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Subcomponents ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] uppercase tracking-[0.12em] text-white/20 font-semibold mb-2.5">
      {children}
    </h3>
  )
}

function MetaCell({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 p-3.5 bg-white/[0.01]">
      <span className="text-[9px] uppercase tracking-wider text-white/20 font-medium flex items-center gap-1">
        <Icon className="w-3 h-3 shrink-0 opacity-60" />
        {label}
      </span>
      <span className="text-[13px] text-white/60 font-medium truncate">
        {children}
      </span>
    </div>
  )
}
