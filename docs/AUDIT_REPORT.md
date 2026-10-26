# Audit report — UIU Rescue Rover Team website

**Audited:** 27 October 2026
**Repository:** `D:\website\Intereactive_URRT-website`
**Live deployment audited:** <https://urrt-website.netlify.app>
**Original content source:** <https://rescuerover.uiu.ac.bd>
**Build audited:** `next build` output, 27 prerendered routes, served with `next start -p 4311`

---

## 0. How this audit was run

Everything below was reproduced against a production build, not the dev server.

```bash
npm run build
npx next start -p 4311
node qa/audit.mjs http://localhost:4311      # axe-core, console, network, overflow, link graph
node qa/tests.mjs http://localhost:4311      # 185 assertions
node qa/lighthouse.mjs http://localhost:4311 # Lighthouse, mobile + desktop
node qa/imagecheck.mjs http://localhost:4311 # every <img> on every route, in a real browser
```

The audit tooling is committed: `qa/audit.mjs`, `qa/tests.mjs`, `qa/lighthouse.mjs`,
`qa/imagecheck.mjs`, `qa/overflow.mjs`, `qa/project.mjs`. Raw output is in
`qa/audit/audit.json`, `qa/tests/results.json`, `qa/lighthouse/summary.json`.

### Headline before/after

| Measure | Before | After |
| --- | --- | --- |
| axe-core violations (22 routes) | **42** (3 rules, 233 nodes) | **0** |
| Colour-contrast nodes below 4.5:1 | **210** | **0** |
| Console errors / page errors | 0 | 0 |
| Horizontal overflow cases (21 routes × 6 widths) | **1** | **0** |
| Images that never finish loading | **1 of 23** on `/` | **0** |
| Public routes with a canonical URL | **0 of 21** | **21 of 21** |
| `robots.txt` / `sitemap.xml` | **404** | 200 |
| Experiment records in served HTML | **0** (Suspense fallback only) | **4** |
| Automated assertions passing | n/a | **185 / 185** |

### State of the live deployment

The deployed build at `https://urrt-website.netlify.app` **predates every fix in
this report**. Verified directly:

```
$ curl -s https://urrt-website.netlify.app/experiments | grep -c BAILOUT_TO_CLIENT_SIDE_RENDERING
1
$ curl -s https://urrt-website.netlify.app/experiments | grep -o "Loading experiment records"
Loading experiment records
$ curl -o /dev/null -w "%{http_code}" https://urrt-website.netlify.app/robots.txt
404
$ curl -s https://urrt-website.netlify.app/ | grep -c 'rel="canonical"'
0
```

A redeploy of this repository is required before the live site reflects any of it.
See `docs/QA_REPORT.md` §7.

---

## 1. Issue register

Severity: **P0** breaks the site for real users · **P1** breaks a core promise or
a stated requirement · **P2** degrades usability, accessibility or credibility ·
**P3** polish.

---

### P0-01 · AVIF image variants never complete; images stay blank

| | |
| --- | --- |
| **Severity** | P0 |
| **Affected** | `next.config.ts`; every page with an `<Image>`; observed on `/` |
| **Component** | Next.js image optimiser |

**Reproduction**

```bash
curl -m 25 -o /dev/null -w "%{http_code} %{time_total}\n" \
  -H "Accept: image/avif,image/webp,*/*" \
  "http://localhost:4311/_next/image?url=%2Fassets%2Frobots%2Faegis%2Faegis-obstacle-side.jpg&w=828&q=75"
# → 000  25.005   (timeout, no response)
```

Same URL with `Accept: image/webp,*/*` → `200 image/webp 39080 bytes 0.05s`.
Same URL with no `Accept` header → `200 image/jpeg 48720 bytes 0.00s`.

