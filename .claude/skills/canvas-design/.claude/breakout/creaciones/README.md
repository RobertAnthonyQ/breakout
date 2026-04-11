# Creaciones de Breakout

Esta carpeta centraliza **todas las creaciones** generadas para Breakout (posts, banners, emails, docs, etc.).

## Estructura

```
.claude/breakout/creaciones/
  posts/          ← Posts de Instagram/TikTok (PNG, SVG)
  banners/        ← Banners y flyers (PNG, SVG, PDF)
  emails/         ← Emails HTML para eventos
  docs/           ← Documentos .docx, .pptx, .pdf, .xlsx
  otros/          ← Cualquier otra creación
```

## Nomenclatura de archivos

**Formato:** `[tipo]-[nombre-descriptivo]-[dd-mm-aa].[extensión]`

**Ejemplos:**
- `banner-openworld-teaser-11-04-26.svg`
- `post-ig-openworld-convocatoria-11-04-26.png`
- `email-openworld-recordatorio-12-04-26.html`
- `presentacion-sponsors-11-04-26.pptx`

## Regla para skills

**Todos los skills de diseño/contenido deben guardar sus creaciones aquí:**

- `canvas-design` → `.claude/breakout/creaciones/banners/` o `posts/`
- `cold-email` → `.claude/breakout/creaciones/emails/`
- `docx`, `pptx`, `pdf`, `xlsx` → `.claude/breakout/creaciones/docs/`
- Código SVG directo → `.claude/breakout/creaciones/banners/` o `posts/`
- Otros → `.claude/breakout/creaciones/otros/`

La fecha en el nombre del archivo permite:
- Ver cuándo se creó sin abrir propiedades
- Mantener versiones (si se regenera el mismo asset)
- Ordenar cronológicamente

---

**Nota:** Las creaciones antiguas o temporales se pueden mover a una subcarpeta `archive/` dentro de cada tipo.
