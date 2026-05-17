# Breakout — Monorepo

This repo holds two subprojects. Read the relevant one's docs before working.

```
web/        Landing page breakout.lat — Next.js 16 + React 19 + Tailwind 4.
            Deploy: Vercel with Root Directory = web/.
            Run: cd web && npm install && npm run dev
            Docs: web/README.md

org-hub/    Breakout organizational knowledge base (slow-moving source of truth):
            areas, identity, people, events, alliances, templates, archive,
            creations (produced assets), and .claude (content-ops + ROCKY persona).
            Operating manual: org-hub/CLAUDE.md  ← read this for any org/docs task.
```

## Routing

- Web / landing / app / React / deploy work → `web/` (see `web/README.md`). Don't run app commands from repo root.
- Org info (members, events, alliances, identity, brand, resources) or asset creation → `org-hub/` (see `org-hub/CLAUDE.md` for the full rules).
- Daily tasks, weekly calendar, real-time coordination → Notion (not this repo).

Both prior repos' git histories are preserved in this one (merged 2026-05-16).