**Expected** The optimiser returns an AVIF, a WebP, or an error — it does not hang.
**Actual** The request never completes. Chrome advertises `image/avif` by default,
so the browser sits on a pending request and the `<img>` never fires `load`.
`naturalWidth` stays 0 and the plate renders as an empty box.

**Second symptom, same cause.** A 27-request concurrent burst produced one
indefinite hang:

```
$ node -e "…18 concurrent optimizer requests, 15s timeout…"
total 18 bad 1 ["ERR:TimeoutError"]
```

**Root cause** `images.formats: ["image/avif", "image/webp"]` opts into on-demand
AVIF encoding. On this host the AVIF path is both the most expensive (measured
3 235 ms for 27 concurrent requests against 902 ms for the same set as WebP) and
capable of stalling without returning.

**Fix applied** `next.config.ts`

```ts
formats: ["image/webp"],
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
```

WebP is supported by every browser this site targets. `3840` was also dropped
from `deviceSizes`: it was the most expensive variant to encode and the widest
plate on the site is ~800 CSS px, so 1920 already covers a 2× display.

**Verification** `node qa/imagecheck.mjs` walks all 15 content routes in Chromium,
scrolls to the bottom, and asserts every `<img>` has `naturalWidth > 0`:

```
/                        images=23 notLoaded=0
/people                  images=20 notLoaded=0
… all 15 routes …
Distinct stuck image URLs: 0
```

Also asserted in `qa/tests.mjs` → group `assets`, 2/2 pass.

**Trade-off, stated plainly** AVIF would have saved roughly 20% of bytes per
image. A blank image slot is worse than 20% more bytes.

---

### P1-01 · `/experiments` served only a loading placeholder

| | |
| --- | --- |
| **Severity** | P1 |
| **Affected** | `app/experiments/page.tsx`, `components/experiment-explorer.tsx` |
| **Symptom reported** | "Loading experiment records…" state |

**Reproduction**

```bash
curl -s https://urrt-website.netlify.app/experiments | grep -o 'data-dgst="[^"]*"'
# data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"
curl -s https://urrt-website.netlify.app/experiments | grep -c "aegis-flipper-stair-ascent"
# 1 — only inside the RSC flight payload, not in the DOM
```

Disable JavaScript and open `/experiments`: the main column contains the string
`Loading experiment records…` and no records.

**Expected** The four experiment records are in the served HTML.
**Actual** `useSearchParams()` inside a client component on a statically
prerendered route forces Next to bail the whole subtree out to client-side
rendering. The prerendered HTML therefore contains *only* the Suspense fallback.
The records appear once hydration completes — and never, if a chunk fails to
load, if JavaScript is disabled, or for a crawler that does not execute scripts.

**Fix applied**

- Removed `useSearchParams` entirely.
- Filter state is read from `window.location.search` in a mount effect, so the
  server render and the first client render both show the unfiltered list and
  hydration never mismatches.
- URL updates use `history.replaceState` instead of `router.replace`, which also
  stops every keystroke in the search field triggering an RSC round-trip.
- `popstate` is listened for, so Back and Forward restore the previous filter.
- Removed the `Suspense` wrapper from the page.

**Verification**

```bash
node -e "…chromium with javaScriptEnabled:false…"
records visible without JS: true
loading string present: false
list items: 15
```

`qa/tests.mjs` → group `experiments`, 21/21 pass, including "records render with
JavaScript disabled" and "no 'Loading experiment records' in the served HTML".

**Note on the other possible causes** This was not a failed API call, a bad data
path, or a runtime exception. The data is bundled at build time; there is no
request to fail. That is also why there is no error-with-retry state on this
page: inventing one would mean inventing a failure mode that cannot occur. The
empty state ("No experiments match this filter", with a Clear filters button) is
the only state the page can legitimately reach.

---

### P1-02 · Layout did not respond to viewport changes

| | |
| --- | --- |
| **Severity** | P1 |
| **Affected** | `components/prototype-timeline.tsx` (homepage, scene 03) |
| **Viewport** | 320 px after resizing from 1440 px |

