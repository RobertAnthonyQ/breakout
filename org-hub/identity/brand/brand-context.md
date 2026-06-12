---
brand_name: "Breakout"
version: "1.0"
date: "2026-05-28"
type: "existing"
archetype:
  primary: "The Hero / Pioneer"
  influencer: "The Outlaw / Rebel"
personality: ["bold", "energetic", "action-oriented", "ambitious", "irreverent"]
voice: ["direct but not blunt", "energetic but not hype", "ambitious but not elitist"]
primary_color: "#214FDD"
industry: "Student innovation & entrepreneurship community (higher education)"
---

# Brand Identity: Breakout

> Source of truth for Breakout's visual and verbal identity. Colors and fonts were
> extracted from the official decks (BREAKOUT CAPITAL, Onboarding 26-1, Convocatoria)
> by reading the exact vector fills and embedded fonts — not approximated.
> Other skills (`brand-guidelines`, presentation templates) should `Read` this file.

## Brand Strategy

### Purpose
To give young people the community, opportunities, and capital they need to break their
own limits and 20x their careers — access that the traditional university path doesn't hand them.

### Vision
A generation driving startups, innovation, and leadership forward — expanding from PUCP
to universities across Peru and then Latin America.

### Mission
We create disruptive, cost-efficient events and strategic alliances that connect students
with the innovation ecosystem: the people, tools, and real opportunities to build their own projects.

### Values

| Value | Meaning | In Practice |
|-------|---------|-------------|
| Action over planning | Bias to ship and experiment | "Make things happen" — events run lean and fast, ideas get tested, not over-deliberated |
| Democratic access | Opportunity shouldn't depend on connections or money | Free/low-cost events, open convocatorias, no gatekeeping |
| Community before competition | We grow by lifting peers | Surround students with the same mindset; warm intros over closed networks |
| Constant experimentation | Permission to try and fail | "Dinero para experimentar y fallar" — Breakout Capital funds the attempt |
| Ambition without arrogance | Aim 20x, stay grounded | Big goals (YC, global VCs) framed as reachable for any student |

### Positioning

> For **ambitious university students** who **want to build, not just study**, **Breakout**
> is the **innovation & entrepreneurship community** that **brings real founders, capital, and
> opportunities onto campus** because **its team has lived the global ecosystem (Stanford d.school,
> University of Twente, YC-adjacent networks) and brings it home**.

### Brand Essence
Break the limits.

### Target Audience

| Persona | Description | Needs | Pain Points |
|---------|-------------|-------|-------------|
| The Aspiring Founder | PUCP student with an idea or itch to build | Mentors, first capital, a team, validation | No network, no funding, no permission to fail |
| The Curious Explorer | Student interested in innovation but not yet building | Inspiration, events, a community with the same mindset | Doesn't know where to start or who to talk to |
| The Ecosystem Partner | VC, startup, accelerator, or company | High-signal young talent, brand presence on campus | Hard to reach motivated students efficiently |

### Competitive Positioning

| Competitor | Their Position | Our Differentiation |
|-----------|---------------|-------------------|
| University career/innovation offices | Institutional, formal, slow | Student-led, fast, culturally native to the audience |
| Generic student clubs | Social, low-stakes | Outcome-driven: capital, alliances, real founders in the room |
| National accelerators/programs | Selective, later-stage | Top-of-funnel: we activate entrepreneurship before students even have a startup |

---

## Visual Identity

### Logo

**Primary lockup:** The **BREAKOUT wordmark** — all caps, geometric sans, with the **"A" replaced
by a solid upward triangle (▲)**. The triangle is the brand's signature device: it reads as
"play / forward / up / breakout." Use white-on-cobalt as the default.

**Mixed-case wordmark:** "Breakout" (sentence case, geometric sans) — used as a smaller corner
signature on content slides and documents, where the full triangle logo would be too loud.

**Symbol (emerging):** The standalone triangle ▲ can be used as an icon/bullet/favicon where the
full wordmark doesn't fit. Keep it solid, point-up, never outlined.

**Clear space:** Minimum clear space on all sides = the height of the triangle (≈ cap height).
Nothing else enters that zone.

**Minimum size:** 120px wide digital / 25mm print for the full wordmark. Below that, use the
triangle symbol alone.

**Asset files** (in `assets/`):
- `logo-breakout-white-on-cobalt.png` — primary, default
- `logo-breakout-cobalt-on-white.png` — light backgrounds
- `logo-breakout-white.png` — white wordmark, transparent (for photos / dark/colored backgrounds)
- `logo-breakout-black.png` — single-color black, transparent
- `logo-breakout-cobalt.png` — single-color cobalt, transparent
- `logo-breakout-triangle.svg` — editable, recolorable master (vector)
- `wordmark-breakout-white-on-cobalt.png`, `wordmark-breakout-black.png` — mixed-case lockups

