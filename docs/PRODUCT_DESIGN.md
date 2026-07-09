# PortifolinoDev — Product Design Document

**Codename: HEARTWOOD**
**Author of record:** Marcos (DevWizardMarcos) · **Version:** 1.0.0 · **Date:** 2026-07-05
**Status:** Approved for design → pre-production

---

## 0. Executive Summary

HEARTWOOD is a redesign of Marcos' portfolio as a single explorable place: a forest
clearing at dusk with one ancient tree at its center. The tree is the information
architecture made physical — every branch is a section, every artifact in the world
maps to a real fact in Marcos' career. Visitors *explore* rather than *scroll*.

The single most important decision in this document is that HEARTWOOD is
**two experiences sharing one content source**:

1. **The Grove** — the 3D explorable world (the memory-maker).
2. **The Index** — a fast, beautiful, fully accessible 2D reading mode (the deal-closer).

Every visitor can switch between them at any moment. Recruiters who have 40 seconds
get the Index; recruiters who have 4 minutes get the Grove and never forget it.
Everything else in this document serves that dual promise.

---

## 1. Product Vision

### 1.1 The problem, honestly stated

Recruiters review 50–200 portfolios per role. Almost all of them are the same
artifact: a hero with a typing animation, a grid of cards, a skills wall of logos,
a contact form. The recruiter's brain compresses them into one memory: *"portfolio."*

The failure mode of most "creative" portfolios is the opposite one: they are
memorable but unusable. The recruiter can't find the projects, can't copy the
email, can't open it on a work laptop with a locked-down GPU, and leaves after
ten seconds of loading spinner. Creative debt is still debt.

### 1.2 The vision statement

> **A place, not a page.** A believable, quiet, ancient grove where a developer's
> career grows as a living tree — and where every visitor, regardless of time,
> device, or ability, leaves knowing exactly who Marcos is, what he builds, and
> how to reach him.

### 1.3 Why this wins — three audiences, three arguments

**For recruiters:** memory is the currency. A recruiter who saw "the tree portfolio"
can describe it to a hiring manager three days later. No card grid earns that.
But memorability only converts if the essentials (name, role, seniority, contact,
projects) are reachable in seconds — hence the Index mode and the 5-second header.

**For engineering managers and senior devs:** the portfolio *is* the work sample.
A real-time 3D scene that holds 60fps on a mid-range laptop, degrades gracefully,
scores green on Lighthouse, and ships with a clean repo, conventional commits, and
a written design doc (this one) demonstrates more engineering maturity than any
skills list. The medium is the proof.

**For Marcos:** the existing site already commits to the wizard/journey identity.
This redesign doesn't discard that brand — it matures it. "DevWizardMarcos" stays.
The pixel-RPG literalism (XP bars, level numbers) is replaced by environmental
storytelling, which reads as craft instead of costume.

### 1.4 What HEARTWOOD is not

- Not a game. No score, no inventory, no fail states, no mandatory puzzles.
- Not a tech demo. The 3D exists to carry meaning, never to show off shaders.
- Not a maze. Nothing is more than two interactions away from the visitor.
- Not a template. Every asset and metaphor is specific to Marcos' real career.

---

## 2. Design Principles

Seven principles. Every future design decision must be defensible against them.
When principles conflict, the earlier one wins.

1. **Clarity before magic.** If wonder ever costs comprehension, cut the wonder.
   The visitor must always know where they are, what they can do, and how to leave.

2. **Two doors, one house.** Grove and Index present identical content from one
   data source. Neither is a "lite version" — the Index is designed with the same
   care as the Grove. No visitor is a second-class visitor.

3. **Everything means something.** No decorative object enters the scene without a
   narrative job (see §12). If an artist asks "what is this rock for?" and the
   answer is "it looks nice," the rock is deleted.

4. **Believable, not fantastical.** The grove obeys physical intuition: light has
   a source, moss grows on the shaded side, wind moves everything or nothing.
   Magic is rare and therefore precious — one firefly is magic; a thousand is noise.

5. **The visitor's time is the budget.** 5 seconds to identity, 30 seconds to
   proof, 3 minutes to the full story. Design backwards from these checkpoints.

6. **Motion is language.** Every animation communicates state, causality, or
   attention — never mere delight. If it can be described only as "cool," it fails
   review (see §9).

7. **Ship the floor, dream the ceiling.** Progressive enhancement is the
   architecture, not a fallback plan. The semantic HTML experience works with
   JavaScript disabled; everything above it is enhancement (see §14).

**Why principles come before pixels:** a solo project with a big ambition dies by
a thousand "wouldn't it be cool if" decisions. Recruiters never see the principles,
but they see their absence — bloat, inconsistency, a 14MB bundle. The principles
are the immune system.

---

## 3. User Journey

### 3.1 Personas and their clocks

| Persona | Time budget | Device | What they need | Success looks like |
|---|---|---|---|---|
| **Rúbia**, technical recruiter | 30–60 s | Work laptop, maybe integrated GPU | Name, role, seniority, stack, 2 best projects, contact | Saves the link, mentions "the tree one" to the hiring manager |
| **Daniel**, engineering manager | 3–5 min | Good laptop | Evidence of judgment: code, architecture, trade-offs | Opens the GitHub repo, reads this doc, shortlists |
| **Aline**, senior front-end dev | 5–10 min | Desktop, curious | How it's built; will try to break it | Opens DevTools, finds 60fps and clean code, respects it |
| **Cliente**, small-business client | 1–2 min | Phone | Trust, taste, a WhatsApp/email button | Sends a message |

### 3.2 The journey, beat by beat

