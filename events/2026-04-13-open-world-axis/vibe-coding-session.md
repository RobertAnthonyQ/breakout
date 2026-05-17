# BLOQUE 2 — VIBE CODING: Build Your Startup in 85 Minutes

> **Event:** AXIS — OPEN WORLD | Breakout & Lead PUCP
> **Date:** April 13, 2026 (Full Day)
> **Block Owner:** Freddy Ñañez
> **Time:** 4:20 PM - 5:45 PM (85 minutes)
> **Audience:** ~80 university students, mixed technical levels, interested in entrepreneurship & innovation
> **Comes after:** Bloque 1 (Opportunities, 3:00-4:13 PM) — students are already warmed up
> **Team in room:** Freddy + Robert + Nayheli + 4 volunteers
> **Prize:** Book giveaway for best showcase presentations

---

## 1. THE CONCEPT

### What is Vibe Coding?

"Vibe Coding" is building real software by describing what you want in natural language. You talk to an AI, it writes the code, you see results instantly, and you iterate by conversation. Coined by Andrej Karpathy (ex-Tesla AI, OpenAI co-founder):

> *"You fully give in to the vibes, embrace exponentials, and forget that the code even exists."*

### The Workshop Thesis

Students don't just use a tool — they learn a **process** they can repeat forever:

**Idea → PRD (via any LLM) → Builder (Lovable) → Real working app with AI**

This mirrors how professional engineers and founders actually build in 2026. Students walk away with a process AND a deployed product.

### The "Aha Moment" Chain

This workshop has TWO inflection points, not one:

1. **"Wait, I just built a full landing page from a PRD?"** — after the Build phase
2. **"Wait, my landing page has a WORKING AI chatbot now?"** — after the Chatbot phase

The second one is the real jaw-dropper. Going from static page to AI-powered app in 15 minutes.

---

## 2. TOOLS

### Primary: Lovable (lovable.dev)
| Criteria | Rating |
|----------|--------|
| No setup required | Browser-based, works on any laptop |
| Free tier | Generous free usage (enough for this session) |
| Visual feedback | Live preview as it builds |
| Quality of output | Full-stack apps, modern UI, Tailwind |
| Deployment | One-click deploy to shareable URL |

### Backup 1: Google AI Studio (aistudio.google.com)
- Free with Google account (everyone at PUCP has one)
- Can generate full apps with Gemini
- Students will already have it open for the API key step
- Almost unlimited free usage

### Backup 2: V0 by Vercel (v0.dev)
- Great for UI components and landing pages
- Free tier available
- Less "full app" than Lovable but solid backup

### Backup 3: bolt.new
- Similar to Lovable, browser-based
- Nuclear option if everything else fails

### For PRD Generation (students choose one):
- ChatGPT (most will have this)
- Claude
- Gemini (via AI Studio or web)
- Any LLM they prefer — it doesn't matter which

---

## 3. SESSION FLOW — 85 MINUTES

### Overview

| Phase | Time | Duration | What Happens |
|-------|------|----------|--------------|
| 1. Intro + Q&A | 4:20-4:27 | 7 min | What is vibe coding, audience interaction |
| 2. Tool Landscape | 4:27-4:30 | 3 min | Present Lovable, V0, AI Studio |
| 3. Live Demo | 4:30-4:37 | 7 min | Build audience's idea live in Lovable |
| 4. Setup | 4:37-4:42 | 5 min | Everyone creates Lovable account |
| 5. PRD Generation | 4:42-4:49 | 7 min | Template → LLM → PRD |
| 6. Build | 4:49-5:09 | 20 min | PRD → Lovable → Landing Page |
| 7. Gemini API Setup | 5:09-5:14 | 5 min | Get free API key |
| 8. AI Chatbot | 5:14-5:27 | 13 min | Integrate chatbot into landing page |
| 9. Showcase | 5:27-5:36 | 9 min | 3 volunteers demo |
| 10. Voting + Prize | 5:36-5:40 | 4 min | Audience votes, book giveaway |
| 11. Close | 5:40-5:45 | 5 min | Resources + CTA |

---

### PHASE 1 — INTRO + AUDIENCE Q&A (4:20 - 4:27 | 7 min)

