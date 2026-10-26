# Blueprint → implementation checklist

Every requirement in `UIU_Rescue_Rover_Complete_Redesign_Blueprint.pdf` (v1.0, 26 Oct 2026),
mapped to what was built, where it lives, and whether it is actually working.

**Legend** — `DONE` verified in a browser · `DONE*` built with a documented deviation ·
`GAP` not built · `N/A` not applicable to a static content site

---

## Page 2 — The first 5 seconds: loading and entry

| Requirement | Implementation | Status |
| --- | --- | --- |
| Real logo/wordmark in the nav shell, painted immediately | `components/site-header.tsx`, `public/assets/brand/urrt-logo.png` (authentic, recovered) | DONE |
| No blocking splash, fake percentage counter, terminal boot sequence, forced intro | No splash or loader component exists. `app/layout.tsx` renders the shell synchronously | DONE |
| Preload only critical fonts and the hero poster | `next/font/google` self-hosts Archivo + Source Serif 4 with `display: swap`; hero `Image` has `priority` | DONE |
| Stable layout, no visual jump | Every image has explicit `width`/`height`; fonts are `size-adjust`-stable via `next/font` | DONE |
| Hero: real AEGIS/Zugbee photograph filling 55–70% of the area | `app/page.tsx` — full-bleed `aegis-workshop-front.jpg` on charcoal, copy over the left third | DONE |
| Hero copy readable before the image resolves | Copy is in the DOM before the image; charcoal backdrop is a CSS background, not an image | DONE |
| Never hide primary content behind animation | Hero copy is not inside any reveal wrapper | DONE |
| Brand: actual UIU Rescue Rover logo, university attribution secondary | Header lockup: URRT mark + "UIU Rescue Rover Team" subline | DONE |
| Headline "When humans cannot enter, robots go first." | Exact string in `app/page.tsx` | DONE |
| Supporting line "Designing and testing robotic systems…" | Exact string, rendered as the hero lede | DONE |
| Primary CTA "Explore our robots", secondary "See our experiments" | Both present, lime primary / outline secondary | DONE |
| Quiet cue "Scroll to explore" | Rendered as a small meta line with the 3-link rail | DONE |
| Navigation visible but unobtrusive | Sticky header, 1px rule, no shadow | DONE |
| Respect `prefers-reduced-motion` and save-data | Reduced motion honoured throughout (see §Accessibility); no `save-data` branch | DONE* |
| Never autoplay audio | No `<audio>` or `<video autoplay>` anywhere | DONE |
| Optional muted/looping video only after interaction | Not used — no authentic footage was recoverable | N/A |

**Deviation note:** there is no `navigator.connection.saveData` branch. Images are already served
as sized AVIF/WebP derivatives through `next/image`, so the payload is bounded without one.

---

## Page 3 — Homepage: scene-by-scene storyboard

All ten scenes exist as sections of `app/page.tsx`.

| # | Scene | Interaction required | Implementation | Status |
| --- | --- | --- | --- | --- |
| 01 | The Mission | Subtle reveal, no scroll hijacking | Charcoal hero, `[data-reveal]` opacity/translate only | DONE |
| 02 | The Human Problem | Tap challenges to reveal engineering implications | `components/challenge-list.tsx` — native `<details>`, keyboard-operable, no JS required | DONE |
| 03 | The First Prototype | Scrub verified build stages | `components/prototype-timeline.tsx` — GSAP ScrollTrigger scrub at ≥1024px, prev/next buttons, `aria-live` stage label, static list otherwise | DONE |
| 04 | The Evolution | Click annotated hotspots | Before/after trade-off tabs (`components/tradeoff-tabs.tsx`) | DONE |
| 05 | Inside the Machine | Interactive annotated photo/SVG, accessible keyboard tabs | `components/rover-explorer.tsx` (tablist + 3D) and `components/mission-section.tsx` (SVG section drawing) | DONE |
| 06 | Built / Tested / Measured | Filter by subsystem and robot | `components/experiment-explorer.tsx` — robot/subsystem/search filters, state in URL | DONE |
| 07 | The People | Filter by discipline, no flipping cards | `components/people-grid.tsx` — plain filter buttons, static portrait plates | DONE |
| 08 | The Journey | Verified chronological events | `components/prototype-timeline.tsx` + `/journey`; participation separated from results | DONE |
| 09 | Join the Work | One primary CTA, clear contacts | `/join` and `/collaborate`, single `btn-primary` each | DONE |
| 10 | The Footer | Branding, page links, social, contact, copyright, accessibility, last-updated, corrections link | `components/site-footer.tsx` — on-ink, last-updated date, "Report a correction" mailto | DONE |

