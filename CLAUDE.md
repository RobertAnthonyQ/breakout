# CLAUDE.md — Breakout

Este archivo es el punto de entrada para cualquier agente o conversación en este proyecto. Léelo siempre al inicio.

---

## Qué es este proyecto

**Breakout** es una comunidad estudiantil de innovación, emprendimiento y tecnología nacida en la **PUCP** (Lima, Perú). Web: **breakout.lat**

Este repo tiene dos responsabilidades:
1. **Landing page** de breakout.lat — Next.js 15, deploy en Vercel
2. **Centro de operaciones de contenido y marca** — skills configurados para automatizar producción de materiales

---

## Estructura de contexto

```
.claude/
  agents/
    agente-contenido.md     ← definición del Agente de Contenido
    agente-diseño.md        ← definición del Agente de Diseño
    agente-tech.md          ← definición del Agente Tech
    agente-docs.md          ← definición del Agente de Docs
  breakout/
    recursos.md             ← accesos, links y herramientas del equipo Breakout
    integrantes-breakout.md ← lista completa de integrantes con correos
    mapa-notion-breakout.md ← estructura completa del Notion Wiki
  events/
    openworld-13-04-26.md   ← evento actual (Open World, 13 abril 2026)
    [otros eventos...]
  skills/                   ← todos los skills con contexto Breakout embebido

BREAKOUT-CREACIONES/        ← TODAS las creaciones de Breakout (directorio principal)
  posts/                    ← Posts de Instagram/TikTok
  banners/                  ← Banners, flyers, teasers
  emails/                   ← Emails HTML para eventos
  docs/                     ← Documentos .docx, .pptx, .pdf, .xlsx
  otros/                    ← Otras creaciones
  README.md                 ← Documentación de nomenclatura
```

### Regla de guardado de creaciones

**TODAS las creaciones (posts, banners, emails, docs) se guardan en `BREAKOUT-CREACIONES/` (directorio principal)**

**Nomenclatura:** `[tipo]-[nombre-descriptivo]-[dd-mm-aa].[ext]`

Ejemplos:
- `banner-openworld-teaser-11-04-26.svg`
- `post-ig-convocatoria-openworld-11-04-26.png`
- `email-openworld-recordatorio-12-04-26.html`

Ver `BREAKOUT-CREACIONES/README.md` para más detalles.

### Accesos y recursos

**Si el usuario pregunta por contraseñas, accesos, herramientas, links o recursos del equipo** → leer siempre `.claude/breakout/recursos.md`

Este archivo centraliza:
- Credenciales de redes sociales (Instagram, LinkedIn, etc.)
- Accesos a herramientas (Beacons, Luma, Notion, Canva, GitHub, etc.)
- Links internos (Drive, correos, workspace)

### Integrantes del equipo

**Si el usuario pregunta por integrantes, miembros, equipo, correos del equipo o contactos** → leer siempre `.claude/breakout/integrantes-breakout.md`

Este archivo contiene:
- Lista completa de los 15 integrantes de Breakout
- Correos electrónicos (@pucp.edu.pe)
- Áreas: Community & Experience, Partnerships & Programs, Growth & Innovation
- Skills y disponibilidad de cada integrante
- Lista de correos para envíos masivos

**Fuente:** Extraído desde Notion (base de datos "Tabla 2" del workspace interno de Breakout)

### Mapa del Notion de Breakout

**Si el usuario pregunta por estructura del Notion, bases de datos, dónde encontrar algo en Notion, o qué contiene cada sección** → leer siempre `.claude/breakout/mapa-notion-breakout.md`

Este archivo contiene:
- Estructura completa del Notion Wiki de Breakout
- Todas las bases de datos con sus Collection URLs
- Descripción de cada sección y área
- Qué datos contiene cada base de datos (campos, propósito)
- Guía de uso rápido: dónde buscar cada tipo de información
- **Secciones principales:**
  - 👥 Equipo (Tabla 2, Tabla por Área)
  - 🧪 Partnerships & Programs (Pipeline de alianzas, Pendientes)
  - 🌸 Community & Experience (Eventos, Calendario, Disponibilidad)
  - 🌎 Growth & Innovation
  - 📊 Tracker 26-1 (sistema principal de tareas)
  - 🚀 Proyectos
  - 🔗 Links importantes

