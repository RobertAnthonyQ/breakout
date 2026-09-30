"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Globe from "react-globe.gl"
import * as THREE from "three"

import type { Opportunity } from "./opportunities.types"
import { OPPORTUNITY_TYPES } from "./opportunities.types"
import { loadCountryBorders, type BorderPoint } from "./country-borders"

/* eslint-disable @typescript-eslint/no-explicit-any */
const typed = <T,>(fn: T): any => fn

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface GlobeViewerProps {
  opportunities: Opportunity[]
  selectedOpportunity: Opportunity | null
  hoveredOpportunity: Opportunity | null
  onSelectOpportunity: (opportunity: Opportunity) => void
  onHoverOpportunity: (opportunity: Opportunity | null) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const BREAKOUT_HQ = { lat: -12.0464, lng: -77.0428 }
const AUTO_ROTATE_SPEED = 0.3
const INACTIVITY_RESUME_MS = 4_000
const POV_TRANSITION_MS = 1_200

// Blue accent
const ACCENT = "#3b82f6"
const POINT_COLOR = "rgba(100,180,255,1)"
const POINT_COLOR_DIM = "rgba(80,160,255,0.7)"
const ARC_COLORS = ["rgba(100,180,255,0.6)", "rgba(59,130,246,0.12)"]

// Border particles
const BORDER_POINTS_PER_COUNTRY = 150
const BORDER_PARTICLE_COLOR = new THREE.Color(0x3b82f6)
const BORDER_PARTICLE_SIZE = 0.35
const BORDER_ALTITUDE = 0.008

// Particle data item
interface BorderParticle {
  lat: number
  lng: number
  idx: number // for staggered animation
  total: number // total particles for this country
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function GlobeViewer({
  opportunities,
  selectedOpportunity,
  hoveredOpportunity,
  onSelectOpportunity,
  onHoverOpportunity,
}: GlobeViewerProps) {
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [countryBorders, setCountryBorders] = useState<Record<string, BorderPoint[]>>({})
  const animStartRef = useRef<number>(0)

  // ---- preload country borders on mount ------------------------------------
  useEffect(() => {
    loadCountryBorders(BORDER_POINTS_PER_COUNTRY).then(setCountryBorders)
  }, [])

  // ---- container dimensions ------------------------------------------------
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const { width, height } = container.getBoundingClientRect()
      // On desktop use 400px minimum so the globe looks full; on mobile
      // respect the actual container height to avoid overflowing into filters.
      const isMobile = window.innerWidth < 1024
      setDimensions({
        width: Math.round(width),
        height: Math.round(isMobile ? Math.max(height, 200) : Math.max(height, 400)),
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // ---- controls setup ------------------------------------------------------
  useEffect(() => {
    const controls = globeRef.current?.controls()
    if (!controls) return
    controls.autoRotate = true
    controls.autoRotateSpeed = AUTO_ROTATE_SPEED
    controls.enableZoom = true
    controls.minDistance = 120
    controls.maxDistance = 600
    controls.zoomSpeed = 0.8
    controls.rotateSpeed = 0.6
    controls.dampingFactor = 0.12
    controls.enableDamping = true
  })

  // ---- boost globe material brightness (night texture is too dark) ---------
  useEffect(() => {
    const scene = globeRef.current?.scene()
    if (!scene) return

    // The globe mesh is inside the scene — find it and tweak its material
    const tryBoost = () => {
      scene.traverse((obj: THREE.Object3D) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        const mat = mesh.material as THREE.MeshPhongMaterial
        // The globe sphere has a map (texture) and is the largest mesh
        if (mat?.map && mat.type === "MeshPhongMaterial") {
          mat.emissive = new THREE.Color(0x4466aa)
          mat.emissiveIntensity = 0.35
          mat.emissiveMap = mat.map
          mat.needsUpdate = true
        }
      })
    }

    // Retry a few times since globe mesh loads async
    const t1 = setTimeout(tryBoost, 500)
    const t2 = setTimeout(tryBoost, 1500)
    const t3 = setTimeout(tryBoost, 3000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  })


  const pauseAutoRotate = useCallback(() => {
    const controls = globeRef.current?.controls()
    if (!controls) return
    controls.autoRotate = false
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    inactivityTimer.current = setTimeout(() => {
      const ctrl = globeRef.current?.controls()
      if (ctrl) {
        ctrl.autoRotate = true
        ctrl.autoRotateSpeed = AUTO_ROTATE_SPEED
      }
    }, INACTIVITY_RESUME_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [])

  // ---- fly to selected (zoom in close) -------------------------------------
  useEffect(() => {
    if (!selectedOpportunity || !globeRef.current) return
    globeRef.current.pointOfView(
      {
        lat: selectedOpportunity.lat,
        lng: selectedOpportunity.lng,
        altitude: 1.5,
      },
      POV_TRANSITION_MS,
    )
    pauseAutoRotate()
  }, [selectedOpportunity, pauseAutoRotate])

  // ---- point styling -------------------------------------------------------
  const getPointColor = useCallback(
    (d: Opportunity) => {
      if (selectedOpportunity?.id === d.id) return "rgba(180,220,255,1)"
      if (hoveredOpportunity?.id === d.id) return POINT_COLOR
      return POINT_COLOR_DIM
    },
    [selectedOpportunity, hoveredOpportunity],
  )

  const getPointRadius = useCallback(
    (d: Opportunity) => {
      if (selectedOpportunity?.id === d.id) return 1.0
      if (hoveredOpportunity?.id === d.id) return 0.8
      return 0.45
    },
    [selectedOpportunity, hoveredOpportunity],
  )

  const getPointAltitude = useCallback(
    (d: Opportunity) => (selectedOpportunity?.id === d.id ? 0.06 : 0.01),
    [selectedOpportunity],
  )

  // ---- tooltip label on hover ----------------------------------------------
  const getPointLabel = useCallback(
    (d: Opportunity) => {
      const typeLabel = OPPORTUNITY_TYPES[d.type]?.label ?? d.type
      return `
        <div style="
          background: rgba(8,8,14,0.9);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(59,130,246,0.1);
          border-radius: 14px;
          padding: 14px 16px;
          max-width: 260px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        ">
          <div style="
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: rgba(59,130,246,0.55);
            margin-bottom: 6px;
          ">${typeLabel}</div>
          <div style="
            font-size: 14px;
            font-weight: 600;
            color: rgba(255,255,255,0.95);
            line-height: 1.35;
            margin-bottom: 4px;
          ">${d.title}</div>
          <div style="
            font-size: 12px;
            color: rgba(255,255,255,0.35);
          ">${d.institution ? `${d.institution} · ` : ""}${d.city && d.city !== "Remoto" ? `${d.city}, ` : ""}${d.country}</div>
        </div>
      `
    },
    [],
  )

  // ---- rings (selected pulse) ----------------------------------------------
  const ringsData = useMemo(() => {
    if (!selectedOpportunity) return []
    return [{ lat: selectedOpportunity.lat, lng: selectedOpportunity.lng }]
  }, [selectedOpportunity])

  const getRingColor = useCallback(
    () => (t: number) => {
      const opacity = Math.max(0, 0.6 * (1 - t))
      return `rgba(100,180,255,${opacity})`
    },
    [],
  )

  // ---- arcs (HQ → selected) ------------------------------------------------
  const arcsData = useMemo(() => {
    if (!selectedOpportunity) return []
    return [
      {
        startLat: BREAKOUT_HQ.lat,
        startLng: BREAKOUT_HQ.lng,
        endLat: selectedOpportunity.lat,
        endLng: selectedOpportunity.lng,
      },
    ]
  }, [selectedOpportunity])

  // ---- border particles (country outline when selected) --------------------
  const borderParticlesData = useMemo<BorderParticle[]>(() => {
    if (!selectedOpportunity) return []
    const countryName = selectedOpportunity.country
    const points = countryBorders[countryName]
    if (!points || points.length === 0) return []

    // Reset animation start
    animStartRef.current = performance.now()

    return points.map((p, idx) => ({
      lat: p.lat,
      lng: p.lng,
      idx,
      total: points.length,
    }))
  }, [selectedOpportunity, countryBorders])

  // Create a tiny sphere for each particle
  const createBorderParticle = useCallback((_d: BorderParticle) => {
    const geo = new THREE.SphereGeometry(BORDER_PARTICLE_SIZE, 6, 6)
    const mat = new THREE.MeshBasicMaterial({
      color: BORDER_PARTICLE_COLOR,
      transparent: true,
      opacity: 0,
    })
    return new THREE.Mesh(geo, mat)
  }, [])

  // Position + animate opacity (staggered fade-in)
  const updateBorderParticle = useCallback(
    (obj: THREE.Object3D, d: BorderParticle) => {
      if (!globeRef.current) return

      // Position on globe surface
      const coords = globeRef.current.getCoords(d.lat, d.lng, BORDER_ALTITUDE)
      if (coords) {
        obj.position.set(coords.x, coords.y, coords.z)
      }

      // Staggered fade-in: each particle appears with a slight delay
      const elapsed = performance.now() - animStartRef.current
      const staggerDelay = (d.idx / d.total) * 1200 // spread over 1.2s
      const particleAge = elapsed - staggerDelay

      const mesh = obj as THREE.Mesh
      const mat = mesh.material as THREE.MeshBasicMaterial

      if (particleAge < 0) {
        mat.opacity = 0
      } else {
        // Fade in over 400ms, then pulse gently
        const fadeIn = Math.min(1, particleAge / 400)
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 0.003 + d.idx * 0.5)
        mat.opacity = fadeIn * (0.4 + 0.4 * pulse)
      }
    },
    [],
  )

  // ---- handlers ------------------------------------------------------------
  const handlePointClick = useCallback(
    (point: object) => {
      onSelectOpportunity(point as Opportunity)
      pauseAutoRotate()
    },
    [onSelectOpportunity, pauseAutoRotate],
  )

  const handlePointHover = useCallback(
    (point: object | null) => {
      onHoverOpportunity(point ? (point as Opportunity) : null)
      if (point) pauseAutoRotate()
    },
    [onHoverOpportunity, pauseAutoRotate],
  )

  // ---- render --------------------------------------------------------------
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={{ minHeight: 400 }}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          // Globe appearance
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          backgroundColor="rgba(0,0,0,1)"
          showAtmosphere={true}
          atmosphereColor={ACCENT}
          atmosphereAltitude={0.25}
          animateIn={true}
          waitForGlobeReady={true}
          // Points (cylinders)
          pointsData={opportunities}
          pointLat={typed((d: Opportunity) => d.lat)}
          pointLng={typed((d: Opportunity) => d.lng)}
          pointColor={typed(getPointColor)}
          pointRadius={typed(getPointRadius)}
          pointAltitude={typed(getPointAltitude)}
          pointResolution={12}
          pointsMerge={false}
          pointLabel={typed(getPointLabel)}
          onPointClick={typed(handlePointClick)}
          onPointHover={typed(handlePointHover)}
          // Rings
          ringsData={ringsData}
          ringLat={typed((d: { lat: number }) => d.lat)}
          ringLng={typed((d: { lng: number }) => d.lng)}
          ringColor={typed(getRingColor)}
          ringMaxRadius={5}
          ringPropagationSpeed={1.2}
          ringRepeatPeriod={1200}
          // Arcs
          arcsData={arcsData}
          arcStartLat={typed((d: { startLat: number }) => d.startLat)}
          arcStartLng={typed((d: { startLng: number }) => d.startLng)}
          arcEndLat={typed((d: { endLat: number }) => d.endLat)}
          arcEndLng={typed((d: { endLng: number }) => d.endLng)}
          arcColor={typed(() => ARC_COLORS)}
          arcStroke={0.3}
          arcDashLength={0.6}
          arcDashGap={0.2}
          arcDashAnimateTime={3000}
          // Border particles (country outline)
          customLayerData={borderParticlesData}
          customThreeObject={typed(createBorderParticle)}
          customThreeObjectUpdate={typed(updateBorderParticle)}
        />
      )}

      {/* Subtle blue radial glow behind globe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[-1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}