#### Logo Don'ts
- Do not stretch, rotate, skew, or distort the wordmark or triangle.
- Do not recolor outside the approved set (cobalt, white, black).
- Do not add shadows, gradients, outlines, or effects.
- Do not turn the triangle into an outline or point it sideways/down.
- Do not place white/cobalt logo on a busy photo without a solid color block or scrim behind it.
- Do not reconstruct the wordmark in a different font — use the asset files.

### Color Palette

The palette is built on one decisive, high-energy blue. **Cobalt `#214FDD`** carries the brand;
the electric accent and cyan add punch and signal. Neutrals stay warm and human (never pure black for text).

```json
{
  "colors": {
    "primary": {
      "name": "Azul Breakout (Cobalt)",
      "hex": "#214FDD",
      "rgb": "33, 79, 221",
      "hsl": "225, 74%, 50%",
      "cmyk": "85, 64, 0, 13",
      "pantone": "~2728 C (approx — verify with Pantone Color Bridge before printing)",
      "usage": "The brand. Hero backgrounds, cover slides, primary buttons, key headlines, the default logo background.",
      "tints": {
        "50": "#EDF1FC", "100": "#D7DFF9", "200": "#ABBCF2",
        "300": "#7E99EB", "400": "#4D72E4", "500": "#214FDD",
        "600": "#1B41B5", "700": "#163492", "800": "#10266A", "900": "#0A1842"
      }
    },
    "accent": {
      "name": "Electric Blue",
      "hex": "#2430FF",
      "rgb": "36, 48, 255",
      "hsl": "237, 100%, 57%",
      "cmyk": "86, 81, 0, 0",
      "pantone": "~Blue 072 C (approx — verify before printing)",
      "usage": "Punch only — the triangle device, in-text highlights/links, 'Caso' titles, emphasized words. Never a large background surface.",
      "tints": {
        "50": "#EDEEFF", "100": "#D8DAFF", "200": "#ACB0FF",
        "300": "#8087FF", "400": "#5059FF", "500": "#2430FF",
        "600": "#1E27D1", "700": "#1820A8", "800": "#11177A", "900": "#0B0E4D"
      }
    },
    "secondary": {
      "name": "Spark Cyan",
      "hex": "#6CE5E8",
      "rgb": "108, 229, 232",
      "hsl": "181, 73%, 67%",
      "cmyk": "53, 1, 0, 9",
      "pantone": "~317 C (approx — verify before printing)",
      "usage": "Support/secondary accent: funnel tops, charts, the top of a journey, optimistic/early-stage signals. Pairs with dark text only.",
      "tints": {
        "50": "#F3FDFD", "100": "#E5FAFB", "200": "#C7F5F6",
        "300": "#AAF0F2", "400": "#89EAED", "500": "#6CE5E8",
        "600": "#59BCBE", "700": "#479799", "800": "#346E6F", "900": "#204546"
      }
    },
    "neutral": {
      "white": "#FFFFFF",
      "warm-gray": "#F1EAE4",
      "cold-gray": "#E1E1E1",
      "300": "#C9C9CB",
      "500": "#8A8A8D",
      "text-body": "#363639",
      "text-ink": "#1A1A1A",
      "black": "#0A0A0A"
    },
    "semantic": {
      "success": "#00C46A",
      "warning": "#FFB020",
      "error": "#E5484D",
      "info": "#214FDD"
    }
  }
}
```

#### Color Usage Rules
- **Primary cobalt `#214FDD`:** ~50–60% of brand-heavy pieces (covers, hero sections, the logo lockup).
- **Accent electric `#2430FF`:** ≤10%, highlights only — the triangle, links, one emphasized phrase. Never a full background.
- **Spark cyan `#6CE5E8`:** ≤15%, support accent and data viz; always with dark text on top.
- **Neutrals:** the remainder — white space, body text, dividers. **Never use pure `#000000` for text** (use `#1A1A1A` for headings, `#363639` for body).
- **Never mix cobalt and electric as competing backgrounds** — pick one blue per surface.

#### Accessibility Compliance

| Foreground | Background | Ratio | WCAG AA (normal) | WCAG AA (large) |
|-----------|-----------|-------|------------------|-----------------|
| White | Cobalt `#214FDD` | 6.51:1 | Pass | Pass |
| Cobalt `#214FDD` | White | 6.51:1 | Pass | Pass |
| Ink `#1A1A1A` | White | 17.4:1 | Pass | Pass |
| White | Electric `#2430FF` | 7.14:1 | Pass | Pass |
| Ink `#0A0A0A` | Cyan `#6CE5E8` | 13.21:1 | Pass | Pass |
| Cobalt `#214FDD` | Warm gray `#F1EAE4` | 5.46:1 | Pass | Pass |