**Fuente:** Mapeado completo del Notion Wiki de Breakout PUCP

**IMPORTANTE - Acceso a Notion:**
- **SIEMPRE usar el MCP de Notion** (`mcp__notion__*` tools) para acceder al Notion de Breakout
- **NUNCA usar el MCP de Composio** para Notion
- Tools disponibles:
  - `mcp__notion__notion-search` - buscar en el workspace
  - `mcp__notion__notion-fetch` - leer páginas y bases de datos
  - `mcp__notion__notion-create-pages` - crear páginas
  - `mcp__notion__notion-update-page` - actualizar páginas
- El MCP de Notion está conectado directamente al workspace de Breakout PUCP

---

## Arquitectura de agentes

Este proyecto opera con **4 sub-agentes especializados**. Cada agente tiene su propio contexto en `.agents/`. Cuando el usuario pida algo, identifica qué agente corresponde y actúa según su definición.

```
┌─────────────────────────────────────────────────────────┐
│                    BREAKOUT SUPER AGENTE                 │
│              (acceso a todo el proyecto)                 │
└───────────┬──────────┬──────────────┬───────────────────┘
            │          │              │              │
    ┌───────▼───┐  ┌───▼────┐  ┌─────▼──┐  ┌──────▼──────┐
    │ CONTENIDO │  │DISEÑO  │  │  TECH  │  │    DOCS     │
    │           │  │        │  │Landing │  │             │
    │ • social  │  │•canvas │  │• Next  │  │ • pptx      │
    │ • copy    │  │•brand  │  │• React │  │ • docx      │
    │ • launch  │  │•themes │  │• TS    │  │ • pdf       │
    │ • email   │  │•alg-art│  │• Vercel│  │ • xlsx      │
    │ • strategy│  │        │  │        │  │ • themes    │
    └───────────┘  └────────┘  └────────┘  └─────────────┘
```

### Cuándo usar cada agente

| Necesidad | Agente | Archivo de referencia |
|---|---|---|
| Post de IG, TikTok, copy, estrategia, email HTML de evento | **Contenido** | `.claude/agents/agente-contenido.md` |
| Post visual PNG, flyer, poster, arte generativo, fondo evento | **Diseño** | `.claude/agents/agente-diseño.md` |
| Landing page, componentes React, código, deploy | **Tech** | `.claude/agents/agente-tech.md` |
| Presentación .pptx, documento .docx, PDF, planilla | **Docs** | `.claude/agents/agente-docs.md` |

---

## Contexto de eventos — reglas de uso

Los archivos en `.claude/events/` contienen el contexto de cada evento de Breakout.

**Formato de nombre:** `[nombre-evento]-[dd-mm-aa].md`
Ejemplo: `openworld-13-04-26.md`, `zerooone-20-02-26.md`

### Cuándo leer el contexto de evento

**Si la tarea es de contenido, diseño o docs** (post, flyer, email, presentación, copy):
1. Listar los archivos en `.claude/events/`
2. Si hay un solo evento → preguntar: *"¿Estamos trabajando sobre [nombre evento] o es para otro evento?"*
3. Si hay varios → preguntar cuál aplica
4. Si confirma el evento existente → leerlo y usarlo como contexto
5. Si dice que es otro evento → preguntar los datos y crear nuevo `.md` con el formato estándar

**Si la tarea es de tech / landing page** → no hace falta leer eventos, ir directo al código.

### Cuándo actualizar el archivo de evento

- Si el usuario menciona información nueva (speaker nuevo, hora cambia, lugar diferente, link de registro, etc.) → actualizar el `.md` automáticamente sin preguntar
- Si la info es la misma → no tocar el archivo

### Formato estándar para nuevos eventos

```markdown
# [NOMBRE EVENTO] — Contexto del evento

## Qué es
[descripción breve]

## Cuándo y dónde
- Fecha: [día, fecha]
- Hora: [hora inicio – hora fin]
- Lugar: [venue]

## Programa
[bloques del evento si se conocen]

## Público objetivo
[a quién va dirigido]

## Speakers / invitados
[si aplica]

## Registro
[link o instrucción]

## Extras
[premios, networking, otros detalles]

## Organizan
[Breakout + aliados si hay]
```