**Beat 0 — Arrival (0–2 s).** No loading screen theater. A pre-rendered still of
the grove (LQIP → full image) appears immediately with the identity header already
readable in HTML: *"Marcos — Desenvolvedor Full-Stack · Front-End Specialist ·
Mentor Técnico."* The 3D scene streams in behind it and cross-fades when ready.
*Why:* the 5-second rule is met even on a slow connection, and perceived
performance is decided in the first 400ms.

**Beat 1 — The threshold (2–8 s).** The camera rests at the grove's edge, on a
worn stone path leading to the tree. Two clear invitations, in this order of
visual weight: **"Explorar o bosque"** (primary) and **"Ver versão direta"**
(Index mode, always visible, never shamed — no "boring version" copy).
A quiet third element: the visitor's cursor causes grass to lean away, teaching
"this world responds to you" before any instruction text.

**Beat 2 — The approach (8–30 s).** Choosing to explore moves the camera along
the path in one authored dolly (no free-flight — see §13). Passing landmarks
foreshadow the sections: project stones to the left, the skill garden to the
right, the tree growing to fill the frame. At the tree, the six branches
present themselves with soft light pulses, labeled in plain text.

**Beat 3 — Exploration (30 s–5 min).** The visitor selects branches in any order.
Each branch focuses the camera on its grove landmark and opens a **content panel**
— a real DOM overlay, not text rendered in WebGL (see §13.4). The world stays
alive and visible behind the panel at reduced exposure.

**Beat 4 — The send-off (any time).** The Contact branch is also embodied as a
lantern by the path exit — visible from almost everywhere, glowing slightly
warmer than the ambient light. Leaving is never hard; the way out is lit.

### 3.3 The recruiter fast path (explicitly designed, not accidental)

Rúbia's complete journey: reads the HTML header (2 s) → clicks "Ver versão direta"
(1 click) → scans the Index: hero card, two featured projects with outcomes, stack
summary, one-click email copy and PDF CV download (30 s) → leaves with the link
saved. **Total: under 60 seconds, zero WebGL required.**
*Why this is the most important flow in the document:* it's the highest-frequency,
highest-stakes journey, and it's the one most creative portfolios sacrifice.

---

## 4. Information Architecture

One canonical content model; two renderings.

```
HEARTWOOD
│
├── Identity (always visible: name, role, availability, contact shortcut)
│
├── 1. Projetos ("As Pedras")           — 4–6 curated projects, each: problem,
│      │                                   role, stack, outcome, links
│      └── Project detail (panel/page)
│
├── 2. Experiência ("Os Anéis")         — roles held: company, period, scope,
│                                          impact; teaching & leadership included
│
├── 3. Habilidades ("O Jardim")         — grouped by depth (cultivating /
│                                          proficient / expert), NOT logo wall
│
├── 4. Linha do Tempo ("O Caminho")     — the career path walked to get here;
│                                          education, pivots, milestones
│
├── 5. Sobre ("A Clareira")             — the person: values, teaching, what he
│                                          optimizes for; one great photo
│
└── 6. Contato ("A Lanterna")           — email (copy button), LinkedIn, GitHub,
                                           CV download; response-time promise
```

**IA decisions and why:**

- **Six sections, not ten.** Every added section dilutes the others. Blog,
  testimonials, and uses-page are explicitly deferred (§18).
- **Projects outrank experience** in visual priority for a front-end candidate:
  managers hire on evidence of built things. Experience outranks skills because
  context beats keywords.
- **Skills grouped by depth, not by logo.** A wall of 30 SVG logos signals
  insecurity. Three tiers with 4–6 items each signals self-knowledge — senior
  reviewers consistently read honest tiering as maturity.
- **Curation is the feature.** 4–6 projects maximum. The portfolio's job is to
  start a conversation, not archive a career; GitHub is the archive.
- **Content lives in typed data files** (`/src/content/*.ts` with a schema), so
  Grove and Index can never drift apart, and adding a project never touches
  scene code. This is Principle 2 enforced by the compiler.

---

## 5. Navigation Flow

### 5.1 The model: hub and spokes, camera on rails

```
              ┌────────────────────────────┐
              │   THRESHOLD (landing)      │
              │  [Explorar]  [Índice]      │
              └──────┬──────────────┬──────┘
                     ▼              ▼
              ┌────────────┐  ┌────────────┐
              │  THE TREE  │  │  THE INDEX │
              │   (hub)    │◄─┤ (2D mode)  │  ← switchable anywhere,
              └──┬───────┬─┘  └────────────┘    state preserved
        ┌────────┼───────┼────────┐
        ▼        ▼       ▼        ▼  (any order)
     Projetos Experiência … Contato
        │
        ▼
   Content panel  ── [Esc / X / click outside] ─► back to hub
```

- **The tree is home.** One key (`Esc` or `H`), one persistent UI element
  ("Voltar à árvore"), always returns there. Nothing is deeper than
  hub → branch → detail (two levels).
- **Camera is authored, never free.** Each destination has one hand-tuned camera
  shot. Visitors choose *where*, the camera decides *how*. *Why:* free-flight
  cameras are the #1 usability killer in 3D sites — motion sickness, lost users,
  broken compositions. Rails give game-quality framing with website-quality
  predictability.
- **Full input parity:** pointer (click landmarks or the always-visible text nav),
  keyboard (`Tab` through a real DOM nav that drives the camera; arrow keys cycle
  branches), touch (tap targets ≥ 44px; swipe cycles branches).