> Cyan is **not** accessible with white text — always pair cyan backgrounds with dark text.

### Typography

```json
{
  "typography": {
    "display": {
      "family": "EquitanSans",
      "fallback": "'Poppins', 'Montserrat', Arial, sans-serif",
      "weights": ["SemiBold 600", "Bold 700"],
      "letterSpacing": "-0.5px",
      "usage": "Logo wordmark + the biggest hero words ('Breakout', cover titles)."
    },
    "heading": {
      "family": "Poppins",
      "fallback": "'Montserrat', Arial, sans-serif",
      "weights": ["SemiBold 600", "Bold 700"],
      "letterSpacing": "-0.25px",
      "usage": "Slide titles, section headers, 'Caso' titles, callouts."
    },
    "body": {
      "family": "Raleway",
      "fallback": "Calibri, 'Segoe UI', sans-serif",
      "weights": ["Regular 400", "SemiBold 600", "Bold 700", "Italic"],
      "letterSpacing": "0",
      "usage": "Paragraphs, lists, captions, supporting copy."
    },
    "scale": {
      "ratio": 1.25,
      "base": "16px",
      "display": "64px",
      "h1": "39px",
      "h2": "31px",
      "h3": "25px",
      "h4": "20px",
      "body": "16px",
      "small": "14px",
      "caption": "12px"
    },
    "lineHeight": { "display": 1.05, "heading": 1.15, "body": 1.5 }
  }
}
```

#### Typography Rules
- **Headings:** Poppins SemiBold/Bold only. Never below 18px. Tight tracking on big sizes.
- **Body:** Raleway Regular; SemiBold/Bold for emphasis; Italic for asides. Line length 60–80 chars.
- **Display/logo:** EquitanSans where licensed, otherwise Poppins (the documented fallback used to render the current assets).
- **Max two type families per piece** (Poppins + Raleway). EquitanSans counts as the display tier of the same system.
- Blue highlight = a word/phrase in **Poppins or Raleway Bold, `#2430FF`** inside dark body text.

### Photography & Imagery
- **Subjects:** real students, real events — full rooms, group photos, hands building. Energy and density.
- **Treatment:** natural color, bright, not heavily filtered. Crops are confident and tight.
- **Mood:** momentum, community, "we were there." Never stock-corporate or staged-empty.
- **DO:** big group event photos, candid action, recognizable PUCP/ecosystem context.
- **DON'T:** generic stock handshakes, lone-laptop clichés, muted/grayscale moods.

### Illustration & Devices
- **Triangle ▲** — the core device. Use as logo glyph, bullet, section marker, or a large background shape.
- **Sparkle (4-point star)** — a secondary decorative accent (line or solid), used sparingly on covers to add "spark/idea" energy. Seen in white on cobalt and cobalt on white.
- **Funnels / pyramids / arrows** — preferred way to show process and stages; fill with the blue/cyan scale.
- **Style:** flat, geometric, solid fills. **Filled icons only — never outline icons.**

### Spacing & Layout

```json
{
  "spacing": {
    "base": "8px",
    "scale": { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px", "12": "48px", "16": "64px", "24": "96px", "32": "128px" },
    "borderRadius": { "sm": "6px", "md": "12px", "lg": "20px", "full": "9999px" }
  }
}
```
- Buttons and chips are **pill-shaped** (`--radius-full`); cards use `lg` (20px).
- Layout breathes — aim for 40%+ empty space on content slides (see the white editorial register below).

---

## Voice & Messaging

### Voice Pillars