**Goal:** Set the frame, create curiosity, interact with the audience.

#### Interactive Opening (3 min)

Start with questions to the audience (raise hands):

> *"Quienes de ustedes tienen una idea de negocio o de proyecto?" (many hands)*
>
> *"Y quienes de esos no la han construido porque no saben programar?" (many hands)*
>
> *"Ultima pregunta: quienes han escuchado el termino 'vibe coding'?" (some hands)*

#### What is Vibe Coding (4 min)

Brief explanation:

> *"Vibe coding es construir software real describiendo lo que quieres en lenguaje natural. No escribes codigo — describes tu idea, la IA lo construye, y tu iteras en conversacion."*
>
> *"El termino lo acuno Andrej Karpathy, cofundador de OpenAI y ex-director de IA de Tesla. Dijo: 'Te entregas a las vibras, abrazas los exponenciales, y te olvidas de que el codigo existe.'"*
>
> *"Hoy van a vivir eso. En los proximos 80 minutos, cada uno de ustedes va a construir una startup funcional — con landing page, formulario, y hasta un chatbot con inteligencia artificial. Sin escribir una sola linea de codigo."*

| Detail | Value |
|--------|-------|
| Encargados | Freddy |
| Materiales | Mic, slides on projector |

---

### PHASE 2 — TOOL LANDSCAPE (4:27 - 4:30 | 3 min)

**Goal:** Show the ecosystem, then focus on Lovable.

Quick overview of vibe coding tools (1 slide each, 30 sec):

1. **Lovable** — "Este es el que vamos a usar hoy. Creas apps completas desde un prompt. Es gratis y corre en el navegador."
2. **V0 by Vercel** — "Otro builder visual. Bueno para interfaces y componentes."
3. **Google AI Studio** — "De Google, tambien gratis. Pueden crear apps con Gemini. Lo vamos a usar despues para el chatbot."
4. **bolt.new** — "Similar a Lovable. Otra opcion que tienen."

> *"Hay muchas herramientas. Hoy usamos Lovable porque es la mas visual y la mas facil para empezar. Pero el PROCESO que van a aprender funciona con cualquiera."*

| Detail | Value |
|--------|-------|
| Encargados | Freddy |
| Materiales | Slides with tool logos/screenshots |

---

### PHASE 3 — LIVE DEMO (4:30 - 4:37 | 7 min)

**Goal:** Jaw-drop moment. Show what's possible.

> *"Antes de que ustedes construyan, dejenmme mostrarles lo que es posible. Alguien denme una idea de startup. Lo que sea. Mientras mas loca, mejor."*

Take the wildest idea from the crowd. Open Lovable on the projector and type:

> *"Build a modern landing page for [AUDIENCE'S IDEA]. Include a hero section with headline and CTA, a 'How it works' section with 3 steps, features with icons, testimonials, pricing with 3 tiers, a signup form, and a footer. Use a modern color scheme with gradients and animations. Make it responsive."*

Watch the app materialize in real-time. Deploy it. Share the URL. Everyone opens it on their phones.

> *"3 minutos. Sin codigo. Sin programador. Sin presupuesto. Solo una idea y una conversacion."*
>
> *"Pero no les mostre TODO el proceso. Hay un paso ANTES que hace que los resultados sean mucho mejores. Se llama PRD. Y eso es lo que van a aprender ahora."*

**CRITICAL:** Practice this demo at least 3 times. Have pre-recorded video backup.

| Detail | Value |
|--------|-------|
| Encargados | Freddy |
| Materiales | Laptop + proyector, backup video |

---

### PHASE 4 — SETUP (4:37 - 4:42 | 5 min)

**Goal:** Everyone has Lovable open and an LLM ready.

- **Screen shows:** QR code for lovable.dev
- "Necesito que todos abran dos cosas: Lovable en una pestana, y ChatGPT, Claude, o Gemini en otra. Da igual cual usen."
- Students create Lovable account (Google login = 30 seconds)
- Those without laptops pair up
- 4 volunteers circulate helping

| Detail | Value |
|--------|-------|
| Encargados | Freddy + 4 voluntarios |
| Materiales | QR impresos, pantalla con QR |

---

