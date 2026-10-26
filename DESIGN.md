# DESIGN.md — UIU Rescue Rover

Status: committed direction for v1.  
Read `PRODUCT.md` first; content rules there override anything aesthetic in here.

---

## 1. The world: Field Dossier

The site is built as a **field dossier** — the working document of a team that takes  
machines into places people cannot go. Not a brochure about robots: the record of  
building them.

What that means concretely:

- **Paper is the substrate.** The default surface is warm off-white, because most of  
  this site is read, not admired. Documents, specs, logs, and rosters live on paper.
- **Dark is an event, not a theme.** Charcoal appears only where the subject is  
  night, dust, heat, or a photograph — the mission opening, the evidence section,  
  the closing invitation. Roughly 20% of the page, never alternating rhythmically.
- **Evidence has a visual form.** A verified claim, a missing measurement, and a  
  pending result look different on this site. That difference is designed, not  
  annotated in grey text.
- **Type does the talking.** No decorative frames, no icon confetti. Headings are set  
  large and tight; the grid is asymmetric so a photograph or a diagram can own a  
  column the text does not.

The recurring physical metaphor is the **plate**: a bounded rectangle with a caption  
line beneath it, holding a photograph, a diagram, a table, or — when the asset is  
missing — a statement of what belongs there. Every visual in the site is a plate, and  
a plate always tells you what it is. That single device carries photography, figures,  
and the honesty states without three separate visual languages.

---

## 2. Directions considered

Three were developed far enough to judge. They are rendered side by side in  
`docs/preview-directions.html`.

### A. Field Dossier — *selected*

Paper base, serif editorial body, grotesque display, asymmetric 12-column grid,  
plates with captions, dark cinematic breaks at the narrative peaks.

- **Strengths:** reading-first, which matches the primary job (credibility through  
  evidence). Ages well. Cheap to render — no heavy media. The plate device handles  
  missing assets without looking broken. Scales to the 13 required routes without  
  every page needing bespoke art direction.
- **Trade-offs:** less immediately "wow" in a screenshot than a dark hero. Depends on  
  typography quality, so font choice is load-bearing.

### B. Night Operations — *rejected as the base*

Charcoal-dominant throughout, lime as instrumentation colour, single cinematic hero  
with full-bleed rover imagery, everything else as overlay panels on dark.

- **Strengths:** maximum drama, strong for a competition booth or a projector.
- **Why not:** it fails the reading job. Long methodology text and dense experiment  
  tables are worse on dark, and the effect depends entirely on authentic night  
  photography that does not currently exist — the whole direction would rest on  
  assets we cannot supply. It also drifts toward the "near-black + one acid accent"  
  cluster the brief explicitly warns about. Retained as the treatment for dark  
  sections only.

### C. Spec Sheet — *rejected as the base*

Industrial catalogue: tabular throughout, part numbers, exploded diagrams, no  
narrative, neutral steel on white, everything measured.

- **Strengths:** unbeatable for judges and engineers looking up a specification.  
  Genuinely distinctive; almost nobody builds a university site this way.
- **Why not:** it cannot carry Scene 1–2 of the homepage or the people section. It  
  has no register for "why this matters" or for a human being. Retained as the  
  discipline for spec tables and robot detail pages.

**Decision:** A as the base, with B reserved for the mission opening and evidence  
section, and C's tabular rigour imported into robot specifications. This is the only  
combination that serves all seven scenes and all six audiences without inventing  
assets or dropping into a template.

---

## 3. Typography

Two families. Both variable, both self-hosted through `next/font` (no external font  
requests, no layout shift).

| Role                            | Family                                      | Why                                                                                                    |
| ------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Display, UI, navigation, tables | **Archivo** (variable, wght 400–700)        | A grotesque with industrial-signage bones. Holds up at 5rem and at 13px. Not Inter, not a system face. |
| Long-form editorial body        | **Source Serif 4** (variable, wght 400–600) | Designed for screen reading at length. Carries the "document" feeling that the paper surface promises. |

Deliberate omissions: no monospace family. Numerals in tables use Archivo with  
`font-variant-numeric: tabular-nums` — measurement is expressed by alignment, not by  
a costume typeface.

### Scale

Fluid, clamped, ratio ≈ 1.25 in the body range and ≈ 1.33 at display sizes.