**Reproduction**

```bash
node qa/overflow.mjs http://localhost:4311 / 320   # fresh load at 320 → 0px overflow
# then: load at 1440, resize to 320
# clientWidth 320 scrollWidth 376  → +56px
```

**Expected** The sticky scrub falls back to the static list below 1024 px.
**Actual** `window.matchMedia("(min-width: 1024px)")` was sampled once in
`useEffect` and never watched. Resizing below 1024 px left the 12-column sticky
scrub layout in place: 11 × 32 px grid gaps alone exceed a 320 px viewport, so
the figure overflowed by 56 px and the page gained a horizontal scrollbar.

The same defect existed in reverse: a tablet rotated to landscape never gained
the scrub.

**Fix applied**

- Both `(min-width: 1024px)` and `(prefers-reduced-motion: reduce)` are now
  watched with `matchMedia` `change` listeners; either changing tears down or
  rebuilds the ScrollTrigger.
- The scroll wrapper is now rendered in **both** branches so the trigger always
  measures a stable element. Previously the trigger was created against the
  static-fallback `<div>`, which the `setScrub(true)` re-render then unmounted —
  leaving ScrollTrigger bound to a detached node.

**Verification** `qa/tests.mjs` → group `responsive`:

```
PASS  responsive  21 routes × 6 widths without overflow
```

Widths exercised per route: 1280, 1024, 768, 480, 375, 320 (stepped down from a
1440 load, which is the failing path).

---

### P1-03 · 210 text nodes below the WCAG AA contrast threshold

| | |
| --- | --- |
| **Severity** | P1 |
| **Affected** | `app/globals.css` and 32 call sites across `app/` and `components/` |
| **Routes** | all 22 |

**Reproduction**

```bash
node qa/audit.mjs http://localhost:4311
# before: axe=2 or 3 violations per route, rule color-contrast, 210 nodes total
```

**Expected** Small text meets 4.5:1.
**Actual** `--color-steel` (`#687580`) computes to **4.29:1** on `--color-paper`.
`DESIGN.md` already restricts that token to "borders, rules, large secondary
text, inactive marks — **large text and non-text only**". The implementation
used `text-steel` for 13 px `.meta` labels, codes, dates and table cells
throughout — 32 distinct call sites, 210 rendered nodes.

**Fix applied**

- Added `--color-steel-mid: #5c6873` (5.18:1 on paper, 4.69:1 on paper-sunk) as
  the small-text step between `steel` and `steel-deep`.
- Replaced all 32 `text-steel` text usages with `text-steel-mid`.
- `--color-steel` is unchanged, so borders, rules and scrollbars keep their
  weight.
- Documented the new token in `DESIGN.md` §2 Core palette.

**Verification** `node qa/audit.mjs` → `axe violations: 0` across 22 routes.

---

### P1-04 · Plate captions were unreadable on dark sections

| | |
| --- | --- |
| **Severity** | P1 |
| **Affected** | `components/plate.tsx`, `app/globals.css`, 14 caption call sites |
| **Route** | `/` (hero), and every `on-ink` plate |

**Reproduction** `node qa/audit.mjs` → `/` reported 2 `color-contrast` nodes in
`.plate-caption`: `.font-semibold.text-ink.block` and `.mt-1.text-steel-mid.block`.

**Expected** Caption text is legible on the surface it sits on.
**Actual** The hero plate sits inside an `.on-ink` section whose caption
background is `#18222c`. The caption's title line was hard-coded `text-ink`
(`#101820`) — near-black on near-black, effectively invisible. The note line was
hard-coded `text-steel-mid`, 2.84:1 on that background.

**Fix applied** Colour is now owned by the surface, not the call site:

