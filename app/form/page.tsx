"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import ParticlesBackground from "@/components/ParticlesBackground";
import { countries, getDefaultCountry } from "@/lib/countries";

const SEMESTRES = [
  "1ro",
  "2do",
  "3ro",
  "4to",
  "5to",
  "6to",
  "7mo",
  "8vo",
  "9no",
  "10mo",
  "11vo",
  "12avo",
  "Egresado",
  "Post grado",
];

const AREAS_INTERES = [
  {
    value:
      "Marketing: Apoya en la creación de contenido, diseño de publicaciones y gestión de redes sociales para fortalecer la comunicación y presencia de la organización.",
    label: "Marketing",
    description:
      "Apoya en la creación de contenido, diseño de publicaciones y gestión de redes sociales para fortalecer la comunicación y presencia de la organización",
  },
  {
    value:
      "Partnerships: Colabora en la búsqueda, desarrollo y mantenimiento de alianzas estratégicas con organizaciones, empresas y comunidades.",
    label: "Partnerships",
    description:
      "Colabora en la búsqueda, desarrollo y mantenimiento de alianzas estratégicas con organizaciones, empresas y comunidades",
  },
  {
    value:
      "Proyectos: Brinda apoyo en la organización de eventos, investigaciones (research) y programas como fellowships, asegurando una ejecución efectiva.",
    label: "Proyectos",
    description:
      "Brinda apoyo en la organización de eventos, investigaciones (research) y programas como fellowships, asegurando una ejecución efectiva",
  },
  {
    value:
      "TI (Tecnologías de la Información): Se encarga de gestionar formularios, mantener plataformas digitales y desarrollar herramientas o sitios web.",
    label: "TI (Tecnologías de la Información)",
    description:
      "Se encarga de gestionar formularios, mantener plataformas digitales y desarrollar herramientas o sitios web",
  },
  {
    value: "People & Culture",
    label: "People & Culture",
    description:
      "Fortalece la cultura Breakout, impulsa la integración del equipo y asegura que cada miembro viva una experiencia formativa, colaborativa y motivadora dentro de la comunidad",
  },
  {
    value: "Producto",
    label: "Producto",
    description:
      "Investiga el ecosistema de innovación y emprendimiento en la PUCP, transforma datos en estrategias y genera oportunidades para potenciar el impacto y crecimiento de Breakout",
  },
];

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    cel: "",
    facultad: "",
    semestre: "",
    correoPUCP: "",
    linkedin: "",
    areaInteres: "",
    porQue: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [country, setCountry] = useState(getDefaultCountry());
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const countryRef = useRef<HTMLDivElement>(null);

  // Cerrar selector de país al hacer click afuera
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!countryRef.current) return;
      if (!countryRef.current.contains(e.target as Node)) {
        setIsCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

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
        areaInteres: "",
        porQue: "",
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 gradient-bg z-0" />

      {/* Partículas de fondo */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticlesBackground />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-black tracking-tight hover:text-[#214fdd] transition-colors"
          >
            BREAKOUT®
          </Link>
          <Link
            href="/"
            className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
          >
            ← Volver
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-20 container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Título */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-3 sm:mb-4">
              APLICA A{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#214fdd] to-[#4a6fff]">
                BREAKOUT
              </span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg px-4">
              Completa el formulario para formar parte de nuestra comunidad de
              innovadores
            </p>
          </div>

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
            {submitStatus === "success" && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-center text-sm sm:text-base">
                  ¡Aplicación enviada exitosamente! Nos pondremos en contacto
                  pronto.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-center text-sm sm:text-base">
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
                <div ref={countryRef} className="flex w-full relative">
                  {/* Trigger país */}
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 bg-black/50 border border-gray-700 rounded-l-md rounded-r-none text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214fdd] focus:border-[#214fdd]"
                    style={{ height: "48px" }}
                    aria-haspopup="listbox"
                    aria-expanded={isCountryOpen}
                  >
                    <span className="text-lg leading-none">{country.flag}</span>
                    <span className="font-mono">+{country.dialCode}</span>
                    <svg
                      className="w-4 h-4 ml-1 opacity-70"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.937a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                  </button>

                  {/* Input número */}
                  <Input
                    id="cel"
                    name="cel"
                    type="tel"
                    required
                    value={formData.cel}
                    onChange={handleChange}
                    placeholder={`976 543 210`}
                    className={`w-full bg-black/50 border-gray-700 border-l-0 rounded-l-none text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd] transition-all duration-300 ${
                      !isPhoneValid && formData.cel
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                    }}
                  />

                  {/* Dropdown países */}
                  {isCountryOpen && (
                    <div className="absolute z-50 left-0 top-[52px] w-[320px] max-h-[300px] overflow-auto bg-black/95 border border-gray-800 rounded-md shadow-xl p-2">
                      <input
                        value={countryQuery}
                        onChange={(e) => setCountryQuery(e.target.value)}
                        placeholder="Buscar país o código"
                        className="w-full mb-2 px-3 py-2 rounded-md bg-black/60 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214fdd]"
                      />
                      <ul role="listbox" className="space-y-1">
                        {countries
                          .filter((c) => {
                            const q = countryQuery.trim().toLowerCase();
                            if (!q) return true;
                            return (
                              c.name.toLowerCase().includes(q) ||
                              c.iso2.toLowerCase().includes(q) ||
                              ("+" + c.dialCode).includes(q.replace(/\s/g, ""))
                            );
                          })
                          .map((c) => (
                            <li key={c.iso2}>
                              <button
                                type="button"
                                onClick={() => {
                                  setCountry(c);
                                  setIsCountryOpen(false);
                                  setCountryQuery("");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-white text-sm"
                                role="option"
                                aria-selected={country.iso2 === c.iso2}
                              >
                                <span className="text-lg leading-none">
                                  {c.flag}
                                </span>
                                <span className="flex-1 text-left">
                                  {c.name}
                                </span>
                                <span className="font-mono opacity-80">
                                  +{c.dialCode}
                                </span>
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
                {!isPhoneValid && formData.cel && (
                  <p className="mt-1 text-xs text-red-400">
                    Número inválido para +{country.dialCode}. Revísalo.
                  </p>
                )}
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

              {/* Área de interés */}
              <div>
                <label
                  htmlFor="areaInteres"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Área de interés <span className="text-red-400">*</span>
                </label>
                <select
                  id="areaInteres"
                  name="areaInteres"
                  required
                  value={formData.areaInteres}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-gray-700 text-white rounded-md px-3 py-3 focus:border-[#214fdd] focus:ring-[#214fdd] focus:outline-none focus:ring-2"
                  style={{ minHeight: "48px", fontSize: "16px" }}
                >
                  <option value="" className="bg-black">
                    Selecciona un área
                  </option>
                  {AREAS_INTERES.map((area) => (
                    <option
                      key={area.value}
                      value={area.value}
                      className="bg-black py-2"
                    >
                      {area.label}
                    </option>
                  ))}
                </select>
                {formData.areaInteres && (
                  <p className="mt-2 text-xs text-gray-400">
                    {
                      AREAS_INTERES.find(
                        (a) => a.value === formData.areaInteres
                      )?.description
                    }
                  </p>
                )}
              </div>

              {/* Por qué quieres ser parte */}
              <div>
                <label
                  htmlFor="porQue"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  ¿Por qué quieres ser parte de Breakout?{" "}
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="porQue"
                  name="porQue"
                  required
                  value={formData.porQue}
                  onChange={handleChange}
                  placeholder="Cuéntanos qué te motiva a unirte a Breakout y qué esperas aportar a la comunidad..."
                  rows={6}
                  className="w-full bg-black/50 border border-gray-700 text-white placeholder:text-gray-500 rounded-md px-3 py-3 focus:border-[#214fdd] focus:ring-[#214fdd] focus:outline-none focus:ring-2 resize-none"
                  style={{ fontSize: "16px" }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo 50 caracteres ({formData.porQue.length}/50)
                </p>
              </div>

              {/* Botón Submit */}
              <Button
                type="submit"
                disabled={isSubmitting || formData.porQue.length < 50}
                className="w-full bg-[#214fdd] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#1a3fb8] text-white font-bold py-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  boxShadow: "0 4px 20px rgba(33, 79, 221, 0.4)",
                }}
              >
                {isSubmitting ? "Enviando..." : "Enviar Aplicación"}
              </Button>
            </form>
          </div>

          {/* Nota al pie */}
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 px-4">
            Al enviar esta aplicación, aceptas que tu información será revisada
            por el equipo de Breakout PUCP
          </p>
        </div>
      </main>
    </div>
  );
}