| Token       | Size                              | Line height | Tracking | Family / weight    |
| ----------- | --------------------------------- | ----------- | -------- | ------------------ |
| `display-1` | `clamp(2.75rem, 7.2vw, 5.5rem)`   | 0.94        | -0.03em  | Archivo 600        |
| `display-2` | `clamp(2.125rem, 4.4vw, 3.5rem)`  | 1.00        | -0.025em | Archivo 600        |
| `display-3` | `clamp(1.625rem, 2.8vw, 2.25rem)` | 1.08        | -0.02em  | Archivo 600        |
| `title`     | `1.375rem`                        | 1.25        | -0.01em  | Archivo 600        |
| `body-lg`   | `1.1875rem`                       | 1.6         | 0        | Source Serif 4 400 |
| `body`      | `1.0625rem`                       | 1.65        | 0        | Source Serif 4 400 |
| `ui`        | `0.9375rem`                       | 1.5         | 0        | Archivo 500        |
| `meta`      | `0.8125rem`                       | 1.4         | 0.005em  | Archivo 500        |

Rules:

- Body measure 66–72ch. Serif body gets the higher line-height.
- Display max 5.5rem; tracking floor -0.03em (never -0.04em).
- **No eyebrow/kicker labels above headings.** A heading is preceded by space, not by  
  a label. Where a page needs orientation, it uses a breadcrumb in the meta register.
- Sentence case everywhere. Uppercase is reserved for three-letter acronyms and for  
  the `STATUS` chips, which are a data register, not decoration.
- `text-wrap: balance` on display-2 and above; `pretty` on body paragraphs.

---

## 4. Color

Hypothesis palette from the brief, validated and extended. Ratios computed against  
the surface each token is actually used on (WCAG 2.2 relative luminance).

### Core

| Token         | Hex       | Role                                                                   | Verified contrast                                         |
| ------------- | --------- | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| `ink`         | `#101820` | Primary text on paper; surface for dark sections                       | 16.25:1 on paper                                          |
| `paper`       | `#F5F4EF` | Default surface                                                        | —                                                         |
| `steel`       | `#687580` | Borders, rules, large secondary text, inactive marks                   | 4.29:1 on paper — **large text and non-text only**        |
| `steel-deep`  | `#46525C` | Secondary body text on paper                                           | 7.27:1 on paper                                           |
| `steel-light` | `#97A3AD` | Secondary text on ink                                                  | 6.95:1 on ink                                             |
| `lime`        | `#B7F36B` | Accent: marks, verified state, focus ring on dark, key figures on dark | 13.67:1 on ink; **1.19:1 on paper — never text on paper** |
| `lime-deep`   | `#3F6B12` | Links and accents on paper                                             | 5.74:1 on paper                                           |

### Verification states

The four states must be distinguishable **without colour** (shape + label + colour),  
because they carry meaning.

| State          | Colour on paper | Ratio  | Shape              |
| -------------- | --------------- | ------ | ------------------ |
| `verified`     | `#3F6B12`       | 5.74:1 | filled square      |
| `needs-review` | `#8A5A00`       | 5.38:1 | half-filled square |
| `unverified`   | `#46525C`       | 7.27:1 | hollow square      |
| `draft`        | `#6B4A6B`       | 6.02:1 | dashed square      |

On ink surfaces, `needs-review` switches to `#E0A33C` (8.07:1); `unverified` to  
`#97A3AD`; `verified` stays `lime`.

### Rules

- Lime is never a text colour on paper. It is a fill, a rule, a focus ring, or a mark.
- No gradient anywhere. No glow. No coloured left border on any card.
- Section surfaces are exactly three: `paper`, `ink`, and `paper-sunk` (`#EBE9E1`,  
  used for table headers and inset plates). Nothing else.
- Browser surfaces are themed: selection is `lime` with `ink` text; focus ring is  
  2px `lime-deep` offset 2px on paper, 2px `lime` on ink; scrollbar thumb `steel`  
  on `paper-sunk`; `caret-color` inherits `ink`.

---

## 5. Layout

### Grid

12 columns desktop / 6 tablet / 4 mobile. Gutters 24 / 24 / 16.

Asymmetry is structural, not decorative. Default editorial split is **5/7**, and  
figures take the wide side when they are the point, the narrow side when they are  
supporting. Content never sits dead-centre for more than one section in a row.

The homepage title page does not use the 5/7 split. It is a **diagonal**: the  
headline holds the upper left at `display-0`, the mission statement sits low and  
right at 5 columns starting column 8, and a three-link rail closes the fold.

