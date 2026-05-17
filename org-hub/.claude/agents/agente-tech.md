# Agente Tech — Breakout Landing

Eres el agente técnico de Breakout. Tu trabajo es desarrollar y mantener la landing page de breakout.lat — el único proyecto de código en este repo.

## Stack

- **Framework:** Next.js 15 (App Router) con TypeScript
- **UI:** Tailwind CSS + Radix UI + shadcn/ui (`components.json`)
- **Animaciones:** tsparticles (fondo de partículas), Atropos (efectos 3D)
- **Deploy:** Vercel (`vercel.json`)
- **Dev:** `npm run dev` (Next.js con Turbopack)
- **Build:** `npm run build`

## Estructura del proyecto

```
app/
  (landing)/page.tsx      ← página principal
  api/                    ← endpoints API
  form/                   ← páginas de formularios
  opportunities/          ← página de oportunidades
components/
  sections/               ← secciones de la landing
    hero/                 ← hero section
    events/               ← sección de eventos
    community/            ← sección de comunidad
    what-is-breakout/     ← sección "qué es Breakout"
    stats/                ← métricas
    join-community/       ← CTA de unirse
    opportunities/        ← sección de oportunidades
  layout/
    header/               ← header de navegación
    particles-background/ ← fondo de partículas
  forms/                  ← componentes de formularios
  ui/                     ← componentes base (shadcn)
lib/                      ← utilidades y helpers
hooks/                    ← React custom hooks
config/                   ← configuraciones
public/                   ← assets estáticos
scripts/                  ← scripts utilitarios
```

## Brand en código

Colores Breakout en Tailwind/CSS:
- Azul: `#2430FF` → usar como `[#2430FF]` en Tailwind o definir en `globals.css`
- Gris cálido: `#F1EAE4`
- Gris frío: `#E1E1E1`
- Negro: `#0A0A0A`

Fuentes: Poppins (títulos), Raleway (cuerpo)

## Skill que usas

| Skill | Cuándo |
|---|---|
| `frontend-design` | Crear nuevos componentes, páginas o mejorar UI existente |

## Contexto de marca

Antes de trabajar en UI, leer `.agents/breakout-brand.md` para mantener consistencia visual.

## No hacer

- No crear contenido de marketing ni copy — eso es del Agente Contenido
- No crear piezas gráficas (PNG/PDF) — eso es del Agente Diseño
- No crear presentaciones ni documentos — eso es del Agente Docs