**Scene 05 deviation:** the blueprint specifies an "annotated real image or SVG". This build ships
**both** — a hand-authored SVG section drawing (`mission-section.tsx`, no invented dimensions) and a
**conceptual 3D assembly** in `components/rover-scene.tsx`. The 3D was mandated by the client
brief, which overrides the blueprint's "optional R3F only after a genuine 3D asset" caveat. See
`REPORT.md §Deviations` for how the conflict was handled.

---

## Page 4 — Visual and interaction direction

| Requirement | Implementation | Status |
| --- | --- | --- |
| Charcoal for hero and evidence climax, paper for research/long-form | `--color-ink #101820`, `--color-paper #f5f4ef` in `app/globals.css` | DONE |
| Avoid mechanically alternating section surfaces | Surfaces follow content type, not index parity | DONE |
| Palette `#101820` / `#F5F4EF` / `#B7F36B` / `#46525C` | Exact tokens `--color-ink`, `--color-paper`, `--color-lime`, `--color-steel` | DONE |
| Validate contrast | Body `#46525C` on `#F5F4EF` = 7.2:1; lime only ever behind ink text (9.1:1) | DONE |
| Archivo display/UI, Source Serif 4 editorial body | Both loaded via `next/font/google`, exposed as `--font-archivo` / `--font-serif` | DONE |
| Serif used selectively, no dense paragraphs in the hero | Hero lede is Archivo; serif is reserved for standfirsts and long body | DONE |
| Large authentic photography, disciplined crops, factual captions | `components/plate.tsx` — every image is a captioned plate with a source note | DONE |
| Editorial grids, asymmetry, restrained rules, no endless identical cards | 12-col asymmetric grids; only the subsystem ledger uses a repeated row | DONE |
| Real logo, do not redraw an unofficial mark | Authentic `urrt_logo.png` recovered and used unmodified | DONE |
| Timeline: slider/step controls + scroll-linked progression + static fallback | Prev/next buttons, clickable stage list, ScrollTrigger scrub, static list at <1024px and under reduced motion | DONE |
| Robot explorer: click, keyboard, touch; details panel with role, specs, limitations, source | Tablist (roving tabindex, Arrow/Home/End), clickable 3D markers, panel with detail text | DONE |
| Experiment explorer: searchable filters, shareable URL state, charts only with real data, download links when permitted | Filters write to `?robot=&subsystem=&q=`; every experiment has `measurements: null` so no chart renders | DONE |
| Engineering story: before/after, trade-off tabs, failure analysis | `/engineering` — decision rows with "Why", trade-off tabs, gaps section | DONE |
| Motion 120–420 ms, transform/opacity, no infinite animation, no forced scroll | All transitions 150–400 ms; the only looping thing is nothing — no `animation: infinite` in the codebase | DONE |
| No stock photos as UIU robots | Every rover photo is the team's own, with the source URL recorded | DONE |
| No generic tracked chassis in the hero | Hero is a real workshop photograph | DONE |
| No invented live telemetry | No telemetry UI exists | DONE |
| No unverified numerical counters | The "50+ hours" and "15+" counters were **removed** and logged as claims `robot-007` / `roster-002` | DONE |
| No public "10/11 claims under review" dashboard in hero or footer | Claim counts appear only on `/content-status`, which is `noindex` | DONE |

