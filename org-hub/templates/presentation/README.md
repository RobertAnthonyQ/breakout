# Plantilla de presentaciones — Breakout

Tema Marp con la marca Breakout. Escribe en Markdown, compila a PDF en ~2s.
Marca completa: [`identity/brand/brand-context.md`](../../identity/brand/brand-context.md).

## Archivos
- `breakout-theme.css` — el tema Marp (`@theme breakout`). No editar salvo para extender la marca.
- `breakout-starter.md` — punto de partida: copia este archivo para cada deck nuevo.
- `breakout-starter.pdf` — render de ejemplo.

## Cómo crear un deck

1. Copia `breakout-starter.md` a donde vivirá el deck (p. ej. `creations/` o la carpeta del evento).
2. Ajusta la ruta del logo si moviste el archivo (en el starter: `../../identity/brand/assets/logo-breakout-white.png`).
3. Escribe tus slides separando con `---`.
4. Compila (el archivo `.md` va **primero**, antes de los flags):

```bash
npx -y @marp-team/marp-cli@latest tu-deck.md -o tu-deck.pdf \
  --allow-local-files --theme-set "C:/Users/fredd/projects/breakout/org-hub/templates/presentation/breakout-theme.css"
```

> Si no encuentra Chrome para el PDF: `export CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"`.
> Otros formatos: `--html`, `--pptx`, `--images png`.

## Registros / clases de slide

| Directiva | Resultado |
|-----------|-----------|
| `<!-- _class: lead -->` | Portada cobalto, centrada, con sparkle (logo + tagline) |
| `<!-- _class: section -->` | Divisor de sección cobalto (título grande, kicker en cyan) |
| `<!-- _class: invert -->` | Slide de impacto, fondo negro, acento cyan |
| *(default)* | Contenido editorial: fondo blanco, título Poppins con subrayado cobalto, bullets en triángulo ▲ |

## Elementos

- **Bullets** → triángulo ▲ cobalto automático.
- **Callout** → blockquote `> **Texto.**` se renderiza como caja cobalto.
- **Dos columnas** → `<div class="columns"><div>…</div><div>…</div></div>`.
- **Highlight en texto** → `<span class="electric">palabra</span>` (electric blue).
- **Tablas** → header cobalto, filas alternas; estilizado automático.

## Reglas de marca (resumen)
- Cobalto `#214FDD` domina; electric `#2430FF` solo para highlights; cyan `#6CE5E8` con texto oscuro.
- Una idea por slide. Mucho aire. Títulos Poppins, cuerpo Raleway.
- El logo / wordmark vive en `identity/brand/assets/`.
