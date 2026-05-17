export type Country = {
  name: string;
  iso2: string; // ISO 3166-1 alpha-2
  dialCode: string; // without plus
  flag: string; // emoji flag
};

// Curated list (top countries first); extend as needed
export const countries: Country[] = [
  { name: "Peru", iso2: "PE", dialCode: "51", flag: "🇵🇪" },
  { name: "Mexico", iso2: "MX", dialCode: "52", flag: "🇲🇽" },
  { name: "Colombia", iso2: "CO", dialCode: "57", flag: "🇨🇴" },
  { name: "Chile", iso2: "CL", dialCode: "56", flag: "🇨🇱" },
  { name: "Argentina", iso2: "AR", dialCode: "54", flag: "🇦🇷" },
  { name: "Brazil", iso2: "BR", dialCode: "55", flag: "🇧🇷" },
  { name: "Venezuela", iso2: "VE", dialCode: "58", flag: "🇻🇪" },
  { name: "Ecuador", iso2: "EC", dialCode: "593", flag: "🇪🇨" },
  { name: "Bolivia", iso2: "BO", dialCode: "591", flag: "🇧🇴" },
  { name: "Uruguay", iso2: "UY", dialCode: "598", flag: "🇺🇾" },
  { name: "Paraguay", iso2: "PY", dialCode: "595", flag: "🇵🇾" },
  { name: "United States", iso2: "US", dialCode: "1", flag: "🇺🇸" },
  { name: "Spain", iso2: "ES", dialCode: "34", flag: "🇪🇸" },
  { name: "United Kingdom", iso2: "GB", dialCode: "44", flag: "🇬🇧" },
  { name: "Canada", iso2: "CA", dialCode: "1", flag: "🇨🇦" },
  { name: "France", iso2: "FR", dialCode: "33", flag: "🇫🇷" },
  { name: "Germany", iso2: "DE", dialCode: "49", flag: "🇩🇪" },
];

export function getDefaultCountry(): Country {
  try {
    const lang = Intl.DateTimeFormat().resolvedOptions().locale || "es-PE";
    const iso = lang.split("-")[1]?.toUpperCase();
    const found = countries.find((c) => c.iso2 === iso);
    if (found) return found;
  } catch {}
  return countries[0]; // Peru fallback
}

export function findCountryByIso(iso2: string): Country | undefined {
  return countries.find((c) => c.iso2.toUpperCase() === iso2.toUpperCase());
}
