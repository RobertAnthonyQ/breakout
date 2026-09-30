# Archivo

Páginas retiradas que se conservan para consulta. Las carpetas que empiezan con `_` dentro de
`app/` no generan rutas en Next.js, así que nada de esto se publica.

## opportunities-v1 (archivado el 2026-09-29)

El primer "Opportunity Finder" de `/opportunities`: globo 3D con `react-globe.gl` y el catálogo
de `opportunities-enriched.json`. Lo reemplazó el **Opportunities Hub**
(app propia en `opportunities/` de este repo), que la landing sirve en `/opportunities` mediante
un rewrite en `next.config.ts`.

- Página: `app/_archive/opportunities-v1/page.tsx`
- Componentes: `components/_archive/opportunities-v1/`

Para restaurarlo: quita el rewrite de `/opportunities` en `next.config.ts` y mueve la página a
`app/opportunities/page.tsx`.
