import { feature } from "topojson-client"
import type { Topology, GeometryCollection } from "topojson-specification"

// ---------------------------------------------------------------------------
// ISO 3166-1 numeric codes for our target countries
// Map from Spanish country name → ISO numeric code string
// ---------------------------------------------------------------------------
const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  "Argentina": "032",
  "Estados Unidos": "840",
  "Israel": "376",
  "Francia": "250",
  "Alemania": "276",
  "Japon": "392",
  "Arabia Saudita": "682",
  "Austria": "040",
  "Italia": "380",
  "España": "724",
  "Irlanda": "372",
  "India": "356",
  "Chile": "152",
  "UK": "826",
  "Rusia": "643",
  "China": "156",
  "Panama": "591",
  "Lithuania": "440",
  "Romania": "642",
  "Canada": "124",
  "Montenegro": "499",
  "Suiza": "756",
  "Mexico": "484",
  "Brasil": "076",
  "Australia": "036",
  "Grecia": "300",
  "Bulgaria": "100",
  "UAE": "784",
  "Corea": "410",
  "Peru": "604",
  "Taiwan": "158",
  "Suecia": "752",
  "Turquia": "792",
  "Belgica": "056",
  "Singapur": "702",
  "Portugal": "620",
  "Finlandia": "246",
  "Hungria": "348",
  "Paises Bajos": "528",
  "Colombia": "170",
}

const COUNTRIES_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface BorderPoint {
  lat: number
  lng: number
}

type CountryBordersMap = Record<string, BorderPoint[]>

// ---------------------------------------------------------------------------
// Cache so we only fetch once
// ---------------------------------------------------------------------------
let cache: CountryBordersMap | null = null
let fetchPromise: Promise<CountryBordersMap> | null = null

// ---------------------------------------------------------------------------
// Sample points along a polygon ring (array of [lng, lat] coords)
// Returns at most `maxPoints` evenly spaced along the ring
// ---------------------------------------------------------------------------
function sampleRing(
  ring: number[][],
  maxPoints: number,
): BorderPoint[] {
  if (ring.length <= 1) return []

  // Calculate total perimeter
  let totalLen = 0
  const segLens: number[] = []
  for (let i = 1; i < ring.length; i++) {
    const dx = ring[i][0] - ring[i - 1][0]
    const dy = ring[i][1] - ring[i - 1][1]
    const len = Math.sqrt(dx * dx + dy * dy)
    segLens.push(len)
    totalLen += len
  }

  if (totalLen === 0) return []

  const step = totalLen / maxPoints
  const points: BorderPoint[] = []
  let accum = 0
  let segIdx = 0
  let segAccum = 0

  for (let i = 0; i < maxPoints; i++) {
    const target = i * step

    while (segIdx < segLens.length && accum + segLens[segIdx] < target) {
      accum += segLens[segIdx]
      segIdx++
    }

    if (segIdx >= segLens.length) break

    const remaining = target - accum
    const t = segLens[segIdx] > 0 ? remaining / segLens[segIdx] : 0
    const p0 = ring[segIdx]
    const p1 = ring[segIdx + 1]

    points.push({
      lng: p0[0] + (p1[0] - p0[0]) * t,
      lat: p0[1] + (p1[1] - p0[1]) * t,
    })
  }

  return points
}

// ---------------------------------------------------------------------------
// Extract border points from a GeoJSON geometry
// ---------------------------------------------------------------------------
function extractBorderPoints(
  geometry: GeoJSON.Geometry,
  maxPointsTotal: number,
): BorderPoint[] {
  const rings: number[][][] = []

  if (geometry.type === "Polygon") {
    // Only exterior ring (index 0)
    rings.push(geometry.coordinates[0])
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      rings.push(polygon[0]) // exterior ring of each polygon
    }
  }

  if (rings.length === 0) return []

  // Calculate total perimeter to distribute points proportionally
  const ringLengths = rings.map((ring) => {
    let len = 0
    for (let i = 1; i < ring.length; i++) {
      const dx = ring[i][0] - ring[i - 1][0]
      const dy = ring[i][1] - ring[i - 1][1]
      len += Math.sqrt(dx * dx + dy * dy)
    }
    return len
  })

  const totalLen = ringLengths.reduce((a, b) => a + b, 0)
  if (totalLen === 0) return []

  const allPoints: BorderPoint[] = []
  for (let i = 0; i < rings.length; i++) {
    // Proportional allocation, minimum 8 points per ring
    const proportion = ringLengths[i] / totalLen
    const pointsForRing = Math.max(8, Math.round(maxPointsTotal * proportion))
    allPoints.push(...sampleRing(rings[i], pointsForRing))
  }

  return allPoints
}

// ---------------------------------------------------------------------------
// Main loader: fetch + parse + sample borders for all target countries
// ---------------------------------------------------------------------------
export async function loadCountryBorders(
  pointsPerCountry: number = 150,
): Promise<CountryBordersMap> {
  if (cache) return cache

  if (!fetchPromise) {
    fetchPromise = (async () => {
      try {
        const resp = await fetch(COUNTRIES_URL)
        const topology = (await resp.json()) as Topology

        // Convert TopoJSON → GeoJSON
        const countries = feature(
          topology,
          topology.objects.countries as GeometryCollection,
        )

        const isoToName: Record<string, string> = {}
        for (const [name, iso] of Object.entries(COUNTRY_NAME_TO_ISO)) {
          isoToName[iso] = name
        }

        const result: CountryBordersMap = {}

        for (const feat of countries.features) {
          const id = String(feat.id)
          const countryName = isoToName[id]
          if (!countryName) continue

          result[countryName] = extractBorderPoints(
            feat.geometry,
            pointsPerCountry,
          )
        }

        cache = result
        return result
      } catch (err) {
        console.warn("[country-borders] Failed to load borders:", err)
        fetchPromise = null
        return {}
      }
    })()
  }

  return fetchPromise
}

// ---------------------------------------------------------------------------
// Quick lookup: get border points for a specific country name (Spanish)
// ---------------------------------------------------------------------------
export function getCountryISO(countryName: string): string | undefined {
  return COUNTRY_NAME_TO_ISO[countryName]
}
