# Breakout

Organizacion estudiantil de innovacion y emprendimiento — PUCP.

Este repositorio es la fuente de verdad para la identidad, miembros, eventos, alianzas y materiales de Breakout. Las tareas diarias, reuniones y coordinacion se manejan en Notion.

---

## Estructura del Repositorio

```
breakout/
├── identity/               Quienes somos
│   ├── about.md              Mision, vision, origen
│   ├── org-structure.md      3 areas, roles, herramientas
│   └── brand/                Guia de marca, logos
│
├── people/                 Nuestro equipo
│   └── team.yml              15 miembros: nombre, email, area, skills
│
├── events/                 Historial de eventos
│   ├── 2026-02-20-zero-one/     ZERO ONE (panel con Hult Prize)
│   ├── 2026-04-13-open-world-axis/  AXIS (Full Day con Lead PUCP)
│   └── planned/                  Eventos por venir
│
├── alliances/              Pipeline de alianzas
│   ├── pipeline.yml          11 organizaciones con estado y contactos
│   └── templates/            Plantilla de propuesta de alianza
│
├── templates/              Plantillas reutilizables
│   ├── event-planning.md     Checklist de planificacion de evento
│   ├── post-event-analysis.md  Retrospectiva post-evento
│   ├── meeting-notes.md      Notas de reunion
│   └── onboarding.md        Guia para nuevos miembros
│
└── archive/                Archivos historicos
    └── notion-snapshots/     Exports periodicos de Notion
```

## Que esta aqui vs. que esta en Notion

| Aqui (repositorio) | En Notion |
|---------------------|-----------|
| Identidad y mision | Tareas diarias (Pendientes) |
| Roster de miembros | Calendario semanal |
| Historial de eventos con metricas | Notas de reuniones |
| Pipeline de alianzas | Coordinacion en tiempo real |
| Guia de marca | Sprint planning |
| Templates | Links de Canva/Sheets/Luma |

## Como usar

### Buscar informacion de un miembro
Abrir `people/team.yml` — contiene nombre, email, area, skills y disponibilidad de los 15 miembros.

### Documentar un nuevo evento
1. Crear una carpeta en `events/` con formato `YYYY-MM-DD-nombre-del-evento/`
2. Copiar `templates/event-planning.md` como punto de partida
3. Despues del evento, crear `metrics.yml` con los datos de asistencia y satisfaccion

### Revisar el estado de una alianza
Abrir `alliances/pipeline.yml` — lista las 11 organizaciones con estado, contacto, y fecha de ultimo contacto.

### Agregar un nuevo miembro
Agregar una entrada al final de `people/team.yml` siguiendo el formato existente.

---

**Links Rapidos:**
- [Notion Workspace](https://www.notion.so/) (pedir acceso a Andrea)
- [Canva del equipo](https://www.canva.com/) (cuenta compartida)