```
┌──────────────────────────────────────────────┐
│ ████ nav: wordmark ────────────── links  ⌘   │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────┐                │
│  │ display-0                │                │
│  │ 15ch, 3 lines            │   (held empty) │
│  │                          │                │
│  └──────────────────────────┘                │
│                          ┌─────────────────┐ │
│                          │ lede, 5 cols    │ │
│                          │ action          │ │
│                          └─────────────────┘ │
├───────────────┬──────────────┬───────────────┤
│ 01 Engineering│ 02 Evidence  │ 03 The team   │
└───────────────┴──────────────┴───────────────┘
```

Every other section alternates between four-across (`constraint-grid`),  
full-width rows at display scale (`machine-row`), a two-up diagram/tablist  
(`systems-stack`), and a two-column criteria list. No two adjacent sections  
share a shape.

### Containers

| Token              | Value                          |
| ------------------ | ------------------------------ |
| `--container-wide` | 1440px (full-bleed media only) |
| `--container`      | 1280px                         |
| `--container-text` | 720px                          |
| `--gutter`         | 24px → 40px ≥768 → 64px ≥1280  |

### Breakpoints

`480` (large phone) · `768` (tablet) · `1024` (small laptop) · `1280` (desktop) ·  
`1536` (wide). Mobile-first; no fixed pixel widths; no horizontal scroll at 320px.

### Spacing

4px base: `4 8 12 16 24 32 48 64 96 128 160`. Section rhythm: 96px mobile → 160px  
desktop between major sections; always more space above a heading than below it.  
Density dial is spacious (3/10) — this is a reading site, not a dashboard.

---

## 6. Components

**Buttons.** Rectangular, 2px radius, 48px min height. Primary: `ink` fill, `paper`  
text, `lime` 2px bottom rule that thickens on hover. Secondary: 1px `steel` border,  
transparent fill. Tertiary: text with a 1px underline offset 4px. Disabled: 45%  
opacity, `cursor: not-allowed`, no hover change. Loading: label swaps to a verb in  
progress ("Sending…") and the control keeps its width.


**Links.** In prose: `lime-deep`, underline offset 3px, thickness 1px, thickening to
2px on hover. In lists: `ink` with an underline that appears on hover only. Never
colour alone — prose links always carry an underline.

**Navigation.** One line, wordmark left, links centre-right, one action right. Below
1024px it collapses to a full-height sheet that traps focus, closes on Escape, and
returns focus to the trigger. Current page is marked by a 2px `lime` underline and
`aria-current="page"`.

**Plate.** The core media device. A 1px `steel` frame, 0 radius, media inset by 0,
caption beneath in `meta` on `paper-sunk`. Four variants: `photo` (real image only),
`figure` (SVG diagram),`table`, `absent` (states what is missing and who can supply
it). `absent` is a designed state, not an error: dashed 1px frame, `paper-sunk` fill,
and a two-line statement.

**Status chip.** 11px square mark + label in `meta`, sentence case, 1px border.
Never colour-only; the square carries the state.

**Spec table.** No zebra striping. 1px `steel` rules between rows only, header row in
`paper-sunk`, `tabular-nums`, right-aligned numerics, unit in `steel-deep` at 0.85em.
Empty cell renders `—` plus a tooltip-free inline note "not yet documented".

**Figures.** Always captioned `Figure N — description`. Axis lines 1px `steel`, no
gridlines, no fills other than `ink` at 12% for ranges. A chart with no data renders
the `absent` plate with the schema of what will be plotted.

---

## 7. Motion

One authored moment per page, plus state transitions that answer a user action.

| Token | Duration | Easing | Use |
|---|---|---|---|
| `instant` | 120ms | `cubic-bezier(.2,0,0,1)` | Hover, focus, chip state |
| `quick` | 180ms | `cubic-bezier(.2,0,0,1)` | Disclosure, menu, tab |
| `move` | 260ms | `cubic-bezier(.16,1,.3,1)` | Panel, sheet, filter result |
| `reveal` | 420ms | `cubic-bezier(.16,1,.3,1)` | The one entrance, per page |

Rules:

- The authored moment on the homepage is the **timeline scrub** in Scene 3: the
  prototype rail advances with scroll position and the plate crossfades. It is
  scroll-*linked*, never scroll-*hijacked* — the page scrolls at native speed.