```css
.plate-caption .plate-strong { color: var(--color-ink); }
.plate-caption .plate-note   { color: var(--color-steel-mid); }
.on-ink .plate-caption .plate-strong { color: var(--color-paper); }
.on-ink .plate-caption .plate-note   { color: var(--color-steel-light); }
```

`plate.tsx` emits `plate-note`; 14 caption titles now use `plate-strong` instead
of a hard-coded `text-ink`.

**Verification** axe 0 violations; `qa/sections/01-hero.png` shows the caption
legible on charcoal.

---

### P1-05 · Date-sensitive content asserted a future that had already passed

| | |
| --- | --- |
| **Severity** | P1 |
| **Affected** | `content/site.ts`, `content/timeline.ts`, `content/claims.ts`, `app/collaborate/page.tsx`, `app/page.tsx`, `components/site-footer.tsx` |
| **Routes** | all (meta description), `/`, `/journey`, `/collaborate` |

**Reproduction** Read the `<meta name="description">` on any page:

> "…and **is preparing an entry for** RoboCup Rescue 2026."

RoboCup 2026 ran **30 June – 6 July 2026** and closed on 6 July
(<https://robocup.org/events/80>, <https://rrl.robocup.org>). Today is
27 October 2026.

**Expected** Copy that reflects the calendar.
**Actual** Six places used present or future tense for an event four months gone,
including the site-wide meta description, the footer, the homepage sponsorship
paragraph and the sponsorship page.

**Fix applied** See `docs/FACT_CHECK_REPORT.md` for the full claim-by-claim
record. In summary:

- Site description now reads "…publishes the engineering record — including what
  is not yet known."
- Added `competition` to `content/site.ts` with the verified event facts (dates,
  venue, `eventStatus: "concluded"`, `teamStatus: "No published participation record"`).
- Timeline entry retitled "RoboCup Rescue 2026, Incheon — event concluded" with
  the real dates and an explicit statement that participation is unconfirmed.
- Timeline reordered chronologically (the March 2026 entry previously sat above
  the January 2026 entry).
- `/journey` now shows Event / URRT status as a definition list with both
  organiser and league source links.
- Claim `comp-001` moved from `planned` to `needs-review`, with the organiser
  sources recorded as evidence.

**Verification** Full-text sweep for `preparing|upcoming|target` across
`app/`, `components/`, `content/`; every remaining use is either past tense or
explicitly labelled a target. `/content-status` counts update automatically
(derived from `claims`).

---

### P1-06 · No `sitemap.xml`, no `robots.txt`, no canonical URLs

| | |
| --- | --- |
| **Severity** | P1 |
| **Affected** | `app/sitemap.ts` (new), `app/robots.ts` (new), every page's metadata |

**Reproduction**

```bash
curl -o /dev/null -w "%{http_code}" https://urrt-website.netlify.app/robots.txt    # 404
curl -o /dev/null -w "%{http_code}" https://urrt-website.netlify.app/sitemap.xml   # 404
curl -s https://urrt-website.netlify.app/ | grep -c 'rel="canonical"'              # 0
```

**Fix applied**

- `app/sitemap.ts` — 20 URLs, generated from `content/robots.ts`,
  `content/experiments.ts` and `content/research.ts` so it cannot drift from the
  content. `/content-status` is deliberately excluded.
- `app/robots.ts` — allows everything, disallows `/content-status`, declares the
  sitemap and host.
- `alternates: { canonical: … }` added to all 11 static pages and all 3 dynamic
  `generateMetadata` functions.

**A trap avoided:** adding `canonical` to `app/layout.tsx` would have been
inherited by every page that did not override it, making all 21 routes claim to
be the homepage. Canonical is set per page instead.

**Verification** `qa/tests.mjs` → group `seo`, 7/7:

```
PASS  seo  robots.txt exists and points at the sitemap
PASS  seo  sitemap lists every public route  [20 urls]
PASS  seo  sitemap excludes the noindex ledger
PASS  seo  og:image is absolute
PASS  seo  homepage canonical points at the deployment host
PASS  seo  /content-status is noindex
PASS  seo  page titles are unique
```

---

### P1-07 · `metadataBase` pointed at a host that does not serve this build

| | |
| --- | --- |
| **Severity** | P1 |
| **Affected** | `app/layout.tsx`, `content/site.ts` |

**Actual** `metadataBase: new URL("https://rescuerover.uiu.ac.bd")`, while the
site is deployed at `https://urrt-website.netlify.app`. Every relative Open Graph
image and canonical therefore resolved against the university's *original* site —
so a share card would have pointed at the old site's asset path.

**Fix applied** `content/site.ts` exports `siteUrl`, read from
`NEXT_PUBLIC_SITE_URL` with the Netlify deployment as the default. `layout.tsx`
uses it for `metadataBase`, `openGraph.url` and the sitemap/robots generators.

**Verification**

```
PASS  seo  og:image is absolute
      [https://urrt-website.netlify.app/assets/events/team-competition-rover.png]
PASS  seo  homepage canonical points at the deployment host
      [https://urrt-website.netlify.app]
```

**Required for go-live** If the site moves to its own domain, set
`NEXT_PUBLIC_SITE_URL` in the host's environment. Nothing else changes.

---

### P2-01 · Header logo failed `label-content-name-mismatch`

| | |
| --- | --- |
| **Severity** | P2 |
| **Affected** | `components/site-header.tsx` |
| **Routes** | all 22 |

**Actual** The home link carried `aria-label="UIU Rescue Rover Team — home"` while
its visible text reads "URRT". A speech-input user saying "click URRT" would not
match the accessible name.

**Fix applied** Removed the `aria-label`. The accessible name is now computed from
the visible content ("URRT UIU Rescue Rover Team"), which is both accurate and
immune to drift.

**Verification** axe 0 violations, rule `label-content-name-mismatch` no longer
fires on any route.

---

### P2-02 · `/experiments` skipped a heading level

| | |
| --- | --- |
| **Severity** | P2 |
| **Affected** | `components/experiment-explorer.tsx` |

**Actual** `h1` → `h3` (record titles) → `h2` ("Why there are no charts").

**Fix applied** Record titles are `h2`. Visual size is unchanged because the
`.title` class sets it, not the tag.

**Verification** axe 0 violations; rule `heading-order` no longer fires.

---

### P2-03 · 3D scene had no camera reset and no context-loss handling

| | |
| --- | --- |
| **Severity** | P2 |
| **Affected** | `components/rover-scene.tsx`, `components/rover-explorer.tsx` |

**Actual**

- A user who orbits into an awkward framing had no way back except reloading.
- If the GPU dropped the WebGL context (common on mobile under memory pressure)
  the canvas froze on its last frame with no message and no recovery.

**Fix applied**

- `CameraRig` restores the opening framing when `resetKey` changes; a
  `Reset view` button in the caption bumps it and announces the change through
  the existing `aria-live` region.
- `ContextGuard` listens for `webglcontextlost`, prevents the default, and swaps
  in the same accessible fallback used for "WebGL unavailable", with copy that
  says what happened and what to do.

**Verification** `qa/tests.mjs` → group `three`, 11/11, including
"reset-view control is present", "reset view does not throw", and the
`javaScriptEnabled`/`getContext → null` fallback path.

---

### P2-04 · 3D markers were ~20 px targets

| | |
| --- | --- |
| **Severity** | P2 |
| **Affected** | `components/rover-scene.tsx` → `Marker` |

**Actual** The marker disc is `0.082` world units; on a 657 × 492 canvas that is
roughly 20 CSS px. Below the 44 px touch minimum and awkward with a mouse. The
caption tells the user to "select a numbered marker", so this was a broken
promise.

**Fix applied** An invisible `0.2`-unit disc sits in the same billboard and
carries the same handlers — a 2.4× larger hit area with no visual change.

**Verification** `qa/tests.mjs` projects the marker's world position through the
declared camera and clicks it:

```
PASS  three  clicking the perception marker selects it   [Perception]
PASS  three  clicking the manipulation marker selects it [Manipulation]
```

---

### P2-05 · Contact form offered no path if the mail client did not open

| | |
| --- | --- |
| **Severity** | P2 |
| **Affected** | `components/contact-form.tsx` |

**Actual** Submit sets `window.location.href = "mailto:…"`. On a machine with no
configured mail handler, browsers do nothing visible. The button relabelled to
"Open mail client again" but there was no link, no address, and no explanation —
a dead end.

**Fix applied** The composed `mailto:` is kept in state and rendered as a real
anchor after submit ("Open the prepared message"), alongside the plain team
address.

**Verification**

```
PASS  forms  valid submit composes a mailto: to the team address
PASS  forms  mailto carries the encoded message body
PASS  forms  a clickable fallback is offered if the mail client does not open
PASS  forms  empty submit surfaces validation errors  [3 invalid fields]
PASS  forms  focus moves to the first invalid field
PASS  forms  invalid email is rejected
```

The form still does not claim an email was sent — it says the mail client should
now be open, which is all the site can know. No backend exists and none was
invented.

---

### P2-06 · Timeline was not in chronological order

| | |
| --- | --- |
| **Severity** | P2 |
| **Affected** | `content/timeline.ts` |
| **Routes** | `/`, `/journey` |

**Actual** The "March" entry (`sortKey: 2026-03`) rendered above "January 2026"
(`2026-01`). A chronology that is not chronological undermines the page's whole
argument.

**Fix applied** Reordered to September 2024 → January 2025 → January 2026 →
March 2026 → June–July 2026. The March entry's label now reads "March 2026" and
its note keeps the caveat that the source page does not state the year.

---

### P3-01 · Cursor could be left as `pointer` after the 3D section unmounted

`components/rover-scene.tsx` set `document.body.style.cursor` on hover and only
restored it on `pointerOut`. Navigating away with the pointer over the model left
the whole document showing a pointer cursor. Fixed with a cleanup effect.

### P3-02 · Redundant `aria-label` on the mobile menu trigger

`site-header.tsx` already renders `<span className="sr-only">{open ? "Close menu" : "Open menu"}</span>`.
No defect found — recorded here because it was checked and deliberately left as is.

---

## 2. Checked and found correct

These were tested, not assumed. Each is backed by an assertion in `qa/tests.mjs`.

| Area | Result |
| --- | --- |
| All 21 public routes return 200 | 21/21 |
| Unknown slugs return 404 (`/robots/nope`, `/experiments/nope`, `/research/nope`, `/nonexistent-route`) | 4/4 |
| Exactly one `h1` per route | 21/21 |
| Unique `<title>` per route | 21/21 |
| Meta description ≥ 40 chars per route | 21/21 |
| 16 internal links on `/` resolve | 16/16 |
| 11 legacy `.html` URLs redirect (308) | 11/11 |
| `aria-current="page"` on the active nav item | pass |
| Mobile menu: opens, traps focus, Escape closes, focus returns to trigger | pass |
| Trigger is ≥ 44 × 44 | pass |
| Skip link is the first Tab stop | pass |
| Focus ring is drawn (`solid 2px`) | pass |
| No `[data-reveal]` element left at `opacity: 0` under reduced motion | 0 hidden |
| Prototype timeline falls back to the static list under reduced motion | pass |
| No console errors, page errors or 4xx/5xx on any route | 0 |
| Every `<img>` has an `alt` attribute | 0 missing |
| Every external link is `https` with `rel="noopener"` | pass |

---

## 3. Known limitations of this audit

Stated so the numbers above are not read as broader than they are.

1. **Lighthouse was run against the local production build, not the live host.**
   The live host serves a stale build; measuring it would describe code that is
   about to be replaced. Scores are in `docs/QA_REPORT.md` §4.
2. **No real-device testing.** All browser work used Playwright's Chromium.
   Safari, Firefox and physical iOS/Android were not exercised. The AVIF defect
   found in §P0-01 is exactly the class of problem that only shows up in a real
   browser, so this gap is material.
3. **No screen-reader session.** Semantics were checked with axe-core and by
   reading the accessibility tree, not by driving NVDA, JAWS or VoiceOver.
4. **3D marker hit-testing is asserted, not visually exhaustive.** The test
   projects known world coordinates and clicks them. It does not prove that every
   pixel of the model is reachable.
5. **`/content-status` is a working document, not a public page.** It is
   `noindex` and excluded from the sitemap by design, not by accident.
6. **No automated visual regression.** Layout was reviewed from screenshots in
   `qa/final/` and `qa/sections/`; nothing diffs them run to run.

---

## 4. Files changed

| File | Change |
| --- | --- |
| `next.config.ts` | WebP only; `deviceSizes` capped at 2048; cache TTL |
| `app/globals.css` | `--color-steel-mid`; `.plate-strong` / `.plate-note` with `on-ink` variants |
| `app/layout.tsx` | `siteUrl`, `openGraph.url`, `twitter` card, icons, absolute OG image |
| `app/sitemap.ts` | **new** — 20 URLs from content |
| `app/robots.ts` | **new** — allow all, disallow `/content-status`, declare sitemap |
| `app/page.tsx` | canonical; sponsorship copy; caption colour |
| `app/experiments/page.tsx` | removed `Suspense`; canonical |
| `app/journey/page.tsx` | competition block with verified event facts and sources |
| `app/collaborate/page.tsx` | canonical; present-tense claim removed |
| `app/robots/page.tsx`, `app/research/page.tsx`, `app/resources/page.tsx`, `app/people/page.tsx`, `app/join/page.tsx`, `app/engineering/page.tsx`, `app/contact/page.tsx`, `app/content-status/page.tsx` | canonical |
| `app/robots/[slug]/page.tsx`, `app/experiments/[slug]/page.tsx`, `app/research/[slug]/page.tsx` | canonical + Open Graph per record |
| `components/experiment-explorer.tsx` | rewritten: no `useSearchParams`, `history.replaceState`, `popstate`, `h2` titles |
| `components/prototype-timeline.tsx` | rewritten: watched media queries, stable trigger element |
| `components/plate.tsx` | `plate-note` class |
| `components/site-header.tsx` | removed redundant `aria-label`; ref captured before cleanup |
| `components/site-footer.tsx` | competition copy |
| `components/contact-form.tsx` | `mailto` fallback link |
| `components/rover-scene.tsx` | `CameraRig`, `ContextGuard`, 2.4× marker hit area, cursor cleanup, `powerPreference` |
| `components/rover-explorer.tsx` | reset control, context-lost state, caption note class |
| `content/site.ts` | `siteUrl`, `competition`, description |
| `content/timeline.ts` | dates, order, verified event facts |
| `content/claims.ts` | `comp-001` reclassified with organiser sources |
| `DESIGN.md` | `steel-mid` token documented |
| `package.json` | `test:e2e`, `audit`, `lighthouse` scripts; `lint` repointed to `eslint .` |
| `eslint.config.mjs` | **new** — flat config so lint runs non-interactively |
| `.gitignore` | QA scripts tracked; their screenshots and generated reports ignored |
| `qa/*.mjs`, `scripts/gen-asset-sources.mjs` | **new** audit and test tooling |
| `docs/ASSET_SOURCES.md` | **new**, generated |

New dev dependencies, all audit tooling, none shipped to the client:
`axe-core`, `@axe-core/playwright`, `lighthouse`, `chrome-launcher`, `eslint`,
`eslint-config-next`, `@eslint/eslintrc`.
