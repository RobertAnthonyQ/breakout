"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { countries, type Country } from "@/lib/countries";
import CountryDropdown from "./country-dropdown";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country: Country;
  onCountryChange: (country: Country) => void;
  isValid?: boolean;
  placeholder?: string;
  required?: boolean;
  id?: string;
  name?: string;
}

export default function PhoneInput({
  value,
  onChange,
  country,
  onCountryChange,
  isValid = true,
  placeholder,
  required,
  id,
  name,
}: PhoneInputProps) {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
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

  return (
    <>
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
          id={id}
          name={name}
          type="tel"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? `976 543 210`}
          className={`w-full bg-black/50 border-gray-700 border-l-0 rounded-l-none text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd] transition-all duration-300 ${
            !isValid && value
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
          <CountryDropdown
            countries={countries}
            selectedCountry={country}
            onSelect={(c) => {
              onCountryChange(c);
            }}
            onClose={() => setIsCountryOpen(false)}
          />
        )}
      </div>
      {!isValid && value && (
        <p className="mt-1 text-xs text-red-400">
          Número inválido para +{country.dialCode}. Revísalo.
        </p>
      )}
    </>
  );
}
