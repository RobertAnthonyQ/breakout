/**
 * Script to enrich csvjson.json with coordinates, IDs, and mapped types.
 * Run: node scripts/enrich-opportunities.mjs
 */
import { readFileSync, writeFileSync } from "fs"
import { randomUUID } from "crypto"

// ---------------------------------------------------------------------------
// Country → lat/lng (capital or main city)
// ---------------------------------------------------------------------------
const COUNTRY_COORDS = {
  "Argentina": { lat: -34.6037, lng: -58.3816 },
  "Estados Unidos": { lat: 38.9072, lng: -77.0369 },
  "Israel": { lat: 31.7683, lng: 35.2137 },
  "Remoto": { lat: 0, lng: 0 },
  "Europa": { lat: 50.8503, lng: 4.3517 }, // Brussels as EU center
  "Francia": { lat: 48.8566, lng: 2.3522 },
  "Alemania": { lat: 52.52, lng: 13.405 },
  "Japon": { lat: 35.6762, lng: 139.6503 },
  "Arabia Saudita": { lat: 24.7136, lng: 46.6753 },
  "Austria": { lat: 48.2082, lng: 16.3738 },
  "Italia": { lat: 41.9028, lng: 12.4964 },
  "España": { lat: 40.4168, lng: -3.7038 },
  "Irlanda": { lat: 53.3498, lng: -6.2603 },
  "India": { lat: 28.6139, lng: 77.209 },
  "Chile": { lat: -33.4489, lng: -70.6693 },
  "UK": { lat: 51.5074, lng: -0.1278 },
  "Rusia": { lat: 55.7558, lng: 37.6173 },
  "China": { lat: 39.9042, lng: 116.4074 },
  "Panama": { lat: 8.9824, lng: -79.5199 },
  "Lithuania": { lat: 54.6872, lng: 25.2797 },
  "Romania": { lat: 44.4268, lng: 26.1025 },
  "Canada": { lat: 45.4215, lng: -75.6972 },
  "Montenegro": { lat: 42.4304, lng: 19.2594 },
  "Suiza": { lat: 46.9481, lng: 7.4474 },
  "Mexico": { lat: 19.4326, lng: -99.1332 },
  "Brasil": { lat: -15.7975, lng: -47.8919 },
  "Australia": { lat: -33.8688, lng: 151.2093 },
  "Grecia": { lat: 37.9838, lng: 23.7275 },
  "Bulgaria": { lat: 42.6977, lng: 23.3219 },
  "UAE": { lat: 25.2048, lng: 55.2708 },
  "Corea": { lat: 37.5665, lng: 126.978 },
  "Peru": { lat: -12.0464, lng: -77.0428 },
  "Taiwan": { lat: 25.033, lng: 121.5654 },
  "Suecia": { lat: 59.3293, lng: 18.0686 },
  "Turquia": { lat: 41.0082, lng: 28.9784 },
  "Belgica": { lat: 50.8503, lng: 4.3517 },
  "Singapur": { lat: 1.3521, lng: 103.8198 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
  "Portugal": { lat: 38.7223, lng: -9.1393 },
  "Finlandia": { lat: 60.1699, lng: 24.9384 },
  "España/Portugal": { lat: 39.5, lng: -4.0 },
  "Hungria": { lat: 47.4979, lng: 19.0402 },
  "Paises Bajos": { lat: 52.3676, lng: 4.9041 },
}

// ---------------------------------------------------------------------------
// Type mapping: CSV Tipo → normalized type
// ---------------------------------------------------------------------------
const TYPE_MAP = {
  "Internship": "internship",
  "Posgrado": "postgraduate",
  "Maestria": "masters",
  "Competencia": "competition",
  "Posdoc": "postdoc",
  "Curso": "course",
  "Doctorado": "doctorate",
  "Fellowship": "fellowship",
  "Programa corto": "short_program",
  "Taller": "workshop",
  "Professional Training": "training",
  "Beca de estudios": "scholarship",
  "Bootcamp": "bootcamp",
  "Escuela de Verano": "summer_school",
  "Beca": "scholarship",
  "Travel grant/Conferencia": "conference",
  "Evento/Forum": "event",
  "Programa de verano": "summer_program",
  "Secundaria": "highschool",
  "Mentoria": "mentorship",
  "Hackathon": "hackathon",
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const raw = JSON.parse(readFileSync("csvjson.json", "utf-8"))

const enriched = raw.map((item, index) => {
  const country = item["País"] || ""
  const coords = COUNTRY_COORDS[country] || { lat: 0, lng: 0 }
  const tipo = TYPE_MAP[item["Tipo"]] || "other"

  // Generate a slug-like ID
  const slug = item["Nombre"]
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60)

  return {
    id: `${slug}-${index}`,
    title: item["Nombre"],
    type: tipo,
    area: item["Area"],
    country: country,
    lat: coords.lat,
    lng: coords.lng,
    deadline: item["Fecha de cierre de solicitudes"] || "",
    openDate: item["Fecha de apertura de solicitudes"] || "",
    url: item["Enlace a la solicitud"] || "",
    targetAudience: item["Dirigido a"] || "",
    note: item["Nota"] || "",
    phase: item["Fase"] || "",
    isRemote: country === "Remoto",
    isActive: true,
  }
})

writeFileSync(
  "components/sections/opportunities/opportunities-enriched.json",
  JSON.stringify(enriched, null, 2),
  "utf-8"
)

console.log(`✅ Enriched ${enriched.length} opportunities`)
console.log(`   → Output: components/sections/opportunities/opportunities-enriched.json`)

// Stats
const withCoords = enriched.filter(o => o.lat !== 0 || o.lng !== 0)
const noCountry = enriched.filter(o => !o.country)
const remote = enriched.filter(o => o.isRemote)
console.log(`   → With coordinates: ${withCoords.length}`)
console.log(`   → Remote: ${remote.length}`)
console.log(`   → No country: ${noCountry.length}`)
