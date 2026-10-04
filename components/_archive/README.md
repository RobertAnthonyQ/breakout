# Archivo de componentes

Secciones retiradas de la landing que se conservan para consulta. Nada de esto se importa desde
`app/`, así que no se publica.

## stats (archivado el 2026-10-03)

Sección "Stats" de la home (`500+ Miembros`, `50+ Eventos`, `20+ Startups`, `15+ Speakers`). Eran
cifras de relleno, nunca reales — se quitó de `app/(landing)/page.tsx` a pedido de Freddy en vez
de inventar números.

- Componentes: `components/_archive/stats/`

## events-v1 (archivado el 2026-10-03)

Sección "Eventos" hardcodeada (hero animado con GSAP + carrusel de eventos pasados, datos en
`events.data.ts`). La reemplazó un embed del calendario público de Breakout en Luma
(`luma.com/breakoutlatam`), para que los eventos se actualicen solos sin tocar código.

- Componentes: `components/_archive/events-v1/`
- Reemplazo: `components/sections/events/`

Para restaurar cualquiera de las dos: mueve la carpeta de vuelta a `components/sections/` y
vuelve a importarla en `app/(landing)/page.tsx`.
