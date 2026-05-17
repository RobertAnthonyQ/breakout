"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { countries, getDefaultCountry } from "@/lib/countries";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

interface JoinFormProps {
  onNameAdded: (name: string) => void;
  sphereRef: React.RefObject<HTMLDivElement | null>;
}

export default function JoinForm({ onNameAdded, sphereRef }: JoinFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [country, setCountry] = useState(getDefaultCountry());
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameUpper = (formData.name || "").toString().trim().toUpperCase();
    if (!nameUpper) return;

    setIsSubmitting(true);
    // Agregar de inmediato al estado para que aparezca en la esfera
    onNameAdded(nameUpper);

    // Animación de agregado
    requestAnimationFrame(() => {
      const sphere = sphereRef.current;
      if (!sphere) return;
      const nodes = Array.from(
        sphere.querySelectorAll(".sphere-word")
      ) as HTMLElement[];
      const target = nodes.find((el) => el.innerText === nameUpper);
      if (target) {
        gsap.fromTo(
          target,
          { scale: 0.4, opacity: 0 },
          { scale: 1.4, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }
        );
      }
    });

    // Normalizar a E.164 (intenta parsear, si falla, concatena código y dígitos)
    const raw = formData.phone.trim();
    const parsed = parsePhoneNumberFromString(raw, country.iso2 as CountryCode);
    const e164 = parsed?.isValid()
      ? parsed.number
      : `+${country.dialCode}${raw.replace(/\D/g, "")}`;

    // Enviar a Airtable (no bloquea la UI)
    fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameUpper,
        email: formData.email,
        phone: e164,
      }),
    })
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false);
        setHasSubmitted(true);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "phone") {
      const ph = parsePhoneNumberFromString(
        e.target.value,
        country.iso2 as CountryCode
      );
      setIsPhoneValid(ph ? ph.isPossible() : true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto lg:mx-0">
      <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <span role="img" aria-label="apunta a la izquierda">
          👈
        </span>
        Únete Ahora
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Primer Nombre
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Juan"
            className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd] transition-all duration-300"
            style={{
              height: "48px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Campo Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Correo Electrónico
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd] transition-all duration-300"
            style={{
              height: "48px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Campo Teléfono con selector de país (custom shadcn-like) */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Número de Teléfono
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
              <span className="text-lg leading-none">
                {country.flag}
              </span>
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
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder={`+${country.dialCode} 976 543 210`}
              className={`w-full bg-black/50 border-gray-700 border-l-0 rounded-l-none text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd] transition-all duration-300 ${
                isPhoneValid
                  ? ""
                  : "border-red-500 focus:border-red-500 focus:ring-red-500"
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
                        ("+" + c.dialCode).includes(
                          q.replace(/\s/g, "")
                        )
                      );
                    })
                    .map((c) => (
                      <li key={c.iso2}>
                        <button
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            setIsCountryOpen(false);
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
          {!isPhoneValid && (
            <p className="mt-1 text-xs text-red-400">
              Número inválido para +{country.dialCode}. Revísalo.
            </p>
          )}
        </div>

        {/* Botón Submit */}
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            hasSubmitted ||
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.phone.trim()
          }
          className="w-full bg-[#214fdd] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#1a3fb8] text-white font-bold py-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            boxShadow: "0 4px 20px rgba(33, 79, 221, 0.4)",
          }}
        >
          {isSubmitting
            ? "Enviando…"
            : hasSubmitted
            ? "Enviado"
            : "Unirme a la Comunidad"}
        </Button>
      </form>

      {/* Texto adicional */}
      <p className="text-gray-500 text-xs text-center mt-6">
        Al unirte, aceptas formar parte de una comunidad de innovadores
        y emprendedores
      </p>
    </div>
  );
}