- **A persistent slim nav bar** (real HTML, top of viewport) lists all six
  sections + mode switch at all times. The world is the delightful way to
  navigate; the nav bar is the guaranteed way. *Why:* "navigation must be
  obvious" is a hard requirement — discovery is a bonus layer, never a gate.
- **Deep links:** every section and project has a URL (`/projetos/nome-do-projeto`).
  Back/forward buttons work. A recruiter can send a colleague straight to one
  project. *Why:* shareability is how portfolios spread inside hiring teams.

### 5.2 Wayfinding rules

1. The tree is visible (or its glow is) from every camera position.
2. The current section is named in the nav bar and in the panel header.
3. Interactive objects share one affordance language: warm rim-light on
   proximity/hover + cursor change + name label. Non-interactive objects never
   glow. One rule, learned once, never betrayed.

---

## 6. Wireframe Concepts

Low-fi intent, not final art. (D = DOM overlay, W = WebGL.)

### 6.1 Threshold (landing)

```
┌──────────────────────────────────────────────────────────┐
│ D  MARCOS · DEV FULL-STACK          [Índice] [PT/EN] [♿] │
│                                                          │
│ W            ~ grove edge, dusk, path leading in ~       │
│                    ~ tree silhouette, distant ~          │
│                                                          │
│ D        Construo experiências digitais com a            │
│          precisão de um engenheiro e a alma de           │
│          um contador de histórias.                       │
│                                                          │
│ D        [ Explorar o bosque ]   [ Ver versão direta ]   │
│                                                          │
│ D  ↓ desça para entrar                    github · in    │
└──────────────────────────────────────────────────────────┘
```

### 6.2 Hub (the tree)

```
┌──────────────────────────────────────────────────────────┐
│ D  ◂ nav: Projetos Experiência Skills Tempo Sobre Contato│
│                                                          │
│ W                      🌳 (fills frame)                   │
│         branch glows with plain-text labels floating     │
│         near each branch; stones/garden/lantern visible  │
│         at ground level as secondary routes              │
│                                                          │
│ D  hint (fades after first use): "Escolha um caminho"    │
└──────────────────────────────────────────────────────────┘
```

### 6.3 Section panel (e.g., a project)

```
┌──────────────────────────────────────────────────────────┐
│ W  world continues, defocused/darkened ~35%              │
│   ┌───────────────────────────────────────────────┐      │
│ D │ ✕                                  Projetos 2/5 │     │
│   │ NOME DO PROJETO                                │      │
│   │ O problema · Meu papel · A solução             │      │
│   │ [screenshot / short video]                     │      │
│   │ Stack: React · Node · …    Resultado: métrica  │      │
│   │ [Ver ao vivo ↗]  [Código ↗]        ◂ anterior ▸│      │
│   └───────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘
```

### 6.4 The Index (2D mode) — one calm page

Single column, generous whitespace, same tokens and type system as the Grove UI.
Hero card → featured projects (2 large + rest compact) → experience list →
skills tiers → timeline → about → contact. Sticky mini-nav. Print stylesheet
doubles as a CV-adjacent artifact. **This page must be portfolio-grade on its
own** — it is what phones, old laptops, screen readers, and search engines get.

### 6.5 Mobile strategy

Mobile defaults to a **hybrid**: hero shows a lightweight animated scene
(pre-rendered loop or heavily reduced live scene, decided by device benchmark,
§14.6), and content flows as the Index below it. Full Grove on mobile is a
post-launch enhancement (§18), not a launch blocker. *Why:* thermal throttling
and data cost make full mobile 3D a poor first bet; a gorgeous hybrid beats a
janky world.

---

## 7. Design System — "Sistema Raiz" (Root System)

### 7.1 Typography

| Role | Face | Why |
|---|---|---|
| Display / headings | **Fraunces** (variable, optical sizing) | Warm, slightly ancient soft-serif that whispers "storybook" without costume. Replaces Cinzel, which shouts it — Cinzel reads as engraved fantasy and hurts long-text credibility. |
| Body / UI | **Inter** (variable) | Peerless screen legibility; keeps the interface layer modern and professional, creating the tension (ancient world / precise UI) that defines the brand. |
| Code / data | **JetBrains Mono** | For stack labels, dates, and code snippets; signals developer identity in details. |

Type scale (1.250 ratio, rem-based): 12.8 / 16 / 20 / 25 / 31.25 / 39 / 48.8 / 61.
Body 16px minimum, 1.6 line-height; headings 1.1–1.2. Fluid clamp() between
360px and 1440px viewports. Self-hosted, subset, `font-display: swap`.

### 7.2 Color — "Dusk in the Grove"

One master palette serving both the 3D grading and the UI, so the panel never
looks pasted onto the world.

| Token | Hex | Role |
|---|---|---|
| `--night-deep` | `#101B14` | Base background, forest floor shadow |
| `--night-soft` | `#1B2A20` | Panel/surface base |
| `--bark` | `#4A3A2A` | Structural accents, borders, wood UI |
| `--stone` | `#8A8577` | Secondary text, dividers |
| `--moss` | `#5E7D4F` | Success, growth, active states |
| `--parchment` | `#EFE6D4` | Primary text on dark, panel light surface |
| `--bronze` | `#B08D57` | Interactive: links, buttons, focus rings |
| `--ember` | `#D9822B` | Primary CTA, the lantern, "act now" |
| `--glow` | `#F5D98F` | Magic light, hover halos, particles (sparingly) |

Rules: contrast pairs pre-validated to WCAG AA (parchment on night-deep ≈ 13:1;
bronze reserved for large text/UI, never body text on dark). `--ember` appears
in at most one element per view — the CTA. Semantic aliases
(`--color-action`, `--color-surface`…) wrap raw tokens so themes/dark-light
variants are a token swap.

