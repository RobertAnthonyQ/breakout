"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import { getDefaultCountry } from "@/lib/countries";
import { PhoneInput } from "@/components/forms/phone-input";
import SuccessModal from "./success-modal";
import { SEMESTRES } from "./fellowship-form.data";

export default function FellowshipForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    cel: "",
    facultad: "",
    semestre: "",
    correoPUCP: "",
    linkedin: "",
    cvPortafolio: "",
    proyectoIdea: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [country, setCountry] = useState(getDefaultCountry());

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (submitStatus === "success") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [submitStatus]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validar teléfono en tiempo real
    if (name === "cel") {
      const parsed = parsePhoneNumberFromString(
        value,
        country.iso2 as CountryCode
      );
      setIsPhoneValid(parsed ? parsed.isPossible() : value.length === 0);
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, cel: value }));
    const parsed = parsePhoneNumberFromString(
      value,
      country.iso2 as CountryCode
    );
    setIsPhoneValid(parsed ? parsed.isPossible() : value.length === 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    // Validación de correo PUCP
    if (
      !formData.correoPUCP.endsWith("@pucp.edu.pe") &&
      !formData.correoPUCP.endsWith("@pucp.pe")
    ) {
      setErrorMessage(
        "El correo debe ser un correo institucional PUCP (@pucp.edu.pe o @pucp.pe)"
      );
      setIsSubmitting(false);
      setSubmitStatus("error");
      return;
    }

    // Validación y normalización de teléfono
    const raw = formData.cel.trim();
    const parsed = parsePhoneNumberFromString(raw, country.iso2 as CountryCode);

    if (!parsed || !parsed.isPossible()) {
      setErrorMessage("Por favor ingresa un número de teléfono válido");
      setIsSubmitting(false);
      setSubmitStatus("error");
      return;
    }

    // Normalizar a formato E.164
    const e164 = parsed.isValid()
      ? parsed.number
      : `+${country.dialCode}${raw.replace(/\D/g, "")}`;

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cel: e164, // Enviar en formato E.164
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al enviar la aplicación");
      }

      setSubmitStatus("success");
      setFormData({
        nombre: "",
        apellidos: "",
        cel: "",
        facultad: "",
        semestre: "",
        correoPUCP: "",
        linkedin: "",
        cvPortafolio: "",
        proyectoIdea: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Error al enviar la aplicación"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Modal de éxito */}
      <SuccessModal
        isOpen={submitStatus === "success"}
        onClose={() => setSubmitStatus("idle")}
      />

      {/* Formulario */}
      <div
        className="p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl sm:rounded-2xl"
        style={{
          background: "rgba(15, 15, 15, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px rgba(33, 79, 221, 0.12)",
        }}
      >
        {submitStatus === "error" && (
          <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-red-500/10 border-2 border-red-500/40 rounded-lg animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-red-400 text-center text-base sm:text-lg font-semibold">
              {errorMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Nombre <span className="text-red-400">*</span>
            </label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan"
              className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd]"
              style={{ height: "48px", fontSize: "16px" }}
            />
          </div>

          {/* Apellidos */}
          <div>
            <label
              htmlFor="apellidos"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Apellidos <span className="text-red-400">*</span>
            </label>
            <Input
              id="apellidos"
              name="apellidos"
              type="text"
              required
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Pérez García"
              className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd]"
              style={{ height: "48px", fontSize: "16px" }}
            />
          </div>

          {/* Celular con selector de país */}
          <div>
            <label
              htmlFor="cel"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Celular <span className="text-red-400">*</span>
            </label>
            <PhoneInput
              id="cel"
              name="cel"
              required
              value={formData.cel}
              onChange={handlePhoneChange}
              country={country}
              onCountryChange={setCountry}
              isValid={isPhoneValid}
              placeholder="976 543 210"
            />
          </div>

          {/* Facultad */}
          <div>
            <label
              htmlFor="facultad"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Facultad <span className="text-red-400">*</span>
            </label>
            <Input
              id="facultad"
              name="facultad"
              type="text"
              required
              value={formData.facultad}
              onChange={handleChange}
              placeholder="Ej: Ingeniería, Ciencias Sociales, etc."
              className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd]"
              style={{ height: "48px", fontSize: "16px" }}
            />
          </div>

          {/* Semestre */}
          <div>
            <label
              htmlFor="semestre"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Semestre <span className="text-red-400">*</span>
            </label>
            <select
              id="semestre"
              name="semestre"
              required
              value={formData.semestre}
              onChange={handleChange}
              className="w-full bg-black/50 border border-gray-700 text-white rounded-md px-3 focus:border-[#214fdd] focus:ring-[#214fdd] focus:outline-none focus:ring-2"
              style={{ height: "48px", fontSize: "16px" }}
            >
              <option value="" className="bg-black">
                Selecciona tu semestre
              </option>
              {SEMESTRES.map((sem) => (
                <option key={sem} value={sem} className="bg-black">
                  {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Correo PUCP */}
          <div>
            <label
              htmlFor="correoPUCP"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Correo PUCP <span className="text-red-400">*</span>
            </label>
            <Input
              id="correoPUCP"
              name="correoPUCP"
              type="email"
              required
              value={formData.correoPUCP}
              onChange={handleChange}
              placeholder="nombre.apellido@pucp.edu.pe"
              className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd]"
              style={{ height: "48px", fontSize: "16px" }}
            />
            <p className="mt-1 text-xs text-gray-500">
              Debe ser un correo institucional PUCP
            </p>
          </div>

          {/* LinkedIn */}
          <div>
            <label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              LinkedIn <span className="text-gray-500">(opcional)</span>
            </label>
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/tu-perfil"
              className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd]"
              style={{ height: "48px", fontSize: "16px" }}
            />
          </div>

          {/* CV/Portafolio */}
          <div>
            <label
              htmlFor="cvPortafolio"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              CV o Portafolio <span className="text-red-400">*</span>
            </label>
            <Input
              id="cvPortafolio"
              name="cvPortafolio"
              type="text"
              required
              value={formData.cvPortafolio}
              onChange={handleChange}
              placeholder="https://drive.google.com/... o tu portafolio web"
              className="w-full bg-black/50 border-gray-p700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd]"
              style={{ height: "48px", fontSize: "16px" }}
            />
            <p className="mt-1 text-xs text-gray-500">
              Comparte un enlace a tu CV o portafolio (Google Drive, Notion, web
              personal, etc.)
            </p>
          </div>

          {/* Proyecto o Idea */}
          <div>
            <label
              htmlFor="proyectoIdea"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Cuéntanos porqué quieres unirte al Fellowship{" "}
              <span className="text-red-400">*</span>
            </label>
            <textarea
              id="proyectoIdea"
              name="proyectoIdea"
              required
              value={formData.proyectoIdea}
              onChange={handleChange}
              placeholder="Me gustaría unirme al Fellowship porque..."
              rows={6}
              className="w-full bg-black/50 border border-gray-700 text-white placeholder:text-gray-500 rounded-md px-3 py-3 focus:border-[#214fdd] focus:ring-[#214fdd] focus:outline-none focus:ring-2 resize-none"
              style={{ fontSize: "16px" }}
            />
            <p className="mt-1 text-xs text-gray-500">
              Mínimo 100 caracteres ({formData.proyectoIdea.length}/100)
            </p>
          </div>

          {/* Botón Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || formData.proyectoIdea.length < 100}
            className="w-full bg-[#214fdd] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#1a3fb8] text-white font-bold py-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              boxShadow: "0 4px 20px rgba(33, 79, 221, 0.4)",
            }}
          >
            {isSubmitting ? "Enviando..." : "Aplicar al Fellowship"}
          </Button>
        </form>
      </div>
    </>
  );
}
