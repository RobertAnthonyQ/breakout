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
import { getCategoryLabel } from "../lib/labels";
import { formatLongDate, getDeadlineBadge } from "../lib/deadline";

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

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

  const deadline = getDeadlineBadge(opportunity.deadline, opportunity.deadline_display);


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
          <span className="badge-category">
            {getCategoryLabel(opportunity.category)}
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
            <p className="text-[16px] sm:text-[18px] font-bold text-neutral-900 mb-2">
              {deadline.state === "rolling" ? "Abierta todo el año" : formatLongDate(opportunity.deadline)}
            </p>
            {deadline.state !== "rolling" && (
              <span className={`badge-deadline deadline-${deadline.state}`}>{deadline.label}</span>
            )}
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