### PHASE 5 — PRD GENERATION (4:42 - 4:49 | 7 min)

**Goal:** Students learn the PRD concept and generate one for their startup.

#### The PRD Concept (2 min)

> *"Antes de construir, los ingenieros profesionales escriben un documento llamado PRD — Product Requirements Document. Es basicamente una descripcion detallada de lo que quieres construir: que paginas tiene, que hace cada seccion, que colores usa, que texto muestra."*
>
> *"Un buen PRD = un buen resultado. Si le das a Lovable un prompt vago, te da algo vago. Si le das un PRD bien hecho, te da una app profesional."*
>
> *"La buena noticia: no tienen que escribir el PRD ustedes. La IA lo escribe por ustedes."*

#### The Template Prompt (5 min)

**Screen shows the template prompt.** Students copy it and paste it into their LLM of choice:

```
I need you to create a detailed PRD (Product Requirements Document) for a landing page.

Here's my project:
- Name: [YOUR STARTUP/PROJECT NAME]
- What it does: [1-2 SENTENCES DESCRIBING WHAT IT DOES]
- Target audience: [WHO IS IT FOR]
- Color vibe: [e.g., "dark and techy", "bright and friendly", "minimalist and clean"]

Generate a complete PRD for a landing page with these sections:
1. Hero section with headline, subheadline, and CTA button
2. "How it works" section with 3 steps
3. Features section with 4-6 key benefits and icons
4. Testimonials section with 3 reviews (use realistic fake names)
5. Pricing section with 3 tiers (Free, Pro, Enterprise) with realistic features per tier
6. Email signup/waitlist form
7. FAQ section with 5 common questions and answers
8. Footer with social links

For each section, specify:
- Exact copy/text to display
- Layout description
- Visual style notes

The PRD should be detailed enough that a developer (or AI tool) can build the entire page from it without asking any questions. Write it as a structured document ready to paste into a no-code builder.
```

Students change the 4 variables in brackets, paste into ChatGPT/Claude/Gemini, and get their PRD in ~60 seconds.

> *"Mientras la IA genera su PRD, leanlo rapido. Si algo no les gusta, diganle que lo cambie. Cuando esten contentos con el resultado, copien TODO el texto."*

| Detail | Value |
|--------|-------|
| Encargados | Freddy + voluntarios |
| Materiales | Template on screen, students use their own LLM |

---

### PHASE 6 — BUILD: Landing Page (4:49 - 5:09 | 20 min)

**Goal:** Everyone pastes their PRD into Lovable and gets a working landing page.

#### Instructions (1 min)

> *"Ahora viene la magia. Abran Lovable, creen un nuevo proyecto, y peguen TODO su PRD. No agreguen nada mas. Solo peguen y denle Enter."*

#### Build Time (19 min)

- Students paste PRD → Lovable starts building
- Lovable takes 1-3 minutes to generate the full landing page
- Students see their app materialize in real-time
- Once generated, they iterate: "Cambia el color a azul", "Hazlo mas moderno", "Agrega animaciones"

**Freddy during build phase:**
- Ambient music playing (lo-fi playlist)
- Walk around with volunteers, hype cool builds
- Show tips on screen every 5 min:
  - +5 min: "Si no te gusta algo, dile a Lovable que lo cambie. Ej: 'Make the hero section bigger'"
  - +10 min: "Quieres que sea en espanol? Dile: 'Translate all text to Spanish'"
  - +15 min: "Deploy tu app! Click en el boton de Share para tener tu link"

**Rules for helpers:**
- Max 2 min per student
- If someone is stuck: "Pega tu PRD tal cual, no lo edites"
- If output is ugly: "Dile: 'Improve the design, make it more modern and clean'"

| Detail | Value |
|--------|-------|
| Encargados | Freddy + 4 voluntarios |
| Materiales | Prompt template on screen, Spotify playlist |
| Spotify | https://open.spotify.com/playlist/5ppeq0AeT80OWB9UjCYGIo |

---

### PHASE 7 — GEMINI API SETUP (5:09 - 5:14 | 5 min)

**Goal:** Every student gets a free Gemini API key.