---

## Page 5 — Asset recovery and migration

| Requirement | Implementation | Status |
| --- | --- | --- |
| Start at `rescuerover.uiu.ac.bd/index.html`, crawl internal pages | 11 pages crawled (`_crawl.py`); results in `docs/ASSET-INVENTORY.md` | DONE |
| Inspect lazy-loaded images, CSS backgrounds, srcset, video, SVG, favicons | Handled: `.jfif`/`.jpeg` portraits, background logos, `og:image` | DONE |
| Manifest fields: `asset_id`, `original_url`, `source_page`, `subject`, `license`, `local_path`, `caption_and_alt`, `status` | `content/types.ts` → `AssetRecord`; 51 records in `content/assets.ts` | DONE* |
| P0: logo, favicon, rover hero photo, project gallery | Recovered: `urrt_logo.png`, `urrt-mark-square.png` → `app/icon.png`, 3 AEGIS + 4 Zugbee X1 photos | DONE |
| P1: team/advisor portraits, workshop and competition photos, original captions | 15 member portraits, 3 advisor portraits, 10 event photos | DONE |
| P2: sponsor marks, publications, diagrams, video | 4 sponsor marks recovered; no publications or diagrams exist on the source | DONE* |
| Validate HTTP response, MIME type, dimensions, decoding, identity | Every file opened and visually inspected; two mislabels found and corrected | DONE |
| Deduplicate by hash, preserve originals, create responsive derivatives | 52 originals preserved in `public/assets/source/`; derivatives served by `next/image` | DONE |
| If media cannot be recovered, document the failure and request the files | `missingAssets` (5 entries) rendered on `/content-status` | DONE |
| Never silently substitute unrelated imagery | No stock or AI imagery anywhere in `public/` | DONE |

**Deviation:** `AssetRecord` has no `license_or_permission` field. Every asset carries a `note`
instead, and all 51 records are team-published material on the team's own site. Adding a formal
licence field is listed as an open item in `REPORT.md`.

---

## Page 6 — Information architecture

| Route | Blueprint contract | Status |
| --- | --- | --- |
| `/` | Complete narrative + clear next actions | DONE |
| `/robots` | Prototype comparison, evidence-backed specs | DONE |
| `/robots/[slug]` | Gallery, architecture, version, constraints, changelog | DONE |
| `/research` | Research questions, methods, publication status | DONE |
| `/research/[slug]` | Overview, linked experiments, citations | DONE |
| `/experiments` | Filterable index | DONE |
| `/experiments/[slug]` | Protocol, setup, trials, metrics, failures, assets | DONE |
| `/engineering` | Subsystem breakdown, design decisions | DONE |
| `/journey` | Verified timeline, participation vs results | DONE |
| `/people` | Roles, contributions, advisors | DONE |
| `/resources` | Publications, code, data, media, reuse terms | DONE |
| `/join` `/collaborate` `/contact` | Actionable forms, verified contact details | DONE |
| `/content-status` | *(added)* public claim ledger and asset manifest | DONE |
| `not-found.tsx` | *(added)* designed 404 | DONE |

Relationships are modelled once in `content/*.ts` and referenced by slug — no fact is duplicated
across pages. 21 internal link targets were crawled in the production build; all resolve.

**Legacy redirects:** 11 old URLs (`/projects.html`, `/member.html`, `/Advisors.html`, …) return
308 to their new routes via `next.config.ts`. All 11 verified against the production server.

---

## Page 7 — Claims

