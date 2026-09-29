"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  ExternalLink,
  Award,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Bookmark,
  Share2,
} from "lucide-react";
import { Opportunity } from "../../types";

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

const CATEGORY_MAP: Record<string, { label: string; className: string }> = {
  accelerator: { label: "ACELERADORA", className: "badge-category badge-accelerator" },
  grant: { label: "GRANT NO REEMBOLSABLE", className: "badge-category badge-grant" },
  hackathon: { label: "HACKATHON GLOBAL", className: "badge-category badge-hackathon" },
  fellowship: { label: "FELLOWSHIP & RESIDENCIA", className: "badge-category badge-fellowship" },
  scholarship: { label: "BECA & BOOTCAMP", className: "badge-category badge-scholarship" },
  internship: { label: "PASANTÍA TECH / EMPLEO", className: "badge-category badge-internship" },
  incubator: { label: "INCUBADORA", className: "badge-category badge-incubator" },
  contest: { label: "CONCURSO", className: "badge-category badge-contest" },
};

export function OpportunityModal({
  opportunity,
  onClose,
  isBookmarked = false,
  onToggleBookmark,
}: OpportunityModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (opportunity) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [opportunity, onClose]);

  if (!opportunity) return null;

  const cat = CATEGORY_MAP[opportunity.category] || {
    label: opportunity.category.toUpperCase(),
    className: "badge-category badge-accelerator",
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(opportunity.application_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto glass-modal-backdrop flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="glass-modal modal-sheet my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-neutral-900 transition-colors cursor-pointer border-none z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Modality Bar */}
        <div className="flex items-center gap-2.5 mb-3.5 pr-12 flex-wrap">
          <span className={cat.className}>
            {cat.label}
          </span>
          <span className="modality-indicator">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{opportunity.modality}</span>
          </span>
          {opportunity.verified && (
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              ✓ Verificada
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-[26px] font-extrabold text-neutral-950 tracking-[-0.03em] leading-tight mb-2 pr-8">
          {opportunity.title}
        </h2>

        {/* Organization */}
        <div className="flex items-center gap-2 text-[14px] text-slate-600 mb-6 flex-wrap">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-semibold text-neutral-800">
            {opportunity.organization}
          </span>
          {opportunity.location && <span>• {opportunity.location}</span>}
        </div>

        {/* Spec Grid */}
        <div className="modal-spec-grid">
          <div className="modal-spec-card">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Award className="w-3.5 h-3.5 text-[#214FDD]" />
              Financiamiento / Premio
            </span>
            <p className="text-[16px] sm:text-[18px] font-bold text-[#214FDD]">
              {opportunity.funding_or_prize}
            </p>
          </div>

          <div className="modal-spec-card">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#214FDD]" />
              Fecha Límite
            </span>
            <p className="text-[16px] sm:text-[18px] font-bold text-neutral-900">
              {opportunity.deadline_display || opportunity.deadline}
            </p>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Acerca del programa
          </h4>
          <p className="text-[14px] sm:text-[14.5px] text-slate-700 leading-relaxed font-normal">
            {opportunity.description}
          </p>
        </div>

        {/* Eligibility Section */}
        <div className="modal-eligibility-box">
          <h4 className="text-[12.5px] font-bold text-[#214FDD] flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#214FDD]" />
            Criterios de Elegibilidad
          </h4>
          <p className="text-[13.5px] text-slate-700 leading-relaxed font-normal">
            {opportunity.eligibility}
          </p>
        </div>

        {/* Tags Section */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="modal-tags-box">
            {opportunity.tags.map((tag) => (
              <span key={tag} className="modal-tag-chip">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="modal-actions">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(opportunity.id)}
              className={`btn-modal-bookmark ${isBookmarked ? "active" : ""}`}
              title={isBookmarked ? "Quitar de guardadas" : "Guardar convocatoria"}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[#214FDD] text-[#214FDD]" : ""}`} />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="btn-modal-copy"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#214FDD]" />
                <span className="text-[#1B41B5] font-semibold">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiar Enlace</span>
              </>
            )}
          </button>

          <a
            href={opportunity.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-modal-apply"
          >
            <span>Ir a la Convocatoria Oficial</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