*Why not the current pink (`#d6035b`)?* It fights the natural-materials brief;
warmth in this world comes from fire and bronze, not neon. The energy the pink
provided moves to `--ember`.

### 7.3 Spacing, radius, elevation

- **Spacing:** 4px base → scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
  (`--space-1…-10`). Sections breathe at 96/128; components at 16/24.
- **Radius:** `--r-sm: 6px` (inputs, chips), `--r-md: 12px` (cards, panels),
  `--r-full` (avatar, pills). Nothing between — consistency reads as intent.
- **Elevation:** shadows are moonlight, not Material: low-opacity, slightly
  warm-tinted, large-blur. Three levels (rest / raised / floating) + the glow
  treatment (`--glow` outer halo) reserved exclusively for interactive hover —
  elevation language and affordance language never overlap.

### 7.4 Core components

| Component | Notes |
|---|---|
| `Button` (primary/secondary/ghost) | Primary = ember fill; hover = 2% scale + glow bloom 150ms; visible focus ring (`--bronze`, 2px offset) always |
| `Panel` | The content overlay; parchment-on-night surface, bark border-top detail; traps focus, Esc closes, scroll-locks background |
| `ProjectCard` | Image, name, one-line problem statement, stack chips, outcome metric |
| `SkillTier` | Depth-grouped list; no percentage bars ever (fake precision) |
| `TimelineNode` | Year, event, one sentence; connected by a path line |
| `NavRail` | The persistent HTML nav; current-section indicator = small ember dot |
| `ModeSwitch` | Grove ⇄ Index toggle; preserves current section across modes |
| `GlowTarget` | 3D affordance wrapper: rim-light + label + cursor, one implementation reused by every interactive object |
| `LangSwitch` | PT-BR / EN — content model is bilingual from day one (*why:* international recruiters are a primary audience for Brazilian devs) |

### 7.5 Iconography

Single set (Lucide, stroke 1.5px) tinted `--stone`/`--bronze`. No emoji in UI.
Custom icons only for the six section sigils — simple line engravings
(stone, rings, leaf, path, clearing, lantern) used consistently in nav, panels,
and as subtle carvings on the 3D landmarks. *Why sigils:* they bind the 2D and
3D layers into one brand and give the Index mode a share of the world's identity.

---

## 8. Visual Identity

### 8.1 Brand essence

**"O engenheiro que conta histórias."** The identity lives in the tension between
two truths: rigorous engineer, natural storyteller/teacher. Visually: an ancient,
warm, organic world navigated through a precise, modern, quiet interface. Neither
side ever wins completely — that tension *is* the brand.

### 8.2 Identity elements

- **Name:** "Marcos" leads; "DevWizardMarcos" survives as the handle/domain and
  a single playful signature moment (§20), not as the H1. *Why:* recruiters
  search real names; whimsy in the header costs credibility, whimsy in the
  details earns affection.
- **Logotype:** "M" monogram drawn as a two-branch sapling — geometric
  construction, organic termination. Works at 16px favicon and as the wax-seal
  motif on the CV PDF.
- **Photography:** one excellent, warm-lit, honest portrait in the Sobre
  clearing. No avatar illustration replacing the human — trust needs a face.
- **Voice:** first person, warm, concrete, zero buzzwords. Fantasy vocabulary is
  allowed in *place names* only (As Pedras, A Lanterna); all *facts* are stated
  plainly. "Aumentei a conversão em 23%" never becomes "conjurei um feitiço de
  conversão." *Why:* metaphor in structure charms; metaphor in claims destroys
  credibility with technical readers.

### 8.3 Art direction for the world (reference board)

Golden-hour dusk, low sun through canopy. Materials: silver-grey aged oak bark,
lichen-spotted granite, oxidized bronze fittings, deep moss, drifting pollen.
References: Ori's light discipline (one strong source, everything else bounce),
Fable's friendly-ancient England, Ghibli's believable vegetation density, and —
for restraint — Monument Valley's "few elements, perfect elements."
Anti-references: neon, floating islands, particle storms, lens flares, fog used
to hide unfinished geometry.

---

## 9. Motion Guidelines

### 9.1 The law

**Every motion answers one of three questions: What changed? What caused it?
Where should I look?** A motion that answers none is deleted in review. This is
Principle 6 with teeth.

### 9.2 The physics of this world

- **Durations:** micro-interactions 120–200ms; panel transitions 250–350ms;
  camera moves 900–1600ms. Nothing between 400–800ms (the "sluggish valley").
- **Easing:** UI uses `cubic-bezier(0.22, 1, 0.36, 1)` (fast out, soft landing —
  things in this world settle like leaves). Camera uses eased splines with
  gentle acceleration, max angular velocity capped (comfort, §10).
- **Ambient layer** (the world breathing): canopy sway on wind cycles, grass
  response to cursor, pollen drift, light shafts shifting over minutes. Ambient
  motion is **slow, low-amplitude, and never on interactive elements** — it must
  read as weather, not as invitation.
- **Interactive layer:** proximity rim-light blooms in 150ms, label fades up
  80ms later (stagger implies causality). Click = brief settle of the object
  (2% squash, 180ms) confirming receipt before the camera moves.
- **Transitions carry story:** opening Experiência doesn't cut — the camera
  slides *down* the trunk to the rings (you're reading the tree's history).
  Opening a project moves *along the path* to its stone (projects are milestones
  walked past). The move itself teaches the metaphor.

### 9.3 Respect clauses