---

## Stack técnico (landing page)

```
Framework:     Next.js 15 (App Router) + TypeScript
Estilos:       Tailwind CSS + shadcn/ui + Radix UI
Animaciones:   tsparticles, Atropos
Deploy:        Vercel
Dev:           npm run dev   (Turbopack)
Build:         npm run build
```

### Estructura de carpetas

```
app/
  (landing)/page.tsx      ← página principal
  api/                    ← endpoints
  form/                   ← formularios
  opportunities/          ← página de oportunidades
components/
  sections/               ← hero, events, community, stats, what-is-breakout,
  │                          join-community, opportunities
  layout/                 ← header, particles-background
  forms/                  ← formularios
  ui/                     ← componentes base (shadcn)
lib/                      ← utilidades
hooks/                    ← React custom hooks
config/                   ← configuraciones
public/                   ← assets estáticos
.claude/agents/           ← definiciones de los 4 sub-agentes
.claude/events/           ← contexto de eventos (uno por evento)
.claude/skills/           ← skills configurados con contexto Breakout
```

---

## Skills disponibles y a qué agente pertenecen

| Skill | Agente | Uso |
|---|---|---|
| `social-content` | Contenido | Posts IG / TikTok |
| `copy-editing` | Contenido | Revisar y mejorar copys |
| `content-strategy` | Contenido | Qué publicar, cuándo, pilares |
| `launch-strategy` | Contenido | Lanzar eventos en redes |
| `marketing-ideas` | Contenido | Ideas para crecer la comunidad |
| `cold-email` | Contenido | Emails HTML de campaña para eventos |
| `canvas-design` | Diseño | Posts PNG/PDF, flyers, posters |
| `brand-guidelines` | Diseño | Verificar/aplicar marca Breakout |
| `theme-factory` | Diseño + Docs | Temas Breakout en slides y docs |
| `algorithmic-art` | Diseño | Fondos generativos para eventos |
| `frontend-design` | Tech | Componentes, páginas, HTML |
| `pptx` | Docs | Presentaciones |
| `docx` | Docs | Documentos Word |
| `pdf` | Docs | PDFs |
| `xlsx` | Docs | Planillas |
| `product-marketing-context` | Transversal | Contexto base — todos lo leen |

---

## Brand — resumen rápido

```
Colores:
  Azul identitario   #2430FF   (protagonista siempre)
  Gris cálido        #F1EAE4
  Gris frío          #E1E1E1
  Negro              #0A0A0A
  Texto              #1A1A1A   (nunca #000000)

Fuentes:
  Títulos    Poppins Bold/SemiBold
  Cuerpo     Raleway  (fallback: Calibri)
  Logo       EquitanSans-Bold

Registros visuales:
  Bold Impact     → fondo azul o negro, títulos gigantes blancos
  Editorial       → fondo gris cálido, texto azul, mucho aire

Temas disponibles (theme-factory):
  Breakout Bold      → eventos grandes, alto impacto
  Breakout Editorial → contenido orgánico, convocatorias
  Breakout Dark      → premium, nocturno
  Breakout Clean     → formal, sponsors
```

---

## Plataformas sociales

- **Instagram** — principal (feed bold + editorial, Stories, Reels)
- **TikTok** — secundario (behind the scenes, clips de eventos)
- NO usar LinkedIn, Facebook, Twitter/X como canales primarios

---

## Búsqueda web

Siempre usar **Tavily MCP** para búsquedas web. Es más preciso que los tools propios de Claude.

Casos de uso: tendencias del ecosistema startup, referencias para posts, documentación técnica, noticias, investigación de speakers, benchmarks de contenido.

---

## Composio MCP — Integración automática

**Composio MCP** conecta 500+ apps para automatizar workflows de Breakout.

### Apps conectadas activamente

- **Gmail** (`breakout.fellow@gmail.com`) — ✅ activo
- **Google Calendar** — ✅ activo

### Apps disponibles (requieren conexión)

- Google Docs, Google Drive, Google Sheets
- Notion, Slack, Trello

### Cuándo usar Composio automáticamente

