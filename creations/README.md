# Breakout — Creations

Todas las creaciones de Breakout se guardan aquí, organizadas por tipo.

## 📁 Estructura

```
creations/
├── posts/      ← Posts de Instagram/TikTok (PNG, JPG, MP4)
├── banners/    ← Banners, flyers, teasers (SVG, PNG, PDF)
├── emails/     ← Emails HTML para eventos y campañas
├── docs/       ← Documentos (.pptx, .docx, .pdf, .xlsx)
└── otros/      ← Otras creaciones
```

## 📋 Nomenclatura estándar

**Formato:** `[tipo]-[nombre-descriptivo]-[dd-mm-aa].[ext]`

### Ejemplos por categoría

**Posts (Instagram/TikTok):**
- `post-ig-convocatoria-openworld-11-04-26.png`
- `post-tiktok-behind-scenes-12-04-26.mp4`
- `post-ig-story-recordatorio-13-04-26.png`

**Banners (Flyers/Posters):**
- `banner-openworld-teaser-11-04-26.svg`
- `flyer-zerooone-convocatoria-15-02-26.png`
- `poster-evento-sponsors-20-03-26.pdf`

**Emails (HTML):**
- `email-openworld-recordatorio-12-04-26.html`
- `email-bienvenida-sponsor-10-04-26.html`
- `email-newsletter-mensual-01-04-26.html`

**Docs (Presentaciones/Documentos):**
- `presentacion-pitch-sponsors-08-04-26.pptx`
- `reporte-evento-openworld-14-04-26.docx`
- `planilla-asistencia-openworld-13-04-26.xlsx`
- `documento-alianza-bcp-10-04-26.pdf`

**Otros:**
- `video-teaser-openworld-11-04-26.mp4`
- `audio-intro-evento-12-04-26.mp3`
- `logo-evento-especial-15-04-26.ai`

## 🎯 Reglas de guardado

1. **SIEMPRE** usar la nomenclatura `[tipo]-[nombre-descriptivo]-[dd-mm-aa].[ext]`
2. **SIEMPRE** guardar en la subcarpeta correspondiente
3. Usar nombres descriptivos (no genéricos como "post1", "banner-final")
4. Mantener el formato de fecha: `dd-mm-aa` (día-mes-año en 2 dígitos)

## 🔍 Búsqueda rápida

Para buscar creaciones por fecha, tipo o evento:

```bash
# Por evento
find creations -name "*openworld*"

# Por tipo
ls creations/posts/

# Por fecha
find creations -name "*11-04-26*"

# Por extensión
find creations -name "*.html"
```

---

**Breakout** — Comunidad estudiantil de innovación, emprendimiento y tecnología  
*breakout.lat*
