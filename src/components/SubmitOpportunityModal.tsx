"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  CheckCircle2,
  Sparkles,
  Building2,
  Link as LinkIcon,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react";
import { OpportunityCategory, OpportunityModality } from "../../types";

interface SubmitOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOpportunity: (newOpp: any) => Promise<boolean>;
}

export function SubmitOpportunityModal({
  isOpen,
  onClose,
  onSubmitOpportunity,
}: SubmitOpportunityModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    category: "accelerator" as OpportunityCategory,
    modality: "remoto" as OpportunityModality,
    location: "Online / Global",
    funding_or_prize: "",
    deadline: "",
    description: "",
    eligibility: "",
    application_url: "",
    tags: "",
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title,
      organization: formData.organization,
      category: formData.category,
      modality: formData.modality,
      location: formData.location || undefined,
      funding_or_prize: formData.funding_or_prize,
      deadline: formData.deadline,
      description: formData.description,
      eligibility: formData.eligibility,
      application_url: formData.application_url,
      tags: tagsArray.length > 0 ? tagsArray : ["tech", "startups"],
      featured: false,
      verified: false,
    };

    const ok = await onSubmitOpportunity(payload);
    setIsSubmitting(false);

    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          title: "",
          organization: "",
          category: "accelerator",
          modality: "remoto",
          location: "Online / Global",
          funding_or_prize: "",
          deadline: "",
          description: "",
          eligibility: "",
          application_url: "",
          tags: "",
        });
      }, 2000);
    }
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
        <button
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-neutral-900 transition-colors cursor-pointer border-none z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#214FDD] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Comunidad Breakout
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight mb-2 pr-8">
          Sugerir oportunidad
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Aporta una oportunidad que conozcas. Un administrador la revisará antes de publicarla.
        </p>

        {success ? (
          <div className="p-8 text-center bg-blue-50 rounded-2xl border border-blue-200 my-4">
            <CheckCircle2 className="w-12 h-12 text-[#214FDD] mx-auto mb-3" />
            <h4 className="font-extrabold text-blue-900 text-lg mb-1">
              ¡Sugerencia enviada con éxito!
            </h4>
            <p className="text-sm text-[#1B41B5]">
              Tu sugerencia será revisada por un administrador antes de ser publicada. ¡Gracias por contribuir!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="form-label">
                Título de la convocatoria *
              </label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. StartUp Perú 12G o Hackathon IA & Web3"
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="form-label">
                  Organización o Entidad *
                </label>
                <div className="form-input-wrap">
                  <input
                    required
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Ej. ProInnóvate, MIT, YC"
                    className="form-input-with-icon"
                  />
                  <Building2 className="form-input-icon" />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input cursor-pointer"
                >
                  <option value="accelerator">Aceleradora</option>
                  <option value="grant">Grant / Fondo No Reembolsable</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="fellowship">Fellowship & Residencia</option>
                  <option value="scholarship">Beca & Bootcamp</option>
                  <option value="internship">Pasantía Tech & Empleo</option>
                  <option value="incubator">Incubadora</option>
                  <option value="contest">Concurso de Innovación</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="form-label">
                  Modalidad *
                </label>
                <select
                  name="modality"
                  value={formData.modality}
                  onChange={handleChange}
                  className="form-input cursor-pointer"
                >
                  <option value="remoto">100% Remoto (Online)</option>
                  <option value="presencial">Presencial</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>

              <div>
                <label className="form-label">
                  Ubicación (País o Sede)
                </label>
                <div className="form-input-wrap">
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ej. Lima, Perú / San Francisco"
                    className="form-input-with-icon"
                  />
                  <MapPin className="form-input-icon" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="form-label">
                  Financiamiento / Premio *
                </label>
                <div className="form-input-wrap">
                  <input
                    required
                    name="funding_or_prize"
                    value={formData.funding_or_prize}
                    onChange={handleChange}
                    placeholder="Ej. $100,000 USD o S/. 60,000 PEN"
                    className="form-input-with-icon"
                  />
                  <DollarSign className="form-input-icon" />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Fecha Límite *
                </label>
                <div className="form-input-wrap">
                  <input
                    required
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="form-input-with-icon"
                  />
                  <Calendar className="form-input-icon" />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">
                Descripción del Programa *
              </label>
              <textarea
                required
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explica brevemente de qué trata el programa, qué ofrece y qué tipo de proyectos busca..."
                className="form-input resize-none"
              />
            </div>

            <div>
              <label className="form-label">
                Criterios de Elegibilidad *
              </label>
              <input
                required
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="Ej. Startups en etapa temprana con prototipo funcional probado."
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">
                Enlace Oficial de Postulación (URL) *
              </label>
              <div className="form-input-wrap">
                <input
                  required
                  type="url"
                  name="application_url"
                  value={formData.application_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="form-input-with-icon"
                />
                <LinkIcon className="form-input-icon" />
              </div>
            </div>

            <div>
              <label className="form-label">
                Etiquetas / Tags (separados por coma)
              </label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="startups, ia, latam, grant, web3"
                className="form-input"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-modal-apply"
                style={{ flex: "initial", padding: "12px 28px" }}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Enviando..." : "Enviar sugerencia"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