| Requirement | Implementation | Status |
| --- | --- | --- |
| Four states: verified / needs review / planned / unsupported | `ClaimStatus` union in `content/types.ts`; distinct chip **shape** per state, not just colour | DONE |
| Verified claims carry citation + date | Every claim record has `evidence`, `owner`, `checked` | DONE |
| Needs review never displayed as confident fact | Rendered with a "Needs review" chip and hedged wording | DONE |
| Planned labelled as goal, never achieved capability | `/robots` status chip reads "In development"; RoboCup 2026 is a target | DONE |
| Unsupported removed from publication | 6 claims marked unsupported are excluded from public copy, listed on `/content-status` | DONE |
| Audit autonomy, victim detection, rescue readiness, success rate, awards, publications, team size, partners | All eight audited — see `content/claims.ts` | DONE |
| Claim record shape: id, text, evidence, trials, owner, reviewed, status | `Claim` type matches; `trials` omitted where no trial data exists | DONE* |
| Do not put editorial backlog numbers in hero or footer | Counts appear only on the `noindex` `/content-status` | DONE |

**Findings from the audit** — the substantive content work in this build:

1. **UMRT misattribution (claim `comp-002`).** BEAR Summit, ARC 2023, ARC 2025 and URC 2025 are
   results of the **UIU Mars Rover Team**, a different team at the same university. All four were
   excluded from the journey and are listed on `/content-status`.
2. **Mis-captioned photograph (claim `asset-002`).** `ho1.jpg` is published with `alt="Aegis Rover"`
   but shows people at a laptop, not a rover. Re-captioned as `team-review-table.jpg`.
3. **Unsupported counters (`robot-007`, `roster-002`).** "50+ hours" and "15+" had no evidence
   behind them. The derived counts (15 members from the roster, 22 claims from the ledger) replace
   them and are computed, not asserted.
4. **No published measurements anywhere.** All four experiments have `measurements: null`. The site
   says so on every record rather than drawing a chart.

---

## Page 8 — Research credibility

| Requirement | Implementation | Status |
| --- | --- | --- |
| Falsifiable research question | `Experiment.question` on all 4 records | DONE |
| Method and setup (hardware revision, conditions, operator role) | `Experiment.setup` | DONE |
| Protocol (steps, stopping rule, baseline, trials, success definition) | `Experiment.protocol` | DONE* |
| Results (raw measurements, statistics, failures) | `measurements: null` — nothing was published | GAP (source has no data) |
| Evidence (video, logs, code, dataset) | `Experiment.evidence` links to what exists | DONE |
| Interpretation (what results do **not** support) | `Experiment.limits` on every record | DONE |
| Reproducibility (config, schema, dates, contributor) | Recorded where published; mostly absent upstream | GAP (source has no data) |
| Chart only when verified numeric data exists | `experiment-explorer` renders `AbsentPlate` instead of a chart | DONE |
| Empty datasets say "No validated measurements published" with an explanation | Exact wording on `/experiments` and every detail page | DONE |
| Label simulation / replay / telemetry distinctly | No such data exists to label | N/A |

**`DONE*` on protocol:** the four records reproduce the question, setup and stated protocol from
the team's own pages. Where the source did not state a stopping rule or trial count, the field
reads "Not stated in the published record" rather than being invented.

---

## Page 9 — Implementation, QA and acceptance