- `prefers-reduced-motion`: ambient layer off, camera moves become ≤300ms
  cross-fades, parallax off, panel transitions become opacity-only. Full content
  parity. Offered proactively via the ♿ menu too, not only via OS setting.
- Nothing flashes above 3Hz. No motion is required to discover content.
- A global "reduzir movimento" toggle persists in localStorage.

---

## 10. Accessibility Plan (WCAG 2.2 AA)

Accessibility is an architecture decision here, not an audit patch — the Index
mode is the load-bearing wall.

1. **Parallel semantics:** the canvas is `aria-hidden`; all content and nav
   exist as real DOM at all times (the nav rail, the panels, the Index). Screen
   reader users get the Index experience by default, announced as such:
   "Este portfólio tem um modo visual 3D e um modo de leitura; você está no modo
   de leitura."
2. **Keyboard:** everything reachable in a logical order; visible 2px bronze
   focus rings on all interactive elements (never `outline: none` without
   replacement); focus trapped in open panels, returned to the invoker on close;
   skip-link to main content first in tab order.
3. **Contrast:** all text pairs AA minimum (§7.2 pre-validated); UI glyphs and
   focus indicators ≥ 3:1 against adjacent colors; text over the 3D scene always
   sits on a scrim, never raw over unpredictable pixels.
4. **Targets & inputs:** 44×44px minimum touch targets; no hover-only
   information (labels shown on focus too); no drag-required interactions
   (WCAG 2.2 — dragging alternatives everywhere).
5. **Motion & vestibular safety:** §9.3 in full; camera moves capped in angular
   velocity; no zoom faster than 1.4× per second.
6. **Structure:** correct landmarks (`header/nav/main/footer`), one `h1`,
   ordered headings, `lang` per language switch, alt text policy (scene
   described once meaningfully, decorative images empty-alt).
7. **Testing gate:** axe-core in CI; manual NVDA + VoiceOver pass per milestone;
   keyboard-only walkthrough as a PR checklist item for any UI change.

*Why recruiters care:* inclusive engineering is a hiring signal at serious
companies — and recruiters themselves are often on trackpads, small screens,
and old hardware. The accessible path is the most-used path.

---

## 11. 3D Environment Concept — "A Clareira do Coração" (The Heartwood Clearing)

### 11.1 The place

One clearing, ~60m across, in an ancient temperate forest at perpetual golden
dusk. A single oak — **o Carvalho** — five stories tall at center, asymmetric
and scarred (it has *lived*; perfection is inhuman and forgettable). The forest
beyond is impressionistic — painted density, not modeled trees — keeping the
polycount honest and the eye centered.

### 11.2 The landmarks (each one is a section)

| Landmark | Section | Physical description |
|---|---|---|
| **As Pedras do Caminho** | Projetos | 4–6 waist-high standing stones along the entry path, each carved with a project sigil; moss coverage subtly reflects project age; the newest stone still has fresh-cut edges |
| **Os Anéis** | Experiência | A polished, bronze-inlaid exposed section of the trunk where growth rings are visible; each ring band is a role/era |
| **O Jardim** | Habilidades | A tended garden bed by the roots: mature flowering plants (expert), healthy young plants (proficient), fresh sprouts under a small glass cloche (currently learning) |
| **O Caminho** | Linha do Tempo | The worn path itself, entering the clearing from the dark treeline and reaching the trunk; milestone lanterns mark years |
| **A Clareira** | Sobre | A sitting spot at the tree's base — a wooden bench, a teacher's satchel, chalk and a small slate (the professor's tools), a steaming mug |
| **A Lanterna** | Contato | A bronze lantern hung by the path's far gate, burning ember-warm; the only openly "magic" flame in the scene |

### 11.3 Light is the narrator

The sun sits low behind the tree, so the visitor always walks *toward the
light* — the entire composition points home. Volumetric shafts (billboard-based,
cheap) break through the canopy onto whichever landmark is currently focused:
the world literally highlights the active section. Fireflies exist only near
the tree (knowledge attracts light) and the lantern, ≤ 40 particles total.

### 11.4 Production reality (solo-dev honest)

Asset budget: 1 hero tree (≤60k tris with LODs), 6 landmark props, 1 terrain,
instanced grass/rocks, painted skydome + forest backdrop card ring. Everything
DRACO-compressed GLTF + KTX2 textures; whole-scene download target **≤ 8MB**
(hero image + UI ship first regardless). Stylized-realistic look (hand-painted
texture influence) explicitly chosen because it ages well and forgives modest
geometry — photorealism on a solo budget reads as *cheap*; stylization reads as
*chosen*. Sources: Quixel/Polyhaven bases reworked + Blender kitbash; the hero
tree is the one asset worth commissioning or hand-sculpting.

---

## 12. Environment Storytelling

The scene is a biography that never says "biography." The meaning ledger — every
object's narrative job, kept enforceable (Principle 3):

| Element | Meaning | Discoverable how |
|---|---|---|
| The oak's size & scars | A career grown over years, including hard seasons | A lightning scar on the trunk, healed over — near the Anéis; its ring band corresponds to a real difficult year, acknowledged in one honest line |
| Rings with bronze inlay | Experience made permanent and valuable | Hovering a ring names the role |
| Stones along the path | Projects as milestones *walked past* — done, placed, weathering | Newest stone's fresh edges; oldest stone half-mossed (honesty about legacy work) |
| The garden's cloche | Currently learning, protected but visible | Sprout labels = actual current studies; *why:* showing "still learning" signals growth mindset, a top hiring signal |
| The teacher's slate & satchel | The professor/mentor identity | Sitting area in Sobre; slate shows a real tiny diagram Marcos would draw for students |
| The path from dark treeline | Every career starts somewhere unlit | Timeline's first lantern is dimmest; light grows toward the tree |
| The lantern at the gate | Contact = taking a light with you when you leave | It's the warmest light source; copy: "Leve uma luz consigo" |
| Wind | Time passing; the world doesn't wait | Ambient only |
| One empty stone plinth, uncarved | The next project — possibly *yours* | Near the path exit, subtle; hovering it: "O próximo projeto ainda não foi escrito. Vamos conversar?" → Contact |

That last object is the single cleverest conversion device in the scene: it
turns environmental storytelling directly into a CTA without a single banner.

**Discoverability doctrine:** layer 1 (structure) is unmissable; layer 2
(hover names, light behavior) rewards attention; layer 3 (the scar, the empty
plinth, the signature moment §20) rewards love. No fact exists *only* in layer
2–3 — depth is a bonus, never a gate.

---

## 13. UX Decisions (the contested calls, argued)

**13.1 Authored camera vs. free movement — authored wins.**
Free movement (WASD/orbit) maximizes "explorable" on paper and destroys it in
practice: users get lost, compositions break, motion sickness appears, mobile
has no good mapping. Authored shots give every visitor the art-directed frame.
Exploration lives in *choice of destination and order*, not in piloting.

**13.2 Panels are DOM, not WebGL text.**
Text in-canvas is blurry, unselectable, unsearchable, invisible to screen
readers and Ctrl+F, and can't be copied (recruiters copy emails and stack
lists!). DOM panels over a live scene get native text rendering, native a11y,
native selection — and are cheaper to build. The world is the stage; reading
happens in the theater's program.