> *"OK, ya tienen una landing page. Ahora vamos a hacer algo que les va a volar la cabeza: le vamos a agregar un chatbot con inteligencia artificial a su pagina. Y es gratis."*

**Screen shows step-by-step:**

1. Abrir **aistudio.google.com/apikey** (show QR code)
2. Iniciar sesion con cuenta de Google
3. Click **"Create API Key"**
4. Seleccionar cualquier proyecto (o crear uno)
5. Copiar la API key

> *"Este API key es como una llave que le permite a su app hablar con Gemini, la IA de Google. Es completamente gratis."*
>
> *"Nota importante: poner API keys en el frontend no es seguro para produccion. Para este workshop esta perfecto. Si alguno quiere lanzar esto de verdad, hay que moverla a un servidor."*

**Volunteers help students who get stuck.** Most will get the key in under 2 minutes.

**Backup:** Have 3-4 pre-generated API keys ready to share with students who can't create one (account issues, verification problems, etc.)

| Detail | Value |
|--------|-------|
| Encargados | Freddy + 4 voluntarios |
| Materiales | QR to aistudio.google.com/apikey on screen |
| Backup | 3-4 pre-generated keys |

---

### PHASE 8 — AI CHATBOT INTEGRATION (5:14 - 5:27 | 13 min)

**Goal:** Every landing page gets a working AI chatbot.

#### System Prompt Template (3 min)

**Screen shows template.** Students customize the brackets:

```
You are the AI assistant for [STARTUP NAME].
[STARTUP NAME] is [1-2 SENTENCE DESCRIPTION OF WHAT IT DOES].
You help visitors understand the product, answer questions about
features and pricing, and encourage them to sign up for early access.
Be friendly, concise, and enthusiastic.
If asked something you don't know, say: "Great question! Sign up
for early access and our team will follow up with you."
Always respond in Spanish unless the user writes in English.
```

#### Lovable Prompt for Chatbot (2 min)

**Screen shows the prompt to paste into Lovable:**

```
Add an AI chatbot to my landing page:
- Floating chat button in the bottom-right corner with a message icon
- When clicked, opens a sleek chat window
- Welcome message: "Hola! Soy el asistente de [STARTUP NAME]. En que te puedo ayudar?"
- Connects to Google Gemini API (model: gemini-2.0-flash)
- API Key: [PASTE YOUR API KEY]
- System instruction: [PASTE YOUR SYSTEM PROMPT]
- Maintain chat history during the conversation
- Style the chat window to match my landing page colors
- Add a subtle "Powered by AI" badge at the bottom of the chat
```

#### Build Time (8 min)

- Students paste the chatbot prompt into Lovable
- Lovable generates the chat component with Gemini API integration
- Students test their chatbot: ask it questions about their startup
- The chatbot responds using the system prompt context

> *"Prueben su chatbot! Preguntenle sobre su startup. Preguntenle los precios. Preguntenle algo que no sepa. Vean como responde."*

**The moment a student sees their chatbot responding intelligently about THEIR startup is the peak "aha moment" of the entire workshop.**

| Detail | Value |
|--------|-------|
| Encargados | Freddy + 4 voluntarios |
| Materiales | System prompt template + Lovable prompt on screen |

---

### PHASE 9 — SHOWCASE (5:27 - 5:36 | 9 min)

**Goal:** Celebrate what they built. Inspire the room.

#### Selection
During phases 6-8, Freddy pre-selects 3 students with the most impressive or creative builds. Ask them: "Hey, te gustaria mostrar lo que hiciste? Esta increible."

#### Format
- 3 volunteers, **3 minutes each**
- They show their landing page + chatbot on the projector
- 30-second pitch: "Mi startup se llama X, hace Y, y lo que construi hoy es Z"
- Freddy hypes each one: "Aplausos para [nombre]!"
- Encourage them to demo the chatbot live: "Preguntale algo al chatbot en vivo"

**Timer discipline:** 3 min per person. At time, gently transition.

| Detail | Value |
|--------|-------|
| Encargados | Freddy (modera) |
| Materiales | Proyector, mic for volunteers |

---

### PHASE 10 — VOTING + BOOK PRIZE (5:36 - 5:40 | 4 min)

**Goal:** Crown a winner, create a peak memory.

