"use client";

import { useState } from "react";
import { type Country } from "@/lib/countries";

interface CountryDropdownProps {
  countries: Country[];
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

export default function CountryDropdown({
  countries: countryList,
  selectedCountry,
  onSelect,
  onClose,
}: CountryDropdownProps) {
  return (
    <div className="absolute z-50 left-0 top-[52px] w-[320px] max-h-[300px] overflow-auto bg-black/95 border border-gray-800 rounded-md shadow-xl p-2">
      <SearchableCountryList
        countries={countryList}
        selectedCountry={selectedCountry}
        onSelect={(c) => {
          onSelect(c);
          onClose();
        }}
      />
    </div>
  );
}

// Internal sub-component to manage search state
function SearchableCountryList({
  countries: countryList,
  selectedCountry,
  onSelect,
}: {
  countries: Country[];
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = countryList.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.iso2.toLowerCase().includes(q) ||
      ("+" + c.dialCode).includes(q.replace(/\s/g, ""))
    );
  });

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar país o código"
        className="w-full mb-2 px-3 py-2 rounded-md bg-black/60 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#214fdd]"
      />
      <ul role="listbox" className="space-y-1">
        {filtered.map((c) => (
          <li key={c.iso2}>
            <button
              type="button"
              onClick={() => onSelect(c)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-white text-sm"
              role="option"
              aria-selected={selectedCountry.iso2 === c.iso2}
            >
              <span className="text-lg leading-none">{c.flag}</span>
              <span className="flex-1 text-left">{c.name}</span>
              <span className="font-mono opacity-80">+{c.dialCode}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