**13.3 The Index is a first-class mode, not a fallback page.**
Argued throughout; the operational consequence: the Index is designed and
polished *first* in the roadmap (§17). If the project were somehow cut at 50%,
what exists would already be an excellent portfolio. De-risking by sequencing.

**13.4 Sound: shipped, but opt-in.**
A single ambient bed (wind, leaves, distant birds) + three interaction sounds,
off by default with a visible, tasteful toggle. Autoplaying audio is hostile
(office recruiters!); absent audio wastes atmosphere. Opt-in respects the
context and rewards the invested visitor.

**13.5 No gamification mechanics.**
The current site's XP bar and level number are removed. Progress bars imply
grinding and games imply completion pressure; recruiters have neither time nor
patience to "play." The *world* stays; the *game* goes. Exception: the visited
branches subtly brighten — wayfinding that happens to feel like progress.

**13.6 Loading is content, not apology.**
No percentage bars, no fake tips. Beat 0 (§3.2): instant hero still + readable
identity, scene streams behind, cross-fade when ready. If WebGL fails or the
device benchmarks poorly, the hybrid/Index renders with zero error language —
the visitor never learns they "missed" something.

**13.7 Language: PT-BR and EN at launch.**
The current site is PT-only; the stated audience includes international
recruiters. The content model is bilingual by schema (§4), switcher in the
header, `hreflang` correct. Cost is low at design time and brutal to retrofit.

**13.8 One page-weight covenant, enforced in CI:**
initial route ≤ 300KB gz (before scene), scene ≤ 8MB streamed, LCP < 2.0s on
mid hardware, 60fps target / 30fps floor with automatic quality stepping.
These numbers are in the repo as budgets (bundlesize + Lighthouse CI), which is
itself a portfolio exhibit for engineering reviewers.

---

## 14. Front-End Architecture

### 14.1 Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 19 + Vite** | R3F requires React; Vite for dev speed and clean code-splitting. SSG via `vite-ssg`/prerender for the Index & SEO. Next.js rejected: SSR adds complexity with near-zero benefit for a static, canvas-centric site |
| 3D | **Three.js via React Three Fiber + drei** | Declarative scene graph matches component thinking; drei covers 80% of utility needs (Html, useGLTF, PerformanceMonitor) |
| State | **Zustand** | One tiny store bridging DOM UI and canvas (current section, quality tier, mode, prefs). Redux-class tools rejected: this app has ~10 state atoms |
| UI animation | **Motion (Framer Motion)** for DOM; springs/`useFrame` in-canvas; **GSAP only if** camera spline sequencing outgrows manual easing | One animation system per layer, no overlap |
| Content | Typed TS modules validated by **Zod** schema | Compile-time guarantee that Grove and Index render the same facts (§4) |
| Styling | **CSS custom properties + CSS Modules** | The design system is tokens (§7); zero runtime styling cost. Tailwind rejected as a taste call: token-first CSS shows systems thinking to reviewers reading the source |
| Testing | Vitest + Testing Library (UI), Playwright (journeys incl. keyboard-only + Index), axe-core in CI | The Playwright keyboard journey is the a11y plan's enforcement arm |
| Hosting | Vercel/Netlify + CDN | Static output, preview deploys per PR |

### 14.2 The load-bearing pattern: three layers, one bridge

```
┌──────────────────────────────────────────────┐
│  DOM layer (always present)                  │
│  header/nav/panels/Index — semantic, a11y    │
├──────────────────────────────────────────────┤
│  Bridge: Zustand store                       │
│  { mode, section, qualityTier, prefs }       │
│  DOM writes intent → canvas reads it         │
│  canvas writes readiness → DOM reads it      │
├──────────────────────────────────────────────┤
│  Canvas layer (lazy, optional, aria-hidden)  │
│  <Experience> → Environment / Landmarks /    │
│  CameraRig / Effects — mounted only in Grove │
│  mode on capable devices                     │
└──────────────────────────────────────────────┘
```