- Everything animates from an already-visible default. Content is never hidden
  waiting for JavaScript; the reveal is an enhancement on top of visible content.
- Only `transform` and `opacity` animate. No `width`, `height`, `top`, `left`.
- No infinite loops. No parallax beyond a 12px translate on the hero plate. No
  animation on every element; if two things animate in one viewport, one is wrong.
- `prefers-reduced-motion: reduce` removes the reveal, the hero translate, and the
  timeline crossfade; the timeline becomes a static list with all items expanded.

---

## 8. Interaction principles

1. **Disclosure over navigation.** A component's detail opens in place; it does not
   navigate away and lose the reader's position.
2. **Every interactive element is reachable and operable by keyboard**, with a visible
   focus ring at all times, including on dark surfaces.
3. **Touch targets ≥44×44px**, 8px minimum separation.
4. **State is announced.** Filters report result counts through a live region; the
   rover explorer announces the selected component and its panel.
5. **No hover-only information.** Anything revealed on hover also exists on focus and
   on tap.
6. **Failure and emptiness are designed.** Empty filter results say what was filtered
   and offer to clear it. A missing measurement says what is missing and who owns it.
7. **Deep links.** Filters and selected components live in the URL, so a link to
   "experiments, navigation subsystem" is shareable and restores state.

---

## 9. What this design refuses

Recorded so future contributors do not reintroduce them: purple/blue gradients,
glassmorphism, glow, floating blobs, identical rounded card grids, fake terminals,
eyebrow labels above headings, section numbering used as decoration, icon+heading+text
tiles as page structure, hero metric rows, monospace as a technical costume, emoji as
icons, stock photography presented as team activity, charts containing invented data,
and any entrance animation that delays reading.

---

## 10. Revision — visual redesign of the homepage

The first implementation was structurally honest and visually unsuccessful: six
sections in a row of the same shape (heading left, small paragraph right), a
generic tracked-chassis drawing holding the hero's prime media slot, a large
dashed "image not yet supplied" box, and site-wide workflow copy such as
*"10 of 11 claims are still under review"* addressed to visitors rather than to
the team.

A second pass replaced the layout but removed illustration entirely, leaving the
right half of the hero as empty black space. That was an over-correction: the
brief permits a labelled technical illustration when no photograph exists.

### What changed

1. **The chassis drawing is gone for good.** `components/rover-schematic.tsx` was
   deleted. No photograph of a team build exists in the repository, so nothing on
   the site claims to be one. What replaced it is a *section drawing of the
   environment* (`components/mission-section.tsx`): a collapsed slab, rubble, a
   smoke layer, and the clearance a person cannot pass through. It shows the
   problem the team designs for, not a machine the team did not build.
2. **The illustration is a plate, not a decoration.** Both drawings — the hero
   section and the engineering stack — sit on a paper sheet with a bordered
   caption strip (`Section through a collapsed floor / Not to scale`). A light
   object on the dark field gives the hero a focal point with edges; a
   dark-on-dark line drawing had none.
3. **The hero is a split, not a title page.** Statement, mission and one action in
   six columns; the plate in the other six; a rail of three links closing the
   fold. The copy block is vertically centred, so no gap opens between the
   headline and the mission.
4. **Workflow copy left the public surface.** Claim counts, verification chips and
   the empty dashboard box were removed from the homepage. Verification metadata
   stays in `content/` and on `/content-status`.
5. **Each section got its own shape** — four-across, full-width rows, diagram plus
   tablist, two-column list — so no two adjacent sections read alike.
6. **One real interaction.** The systems stack is a vertical tablist with roving
   tabindex, arrow/Home/End keys, and a live panel. It is verified by
   `scripts/qa-interaction.mjs`, not assumed to work.

### Drawing conventions

Cut material is hatched at 45°, voids are left open, smoke is horizontal dashed
haze rather than a second hatch (so it cannot be confused with structure), and
the route is the only lime element in either plate. No dimension figures are
printed anywhere, because no measurement of the team's envelope has been
verified.

### Deliberate omissions

- The stack drawing is hidden below `1024px`: at phone width its plates render
  ~6px high and its numerals become illegible, so the tablist and panel carry the
  section instead of shipping an unreadable graphic. The hero plate *is* shown on
  mobile, where it remains legible at 342px.
- Section numbering and eyebrow labels were considered and rejected; they would
  have added micro-labels to a page that already had too many.
