# Skills de Breakout — Instrucciones de guardado

**IMPORTANTE:** Todos los skills que generen archivos (canvas-design, cold-email, pptx, docx, pdf, xlsx, etc.) deben guardar sus creaciones en:

```
BREAKOUT-CREACIONES/
```

**(Carpeta en el directorio principal del proyecto, no en .claude)**

## Estructura de carpetas

```
BREAKOUT-CREACIONES/
  posts/          ← Posts de Instagram/TikTok (PNG, SVG, PDF)
  banners/        ← Banners, flyers, teasers (PNG, SVG, PDF)
  emails/         ← Emails HTML para eventos
  docs/           ← Documentos .docx, .pptx, .pdf, .xlsx
  otros/          ← Cualquier otra creación
```

## Rutas absolutas

**Desde el directorio `breakout/` (git root):**

```
BREAKOUT-CREACIONES/posts/
BREAKOUT-CREACIONES/banners/
BREAKOUT-CREACIONES/emails/
BREAKOUT-CREACIONES/docs/
BREAKOUT-CREACIONES/otros/
```

## Nomenclatura obligatoria

**Formato:** `[tipo]-[nombre-descriptivo]-[dd-mm-aa].[extensión]`

### Ejemplos por skill:

**canvas-design:**
- `BREAKOUT-CREACIONES/banners/banner-openworld-teaser-11-04-26.png`
- `BREAKOUT-CREACIONES/posts/post-ig-convocatoria-openworld-11-04-26.png`

**SVG directo:**
- `BREAKOUT-CREACIONES/banners/banner-openworld-wireframe-11-04-26.svg`

**cold-email:**
- `BREAKOUT-CREACIONES/emails/email-openworld-recordatorio-12-04-26.html`

**pptx:**
- `BREAKOUT-CREACIONES/docs/presentacion-sponsors-openworld-11-04-26.pptx`

**docx:**
- `BREAKOUT-CREACIONES/docs/propuesta-alianza-bcp-11-04-26.docx`

**pdf:**
- `BREAKOUT-CREACIONES/docs/programa-openworld-11-04-26.pdf`

**xlsx:**
- `BREAKOUT-CREACIONES/docs/registro-asistentes-openworld-11-04-26.xlsx`

## Reglas

1. **Siempre incluir la fecha** en formato `dd-mm-aa`
2. **Nombre descriptivo** que indique qué es sin tener que abrirlo
3. **Tipo al inicio** del nombre (banner, post, email, presentacion, etc.)
4. **Carpeta correcta** según el tipo de archivo
5. **Ruta absoluta**: usar `BREAKOUT-CREACIONES/[subcarpeta]/`

## ¿Por qué esta estructura?

- ✅ Todo centralizado en un solo lugar
- ✅ Visible en el directorio principal (no oculto en .claude)
- ✅ Fácil de encontrar por tipo
- ✅ Ordenado cronológicamente
- ✅ Permite versiones (si se regenera, se ve la fecha)
- ✅ No contamina el root del proyecto
- ✅ Facilita archivado y limpieza
- ✅ Fácil acceso para compartir y revisar

---

**Ver `BREAKOUT-CREACIONES/README.md` para más detalles.**