- "Mano alzada: quien usaria la startup de [Volunteer 1]?" Count visibly.
- Repeat for each volunteer.
- Winner gets the **book**. Make it ceremonial — handshake, photo, applause.
- Runner-ups get stickers/merch.
- "Todos los que construyeron algo hoy, dense un aplauso."

| Detail | Value |
|--------|-------|
| Encargados | Freddy |
| Materiales | Book prize, Breakout stickers/merch |

---

### PHASE 11 — CLOSE + RESOURCES (5:40 - 5:45 | 5 min)

**Goal:** Inspirational close. Convert energy into action.

> *"Hace 85 minutos, la mayoria de ustedes nunca habia construido nada. Ahora tienen una landing page profesional con un chatbot de inteligencia artificial que funciona."*
>
> *"Lo que aprendieron hoy no es solo una herramienta. Es un proceso: idea, PRD, builder, deploy. Esto funciona con Lovable, con V0, con AI Studio, con lo que sea. Las herramientas cambian, el proceso queda."*
>
> *"Las herramientas son gratis. Las ideas son suyas. Lo unico que falta es que empiecen."*

**Resources slide with QR:**
- Lovable: lovable.dev
- V0: v0.dev
- Google AI Studio: aistudio.google.com
- Deploy free: Vercel (vercel.com)
- Custom domain: Namecheap ($10/year)
- Payments: Stripe
- Breakout community links

**CTA:**
> *"Ultimo pedido: compartan lo que construyeron en Instagram o LinkedIn, taggeen a @breakout. El mejor post se gana otro premio."*

**Plug Hackathon AI:**
> *"Y si les gusto esto en 85 minutos... imaginen lo que pueden hacer en 24 horas. Breakout tiene un Hackathon de IA proximamente. Esten atentos."*

| Detail | Value |
|--------|-------|
| Encargados | Freddy |
| Materiales | Resources slide with QR codes |

---

## 4. THE TEMPLATES

### Template 1: PRD Generation Prompt (students paste into ChatGPT/Claude/Gemini)

```
I need you to create a detailed PRD (Product Requirements Document) for a landing page.

Here's my project:
- Name: [YOUR STARTUP/PROJECT NAME]
- What it does: [1-2 SENTENCES DESCRIBING WHAT IT DOES]
- Target audience: [WHO IS IT FOR]
- Color vibe: [e.g., "dark and techy", "bright and friendly", "minimalist and clean"]

Generate a complete PRD for a landing page with these sections:
1. Hero section with headline, subheadline, and CTA button
2. "How it works" section with 3 steps
3. Features section with 4-6 key benefits and icons
4. Testimonials section with 3 reviews (use realistic fake names)
5. Pricing section with 3 tiers (Free, Pro, Enterprise) with realistic features per tier
6. Email signup/waitlist form
7. FAQ section with 5 common questions and answers
8. Footer with social links

For each section, specify:
- Exact copy/text to display
- Layout description
- Visual style notes

The PRD should be detailed enough that a developer (or AI tool) can build the entire page from it without asking any questions. Write it as a structured document ready to paste into a no-code builder.
```

### Template 2: System Prompt for AI Chatbot

```
You are the AI assistant for [STARTUP NAME].
[STARTUP NAME] is [1-2 SENTENCE DESCRIPTION].
You help visitors understand the product, answer questions about
features and pricing, and encourage them to sign up for early access.
Be friendly, concise, and enthusiastic.
If asked something you don't know, say: "Great question! Sign up
for early access and our team will follow up with you."
Always respond in Spanish unless the user writes in English.
```

### Template 3: Lovable Prompt for Chatbot Integration

```
Add an AI chatbot to my landing page:
- Floating chat button in the bottom-right corner with a message icon
- When clicked, opens a sleek chat window
- Welcome message: "Hola! Soy el asistente de [STARTUP NAME]. En que te puedo ayudar?"
- Connects to Google Gemini API (model: gemini-2.0-flash)
- API Key: [PASTE YOUR API KEY]
- System instruction: [PASTE YOUR SYSTEM PROMPT]
- Maintain chat history during the conversation
- Style the chat window to match my landing page colors
- Add a subtle "Powered by AI" badge at the bottom of the chat
```