The canvas is a *consumer* of app state, never an owner. Kill the canvas and
the app still works — that's Principle 7 as a dependency rule.

### 14.3 Performance playbook

- **Code-splitting:** three.js + R3F + scene chunk load only on "Explorar"
  intent (route-level `lazy()` + prefetch on hover of the button).
- **Assets:** DRACO + KTX2, LODs on the hero tree, instancing for grass/stones,
  merged static geometry, baked AO/lightmaps — real-time lights kept to 2
  (sun + lantern point).
- **Adaptive quality:** drei `PerformanceMonitor` steps DPR (2→1.5→1) and
  toggles volumetrics/particles before frames drop visibly; a 500ms benchmark
  at load picks the starting tier and decides the mobile hybrid (§6.5).
- **Zero-render idle:** on-demand frameloop when no camera move or ambient tick
  is due; battery-friendly.
- **Suspense boundaries** per landmark so the hub is interactive before every
  prop resolves.

### 14.4 Rendering & SEO

Index and all panel content prerendered to static HTML (SSG) with full
meta/OG/JSON-LD (Person + CreativeWork per project). The Grove enhances the
prerendered shell. Result: crawlers, link previews, and no-JS visitors all get
the real content — a canvas-only portfolio is invisible to Google, and
recruiters *do* Google candidates.

### 14.5 Error & capability handling

WebGL context check + benchmark → tier decision (silent). Context-loss handler
restores or gracefully lands in Index. Sentry (or console-endpoint) for real-user
error telemetry — a broken portfolio you don't know about costs interviews.

---

## 15. Folder Structure

```
portifolino-dev/
├── docs/
│   ├── PRODUCT_DESIGN.md          ← this document
│   ├── DECISIONS/                 ← ADRs (numbered, one decision each)
│   └── CONTENT_GUIDE.md           ← voice, PT/EN rules, how to add a project
├── public/
│   ├── models/                    ← .glb (DRACO), versioned filenames
│   ├── textures/                  ← .ktx2
│   ├── images/                    ← hero still, project shots (AVIF/WebP)
│   └── cv/marcos-cv.pdf
├── src/
│   ├── app/                       ← entry, router, providers, mode logic
│   ├── content/                   ← THE single source of truth
│   │   ├── schema.ts              ← Zod schemas
│   │   ├── projects.ts  experience.ts  skills.ts  timeline.ts  about.ts
│   │   └── i18n/ (pt.ts, en.ts)
│   ├── design-system/
│   │   ├── tokens.css             ← §7 as code
│   │   └── components/            ← Button, Panel, Card, NavRail, …
│   ├── features/
│   │   ├── index-mode/            ← the 2D experience (built first)
│   │   ├── panels/                ← section panel implementations
│   │   └── shared hooks (useSection, usePrefs, useQualityTier)
│   ├── experience/                ← everything canvas (lazy-loaded boundary)
│   │   ├── Experience.tsx         ← <Canvas> root
│   │   ├── camera/                ← rig, shots, splines
│   │   ├── environment/           ← terrain, tree, sky, lighting, wind
│   │   ├── landmarks/             ← Stones, Rings, Garden, Path, Clearing, Lantern
│   │   ├── effects/               ← particles, volumetrics, postprocessing
│   │   └── systems/               ← quality tiers, frameloop control, audio
│   └── lib/                       ← store, analytics, a11y utils
├── tests/                         ← e2e/ (Playwright journeys), a11y/
├── scripts/                       ← asset pipeline (compress-models, etc.)
└── .github/ (workflows, ISSUE_TEMPLATE, PULL_REQUEST_TEMPLATE.md)
```

Boundary rule (lint-enforced): `experience/` may import from `content/`, `lib/`,
`design-system/tokens` — never from `features/`; `features/` never imports from
`experience/`. The bridge store is the only shared surface. This is §14.2 made
mechanical.

---

## 16. Git & GitHub Workflow

- **Branches:** trunk-based-lite. `main` always deployable; short-lived
  `feat/…`, `fix/…`, `content/…`, `chore/…` branches; no develop branch
  (solo project — ceremony must pay rent).
- **Commits:** Conventional Commits (`feat(experience): add lantern glow shot`),
  enforced by commitlint + husky. *Why:* changelog automation and a public
  history that reads like a professional team's — reviewers *will* read it.
- **PRs — yes, solo PRs:** every branch merges via PR with the template filled:
  what/why, screenshots or scene captures, checklist (a11y pass, budgets green,
  reduced-motion checked). CI (lint, typecheck, tests, Lighthouse, axe,
  bundlesize) must pass. Self-review with inline comments on tricky parts.
  *Why:* the repo is a portfolio exhibit; a disciplined solo PR history is rare
  and memorable to engineering managers.
- **Issues & milestones:** issues labeled `type:` / `area:` / `phase:`;
  milestones map 1:1 to roadmap phases (§17). A public GitHub Project board —
  transparency itself is a signal.
- **Releases:** SemVer. `v1.0.0` = public launch; minors = new
  content/features; tags get generated changelogs (changesets or
  release-please). Deploy previews per PR; production deploys from tags only.
- **README:** hero GIF of the grove, one-paragraph concept, live link, stack
  badges (restrained), architecture sketch, performance/a11y budget results,
  link to this document, credits for assets. The README is written for a senior
  engineer with 90 seconds.

---

## 17. Roadmap

Sequenced by risk and by the "cut at 50%" test (§13.3). Solo pace, part-time.