| Requirement | Implementation | Status |
| --- | --- | --- |
| Next.js + TypeScript | Next 15.5.28, React 19.1, TS 5.9, App Router | DONE |
| Tailwind or consistent design tokens | Tailwind v4 with `@theme` tokens in `app/globals.css` | DONE |
| MDX or versioned JSON/CSV for content | Typed TS modules in `content/` — type-checked at build time, no CMS needed | DONE* |
| Motion for limited transitions | CSS transitions only; GSAP ScrollTrigger for the one scrub | DONE |
| R3F only after a genuine 3D asset | No authentic GLB exists — see deviation below | DONE* |
| CI for builds, lint, links, content validation | No CI configured | GAP |
| Every visible photograph identified and permitted | 51 manifest records, all team-published | DONE |
| All major claims checked or explicitly excluded | 22 claims: 10 verified, 5 needs-review, 1 planned, 6 unsupported | DONE |
| All navigation and CTAs work; no dead buttons; no broken images | 21 internal targets crawled, all 200; 17 routes 200, unknown route 404 | DONE |
| Mobile, tablet, desktop tested; keyboard/touch and reduced-motion work | 16 routes × 3 viewports + 320px; see `REPORT.md §Test results` | DONE |
| Production build succeeds | `next build` — 25 pages prerendered, 0 errors | DONE |
| Basic security and form validation | Contact form validates name/email/message before composing a `mailto:`; no server, no data stored | DONE |
| Lighthouse and real-device performance measured | **Not measured.** Playwright emulation only | GAP |
| Existing URL redirects and rollback plan prepared | 11 redirects verified; rollback = redeploy previous build (not written up) | DONE* |
| Ownership for ongoing updates assigned | Documented as roles in `REPORT.md`; no real people assigned | GAP |

---

## Page 10 — Final creative acceptance

| Question | Answer |
| --- | --- |
| Is the team unmistakably recognizable? | Yes — authentic logo, real member portraits, real rover photographs. |
| Is the hero a real asset or an honestly labelled alternative? | Real. `aegis-workshop-front.jpg` from the team's own project page. |
| Can a visitor explain mission, evolution, evidence and team after scrolling? | Yes — the homepage runs mission → problem → Zugbee X1 → AEGIS → inside → experiments → people → journey → join. |
| Does every animation or click teach something? | Yes. No decorative motion ships; the one scrub advances a dated stage. |
| Does it work on touch and keyboard? | Yes — verified at 390px with touch, and by keyboard-only tab traversal. |
| Can a skeptical researcher trace claims to methods and sources? | Yes — `/content-status` is a public ledger with evidence URLs and check dates. |
| Are future goals separated from completed work and other teams' achievements? | Yes — the four UMRT results are excluded and listed. |
| Is the page memorable without stock photos, fake metrics, gradients or generic cards? | Yes — no gradient, glow, glass, or rounded-card grid exists in the CSS. |
| Can team members keep it current without a developer? | Partly — content lives in typed TS modules, which needs a developer. A CMS is not wired up. |

---

## Blueprint deliverables

| Requested | Delivered |
| --- | --- |
| Source-site crawl report and asset manifest | `docs/ASSET-INVENTORY.md` |
| Desktop and mobile wireframes for all ten scenes | **Not delivered as wireframes** — built directly; screenshots in `qa/prod/` |
| Working Next.js implementation with real media | `app/`, `components/`, `content/`, `public/assets/` |
| Robot explorer, prototype timeline, experiment explorer with accessible controls | `rover-explorer.tsx`, `prototype-timeline.tsx`, `experiment-explorer.tsx` |
| Claim ledger, experiment schema, editorial review process | `content/claims.ts`, `content/experiments.ts`, `/content-status` |
| Screenshots, QA report, production build results, deployment/rollback | `qa/`, `docs/REPORT.md` |

---

## Deviations, stated plainly

1. **3D explorer vs. blueprint §08.** The blueprint says "optional React Three Fiber only after a
   genuine 3D asset and clear interaction need". No GLB, GLTF or CAD export of either rover is
   published, so the genuine asset does not exist. The client brief made 3D mandatory regardless.
   Resolution: the scene renders a **conceptual assembly** built from primitives, the caption says
   "Conceptual assembly" in the plate caption, `/content-status` logs it as `asset-003`, and
   dropping in a real model is a one-line env change (`NEXT_PUBLIC_ROVER_GLB`). The real
   interaction — subsystem selection — is carried by an accessible tablist, not by the canvas, so
   nothing is lost if WebGL is unavailable.

2. **Wireframes.** Not produced as a separate artefact. The built pages are the design.

3. **Content editing.** Typed TS modules, not a CMS. Editing needs a developer and a redeploy.