---

## 5. PRE-SESSION SETUP (DIAS ANTES)

| Task | Deadline | Owner |
|------|----------|-------|
| Create Lovable account + practice live demo 3+ times | Apr 12 | Freddy |
| Record video backup of live demo | Apr 12 | Freddy |
| Prepare and test PRD template prompt (verify output quality) | Apr 12 | Freddy |
| Test full chatbot integration flow end-to-end | Apr 12 | Freddy |
| Generate 3-4 backup Gemini API keys | Apr 12 | Freddy |
| Design + print QR codes (Lovable, AI Studio) | Apr 11 | TBD |
| Prepare Spotify playlist | Apr 11 | TBD |
| Prepare resources slide with QR codes | Apr 12 | TBD |
| Get book for prize + stickers/merch | Apr 11 | TBD |
| Assign 4 volunteers for in-room support | Apr 10 | TBD |
| Communicate to attendees: "BRING YOUR LAPTOP" | ASAP | TBD |
| Test Lovable + Gemini API from university WiFi | Apr 12 | Freddy |

---

## 6. RISK MITIGATION

| Risk | Impact | Mitigation |
|------|--------|------------|
| WiFi fails | CRITICAL | WiFi confirmed strong. Backup: phone hotspots + pre-recorded demo video |
| Lovable is down | HIGH | Switch to Google AI Studio (Backup 1) or V0 (Backup 2) |
| Lovable free tier runs out | MEDIUM | bolt.new as backup. Or share a few paid accounts |
| Gemini API key creation fails for some | MEDIUM | Have 3-4 pre-generated keys to share |
| PRD generation is slow | LOW | LLMs are fast. If ChatGPT is slow, use Gemini web (fast) |
| Students don't have laptops | MEDIUM | Pair up. ~50 laptops for 80 students |
| Chatbot integration breaks | MEDIUM | Show a working example on screen. Students who get it working help neighbors |
| Live demo fails on stage | HIGH | Pre-recorded video backup. "Les muestro el video mientras arreglamos" |
| Time runs over | MEDIUM | Flex zone: chatbot phase can compress to 8 min. Showcase can drop to 2 demos |
| Students lost/confused | MEDIUM | 4 volunteers circulating. All templates on screen. "Copia y pega, cambia los brackets" |

---

## 7. PRESENTER NOTES (FOR FREDDY)

### Tone
- Confident, direct, zero filler
- Hype the students' builds, not the tool
- Embrace chaos: "Ven? Le dije que lo arregle. Eso es vibe coding."
- Move fast — 85 min is tight

### Key Phrases
- "Si puedes describirlo, puedes construirlo."
- "El PRD es tu superpoder. Buena instruccion = buen resultado."
- "La herramienta es solo un traductor. La idea siempre fue tuya."
- "Hace 85 minutos no sabian programar. Ahora tienen una startup con IA."

### Things to AVOID
- Don't over-explain how the AI works under the hood
- Don't apologize for limitations
- Don't use jargon without explaining (API, deploy, frontend, PRD on first mention)
- Don't spend more than 2 min on any single student
- Don't run over time — 5:45 is hard stop

### If Running Out of Time
1. Compress chatbot phase to 8 min (skip system prompt customization, give a default)
2. Cut showcase to 2 demos instead of 3
3. Merge voting + close into 2 min
4. Never cut the Build phase — that's the core

---

## 8. POST-SESSION

### Content Capture
- [ ] Screenshots of best student builds (during showcase)
- [ ] Photos of room during build phase
- [ ] Video testimonials: "What did you build?" (3-4 students)
- [ ] Deployed app URLs for showcase post
- [ ] Photo of winner with book

### Follow-Up (Within 48 Hours)
- [ ] Share resources document via WhatsApp/email
- [ ] Post showcase reel on Breakout social media
- [ ] Invite students to Hackathon AI event
- [ ] Create "AXIS Builders" group (WhatsApp/Telegram)
- [ ] Repost student content that tags @breakout

---

*Document version: v3.0 — 2026-04-12*
*Updated: New flow with PRD concept + Gemini AI chatbot integration*
*Author: Freddy Ñañez / Claude*
*Status: Final — ready for execution*