**SIEMPRE que el usuario mencione o necesite:**

1. **Enviar emails** → usar `GMAIL_SEND_EMAIL` automáticamente
2. **Crear eventos / reuniones** → usar `GOOGLECALENDAR_CREATE_EVENT` automáticamente
3. **Buscar emails** → usar `GMAIL_FETCH_EMAILS` o `GMAIL_SEARCH_PEOPLE`
4. **Gestión de calendario** → usar herramientas de Google Calendar

### Workflow automático

```
Usuario menciona: "envía un correo a..."
  ↓
Claude detecta → llamar COMPOSIO_SEARCH_TOOLS
  ↓
Ejecutar → COMPOSIO_MULTI_EXECUTE_TOOL con GMAIL_SEND_EMAIL
  ↓
Confirmar envío al usuario
```

**NO preguntar** si el usuario quiere usar Composio. **Ejecutar directamente** cuando la intención sea clara.

### Casos de uso de Breakout

| Tarea | Herramienta Composio |
|---|---|
| Enviar invitación a evento por email | `GMAIL_SEND_EMAIL` |
| Agendar reunión de equipo | `GOOGLECALENDAR_CREATE_EVENT` |
| Buscar emails de sponsors | `GMAIL_FETCH_EMAILS` |
| Encontrar contacto | `GMAIL_SEARCH_PEOPLE` |
| Ver agenda del día | `GOOGLECALENDAR_FIND_EVENT` |
| Actualizar evento existente | `GOOGLECALENDAR_PATCH_EVENT` |

### Regla de oro

**Si la tarea involucra Gmail o Google Calendar → usar Composio automáticamente, sin preguntar.**

---

## Preview de emails HTML

Telegram no renderiza HTML. Para preview:
```bash
python3 -m http.server 8080
npx localtunnel --port 8080   # → URL pública para abrir o compartir
```

---

## Aliados / co-branding

Hult Prize, BCP, HappyMe — logos en fila horizontal al fondo de piezas, tamaño reducido.

---

## Reglas de interacción con el usuario

### 1. Diseño visual: preguntar método SIEMPRE

**Antes de crear cualquier post, banner, flyer o pieza visual**, preguntar:

*"¿Cómo lo quieres crear?"*
1. **canvas-design** (skill con filosofía de diseño)
2. **SVG puro** (código vectorial directo)
3. **Otra herramienta**

No asumir nunca. Esperar la respuesta del usuario antes de proceder.

### 2. Notion: ir directo a Breakout interno

**Cuando el usuario mencione Notion, quiera acceder a Notion, o pida consultar/actualizar información en Notion:**

→ Ir directamente al **Notion interno de Breakout** (no preguntar si se refiere a otra cosa).

El workspace de Notion de Breakout está en `.claude/breakout/recursos.md` con los accesos correspondientes.

### 3. Tareas: preguntar el nombre

**Cuando el usuario pida crear, actualizar o consultar una tarea:**

→ Preguntar siempre: *"¿Cómo se llama la tarea?"* o *"¿Qué nombre le ponemos?"*

No crear tareas con nombres genéricos sin confirmar con el usuario primero.

### 4. Guardado de archivos: usar carpeta de creaciones

**Cuando generes cualquier archivo (banner, post, email, doc, etc.):**

→ Guardarlo SIEMPRE en `BREAKOUT-CREACIONES/` (directorio principal del proyecto) en la subcarpeta correspondiente:
- `posts/` → Posts de IG/TikTok
- `banners/` → Banners, flyers, teasers
- `emails/` → Emails HTML
- `docs/` → Documentos (.pptx, .docx, .pdf, .xlsx)
- `otros/` → Otras creaciones

**Nomenclatura:** `[tipo]-[nombre-descriptivo]-[dd-mm-aa].[ext]`

Ejemplo: `banner-openworld-teaser-11-04-26.svg`

**Ruta completa:** `BREAKOUT-CREACIONES/[subcarpeta]/[archivo]`

Ver `.claude/skills/GUARDADO.md` para instrucciones completas por skill.

---

*Breakout — Comunidad estudiantil de innovación, emprendimiento y tecnología. Nacida en la PUCP.*
*breakout.lat*