| Phase | Scope | Exit criteria |
|---|---|---|
| **0 — Foundation** (1–2 wk) | Repo, CI, tokens.css, content schema + real content written (hardest task, done first), bilingual copy | All six sections' final text exists in `content/`; CI green |
| **1 — The Index** (2–3 wk) | Full 2D mode: design system components, all sections, SEO/SSG, print CV, a11y pass | Lighthouse ≥ 95 ×4; deployable as a complete portfolio **(soft-launchable — replaces current site)** |
| **2 — The Threshold** (2 wk) | Hero still + streaming scene shell, mode switch, benchmark/tiering, camera rig with 2 shots | Beat 0–1 works on low-end hardware; budgets hold |
| **3 — The Grove** (4–6 wk) | Hero tree, terrain, lighting; six landmarks + authored shots; panels over canvas; wind + particles | Full hub-and-spokes loop at 60/30fps tiers; keyboard journey passes |
| **4 — The Soul** (2–3 wk) | Storytelling layer 2–3 (scar, cloche, empty plinth, signature moment), audio opt-in, polish pass on every transition | Meaning ledger (§12) fully implemented; reduced-motion parity verified |
| **5 — Launch** (1 wk) | Real-user perf telemetry, OG images, analytics (privacy-light), README, `v1.0.0` | Public launch + LinkedIn/community posts |

The current Bootstrap site stays live until Phase 1 replaces it — never a
"coming soon" gap while job-hunting.

---

## 18. Future Improvements (explicitly deferred)

- **Seasons:** grove state by real date (subtle — autumn palette, winter mist);
  returning visitors notice, which invites return visits.
- **Full mobile Grove** once tiering data from real users justifies it.
- **Field notes (blog)** as a new landmark (a journal on the bench) — only when
  there are ≥3 posts worth reading; an empty blog is worse than none.
- **Case-study deep dives** with scroll-driven storytelling inside project panels.
- **Testimonials** as voices in the grove (carved on the bench) after collecting
  real quotes from students/colleagues.
- **Easter-egg depth:** a constellation visible in the canopy gap that maps to
  his GitHub contribution pattern. Layer-3 material, post-launch.
- **WebGPU renderer path** when ecosystem support matures.

Deferral rationale: every one of these is additive to a finished thing; none is
load-bearing. Scope discipline is the difference between a shipped signature
piece and an eternal WIP.

---

## 19. Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Scope creep / never ships** — the classic death of ambitious solo portfolios | High | Fatal | Phase 1 is soft-launchable; phases are strict gates; §18 is a parking lot with rules; this doc is the contract with self |
| 2 | **Performance on real recruiter hardware** (old ThinkPads, integrated GPUs) | High | High | Tiering + hybrid + Index (§14.3, §6.5); test matrix includes a deliberately weak device; budgets in CI |
| 3 | **"Gimmick" perception** by conservative reviewers | Medium | High | Index mode is one click and excellent; facts stated plainly (§8.2); repo/README foreground engineering rigor |
| 4 | **3D asset quality below the bar** (solo, not a 3D artist) | Medium | High | Stylized direction forgives geometry (§11.4); budget one commissioned/hand-built hero asset (the tree); everything else kitbash + paint; cut props before shipping mediocre props |
| 5 | **Content weakness hiding behind visuals** — beautiful grove, thin projects | Medium | High | Phase 0 writes all content first; each project must state problem/role/outcome or it doesn't ship |
| 6 | **SEO/discoverability loss** vs. plain HTML site | Medium | Medium | SSG + JSON-LD (§14.4); Index is the crawlable canonical |
| 7 | **A11y regression during 3D iteration** | Medium | High | axe + keyboard Playwright journey in CI; PR checklist item (§16) |
| 8 | **Browser/driver breakage** (WebGL context loss, Safari quirks) | Low–Med | Medium | Context-loss handler → Index; error telemetry (§14.5); cross-browser pass per milestone |
| 9 | **Timeline pressure** (needs a portfolio *now*) | Medium | Medium | Same as #1: Phase 1 ships a complete, excellent portfolio early |
| 10 | **Asset licensing** issues from kitbashed sources | Low | Medium | License audit in README credits; CC0/owned sources only |

---

## 20. Final Creative Direction

Hold the whole thing to one sentence:

> **A quiet ancient place that proves a loud modern skill.**

The grove must feel *inevitable* — as if Marcos' career always was a tree and we
merely photographed it. Restraint is the luxury note: one tree, one light, one
lantern, six meanings. Where other portfolios add, HEARTWOOD deepens.

The interface must feel like a fine instrument laid on old wood: modern,
precise, warm by association. The tension between the two layers is never
resolved, because that tension is the person — engineer and storyteller,
professor and builder.

**The signature moment** (build it in Phase 4, tell no one): when a visitor has
seen all six sections and returns to the tree, the wind rises once, the canopy
parts for two seconds, and the dusk light catches a small bronze plate at the
tree's base that was always there, unlit: *"Feito à mão por Marcos — obrigado
por caminhar até aqui."* Then the light moves on. No badge, no confetti, no
share button. The visitors who see it will tell people about it — and being
told "you have to explore the whole thing to see it" is the only viral
mechanic worthy of this place.

That is the bar for every decision that follows this document: not "does it
impress in a screenshot," but **"will someone describe it to a colleague three
days later?"** The tree, the lantern, the empty stone waiting for its carving —
these are designed to be retold. Build nothing that isn't.

---

*Document ends. Next artifact: ADR-001 (stack ratification) and the Phase 0
content-writing sprint. The grove is planted on paper; now we grow it.*
