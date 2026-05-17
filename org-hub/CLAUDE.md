# Breakout — Organizational Hub

## What is Breakout

Breakout is a 15-member student innovation and entrepreneurship organization at PUCP (Peru). Founded by Freddy Nanez and Andrea Melo through the University Innovation Fellows program (Stanford d.school + University of Twente). Current semester: 26-1.

## Workspace Map

### Areas (by team)
- **Community & Experience:** `areas/community-experience/` — events, community, culture (lead: Tatiana)
- **Growth & Innovation:** `areas/growth-innovation/` — growth strategy, content, new initiatives (lead: Robert)
- **Partnerships & Programs:** `areas/partnerships-programs/` — alliances, programs, revenue (lead: Andrea)
- Each area README has: team members, purpose, objectives, metrics, projects, Notion link
- When Freddy asks about an area, read the area's README.md first.

### People
- **Team roster:** `people/team.yml` — All 15 members with name, email, area, role, skills, availability
- To look up a member, read `people/team.yml`

### Events
- **Past events:** `events/YYYY-MM-DD-slug/` — Each has README.md (overview) + metrics.yml (stats)
- **Planned events:** `events/planned/` — Skeletons for upcoming events
- Current past events:
  - `events/2026-02-20-zero-one/` — First event, panel with Hult Prize
  - `events/2026-04-13-open-world-axis/` — AXIS Full Day with Lead PUCP

### Alliances
- **Alliance pipeline:** `alliances/pipeline.yml` — All 11 organizations with status, contacts, objectives
- To check alliance status, read `alliances/pipeline.yml`

### Identity
- **About (mission, vision, origin):** `identity/about.md`
- **Org structure (3 areas):** `identity/org-structure.md`
- **Brand guide (colors, TODOs):** `identity/brand/brand-guide.md`
- **Logo assets:** `identity/brand/assets/` (empty — pending)
- **Accesses & tools:** `identity/resources.md` — links/tools/admins (credentials redacted; real ones in the team password manager)

### Web App
- **`web/`** — the breakout.lat landing page (Next.js 16 + React 19 + Tailwind 4, deploy on Vercel). Robert's app.
- App-specific docs: `web/README.md`. Run `cd web && npm install && npm run dev`.
- **Vercel config:** set the project **Root Directory = `web/`**.

### Creations
- **`creations/`** — all produced assets (banners, emails, posts, docs). Naming: `[tipo]-[nombre]-[dd-mm-aa].[ext]`. See `creations/README.md`.

### Content-ops / ROCKY persona
- **`.claude/ROCKY.md`** — legacy content/design/tech/docs agent system + "ROCKY" persona from Robert's repo. **Not the global persona of this repo** — applies only when explicitly doing Breakout content/design ops, and only if Freddy opts in.

### Templates
- Event planning checklist: `templates/event-planning.md`
- Post-event retrospective: `templates/post-event-analysis.md`
- Meeting notes: `templates/meeting-notes.md`
- New member onboarding: `templates/onboarding.md`
- Alliance proposal: `alliances/templates/alliance-proposal.md`

### Archive
- Notion snapshots: `archive/notion-snapshots/`
- Latest snapshot: `archive/notion-snapshots/2026-04-08-snapshot.md`
- Notion structure map (DBs, collection URLs): `archive/notion-snapshots/2026-04-11-notion-map.md`

## Key External Resources (from Notion)

| Resource | URL | Description |
|----------|-----|-------------|
| Email repo | https://github.com/DavidSChing/Breakout-correos | Mailing HTML templates by David Ching |
| Email viewer | https://davidsching.github.io/Breakout-correos/ | Visual preview of past mass mailings |
| PUCP student DB | Google Sheets (see Notion "Links importantes") | Student enrollment data by faculty |
| Photo drive | Google Drive (see Notion "Links importantes") | Event photos archive |

## What Lives in Notion (NOT here)

- Active task boards (Pendientes)
- Daily calendar
- Meeting notes in progress
- Real-time coordination
- Sprint/weekly planning

This repo is the slow-moving source of truth. Notion is the daily workflow tool.

## Organizational Structure

Three areas, each with a lead:
1. **Community & Experience** — Tatiana Mirella (events, community, culture)
2. **Growth & Innovation** — Robert Quispe (growth strategy, content, new initiatives)
3. **Partnerships & Programs** — Andrea Melo (alliances, programs, revenue)

Co-founders: Freddy Nanez, Andrea Melo.

## Rules

- When Freddy asks about a member, read `people/team.yml` first.
- When Freddy asks about an alliance, read `alliances/pipeline.yml` first.
- When Freddy asks about an event, check `events/` for the relevant folder.
- When Freddy asks about brand/identity, check `identity/brand/brand-guide.md`.
- When asked to add a new event, create a folder under `events/` with `YYYY-MM-DD-slug` naming and include README.md + metrics.yml.
- When asked to add a new member, add an entry to `people/team.yml` following the existing schema.
- When asked to add a new alliance, add an entry to `alliances/pipeline.yml` following the existing schema.
- For landing-page / web work, everything lives in the repo's top-level `web/` (sibling of this `org-hub/`) — don't run app commands from here.
- When generating any asset (banner, email, post, doc), save it under `creations/` with the standard naming.
- Never commit plaintext credentials. `identity/resources.md` keeps creds redacted by design.
- Documents in this repo are primarily in Spanish (the team's language). CLAUDE.md is in English for Claude.

## Repo Structure (post-merge, 2026-05-16)

Monorepo of two prior repos (both git histories preserved):

```
<repo root>
├── web/                    Next.js landing app (breakout.lat) — Vercel root dir
├── org-hub/                ← YOU ARE HERE: the org knowledge base
│   ├── areas/ identity/ people/ events/ alliances/ templates/ archive/
│   ├── creations/          produced assets (was BREAKOUT-CREACIONES)
│   ├── .claude/            agents, skills, ROCKY.md (content-ops persona)
│   └── CLAUDE.md README.md
└── CLAUDE.md README.md     slim monorepo orientation
```

All `org-hub/` paths in this doc (e.g. `people/team.yml`) are relative to this
`org-hub/` directory.