| We Are | But Not | Example |
|--------|---------|---------|
| Direct | Blunt or cold | "Esa excusa muere hoy." (challenges, doesn't insult) |
| Energetic | Hype or fake-guru | "Make things happen." (action, not adjectives) |
| Ambitious | Elitist | "20x tu carrera" framed as open to any student, not a chosen few |

### Tone by Context

| Context | Funny–Serious (1–5) | Formal–Casual (1–5) | Respectful–Irreverent (1–5) | Enthusiastic–Matter-of-fact (1–5) |
|---------|--------------------|--------------------|----------------------------|-----------------------------------|
| Social / events | 2 (playful) | 4 (casual) | 4 (irreverent, memes ok) | 1 (high energy) |
| Convocatorias / recruiting | 3 | 3 | 3 | 2 |
| Partner / institutional decks | 4 (serious) | 2 (formal-ish) | 2 (respectful) | 2 |
| Internal / team | 2 | 5 | 4 | 2 |

### Messaging Pillars

| Pillar | Key Message | Proof Points |
|--------|------------|-------------|
| Community | Surround yourself with people who have the same mindset | 15-member team, 3 areas, growing member base, events filling rooms |
| Opportunity | We bring the global ecosystem onto your campus | YC founders, global VCs (Magma, Diversity VC), Stanford/Twente roots, Peru Tech Week |
| Capital | Money and a runway to experiment and fail | Breakout Capital, scouting & convocatorias, teams accepted into international programs |

### Elevator Pitch
> Breakout is the student community making innovation and entrepreneurship real at PUCP. We run
> disruptive, low-cost events, bring YC founders and global VCs onto campus, and back student teams
> with Breakout Capital — so any ambitious student can break their limits and 20x their career.

### Tagline
**Primary:** Break the limits. Build the future.
**Variants:** "The new generation driving startups, innovation, and leadership forward." · "Make things happen."

### Boilerplate
**Short:** Breakout is the PUCP student community that makes innovation and entrepreneurship real — events, alliances, and capital.

**Medium:** Breakout is a student-led innovation and entrepreneurship community at PUCP, born out of the University Innovation Fellows program (Stanford d.school + University of Twente). We connect students with founders, investors, and real opportunities through disruptive events, strategic alliances, and Breakout Capital.

**Long:** Breakout is a 15-member, student-led innovation and entrepreneurship community at the Pontificia Universidad Católica del Perú, founded through the University Innovation Fellows program of Stanford's d.school and the University of Twente. We exist to give young people what the traditional path doesn't: a community with the same mindset, access to the global innovation ecosystem, and capital to experiment. Through cost-efficient, high-energy events, strategic alliances across the ecosystem, and Breakout Capital, we help ambitious students break their limits and 20x their careers — starting at PUCP and expanding across Peru and Latin America.

### Writing Do's and Don'ts

| DO | DON'T |
|----|-------|
| "Break the limits. Build the future." | "We strive to foster an environment conducive to innovation." |
| "Make things happen." | "Leverage synergies to drive outcomes." |
| "Surround yourself with people who have the same mindset." | "Network with like-minded individuals to expand your professional circle." |
| Mix ES/EN naturally: "Convocatoria Breakout", "Founder Forge" | Forced full-English or stiff academic Spanish |
| Short, punchy lines with one bold idea | Dense paragraphs nobody reads on a slide |

### Vocabulary

**Always use:**
| Term | Instead of | Why |
|------|-----------|-----|
| comunidad | club / asociación | Belonging, not bureaucracy |
| founder | emprendedor (when speaking to builders) | Ecosystem-native, ambitious |
| 20x | "grow a lot" | Signature, concrete ambition |
| break / breakout | "improve gradually" | On-brand, energetic |

**Never use:**
| Banned | Why | Alternative |
|--------|-----|-------------|
| corporate buzzwords ("synergy", "leverage") | Kills the youthful, direct voice | plain verbs: build, ship, connect |
| over-hedged academic phrasing | Reads slow and institutional | short declaratives |

### Writing Rules
- Voice: active. Contractions: yes. Bilingual ES/EN is on-brand.
- Headings: sentence case or ALL CAPS for impact (match the deck register).
- Emoji: sparing, only in social/internal contexts — not in partner decks.
- Reading level: conversational (≈ grade 8). Average sentence ≤ 18 words.

---

## Applications

### Two Visual Registers

**Register 1 — Bold / Impact** (covers, big event promo):
- Solid cobalt `#214FDD` (or black) background, giant white display type filling the frame.
- Triangle and/or sparkle device. Filled icons. Minimal words.

**Register 2 — Minimal Editorial** (content, announcements, partner decks):
- White / warm-gray `#F1EAE4` background, lots of breathing room.
- Poppins headings (often with one phrase in electric `#2430FF`), Raleway body in dark gray.
- Small "Breakout" mixed-case wordmark in a top corner.

### Social Media Profiles

| Platform | Handle | Profile Image | Notes |
|---------|--------|--------------|-------|
| Instagram | @breakout_community | Triangle symbol or wordmark on cobalt | Primary channel; lead with Register 1 covers |

### Quick Reference

| Element | Value |
|---------|-------|
| Primary color | `#214FDD` (Azul Breakout cobalt) |
| Accent color | `#2430FF` (electric blue — highlights only) |
| Support color | `#6CE5E8` (spark cyan) |
| Display / logo font | EquitanSans (fallback Poppins) |
| Heading font | Poppins SemiBold/Bold |
| Body font | Raleway |
| Logo | BREAKOUT wordmark, triangle ▲ for the "A" |
| Logo clear space | ≥ 1 triangle-height all sides |
| Voice in 3 words | Bold · Energetic · Ambitious |
| Tagline | Break the limits. Build the future. |
