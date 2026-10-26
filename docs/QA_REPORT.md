# QA report

**Date:** 27 October 2026
**Commit under test:** `d3253d7` — `next build` → 27 prerendered routes, served by `next start -p 4311`
**Browser:** Playwright Chromium 1248 (headless), Windows
**Node:** 22.22.2 · **Next:** 15.5.28 · **React:** 19.1.0

Everything below is a command that was run and the output it produced. Nothing is
estimated.

---

## 1. Build and typecheck

```bash
$ npx tsc --noEmit
# (no output — 0 errors)

$ npm run build
 ✓ Compiled successfully in 7.7s
 ✓ Generating static pages (27/27)

$ npm run lint
# (no output — 0 errors, 0 warnings, exit 0)
```

`lint` previously ran `next lint`, which is deprecated in Next 15 and opens an
interactive prompt ("How would you like to configure ESLint?") on a machine with
no config — it hangs in CI and on a fresh clone. It now runs `eslint .` against a
committed flat config (`eslint.config.mjs`, `eslint-config-next` via `FlatCompat`).
Two real findings surfaced once it ran, both fixed:

| File | Finding | Fix |
| --- | --- | --- |
| `app/page.tsx:12` | `Reveal` imported but never used after the scroll-reveal wrappers were removed | import deleted |
| `components/site-header.tsx:66` | cleanup read `triggerRef.current` after React may have detached it, so focus could fail to return to the menu button | ref captured into a local `trigger` inside the effect |

New dev dependencies: `eslint`, `eslint-config-next`, `@eslint/eslintrc`.

Route table (abridged):

| Type | Count | Notes |
| --- | --- | --- |
| Static (`○`) | 21 | including `/`, `/robots`, `/experiments`, `/people`, `/journey`, `/resources`, `/join`, `/collaborate`, `/contact`, `/content-status` |
| SSG (`●`) | 9 | 2 robots · 4 experiments · 3 research themes |
| Metadata routes | 2 | `/robots.txt`, `/sitemap.xml` |
| First Load JS shared by all | 103 kB | |
| Largest route chunk | 118 kB (`/`) | includes the dynamically imported 3D bundle |
| 3D bundle | not in the initial payload | `dynamic(..., { ssr: false })` — loaded only when the explorer enters the page |

The Three.js stack (`three` + `@react-three/fiber` + `@react-three/drei`) is
deliberately **not** in the shared chunk. Only `/robots/aegis` and
`/robots/zugbee-x1` pull it in, and only after mount.

---

## 2. Automated test suite

```bash
node qa/tests.mjs http://localhost:4311     # or: npm run test:e2e
```

**Result: 185 passed, 0 failed.**

```
routes           110 pass, 0 fail
navigation         7 pass, 0 fail
experiments       21 pass, 0 fail
three             11 pass, 0 fail
forms             13 pass, 0 fail
keyboard          10 pass, 0 fail
motion             3 pass, 0 fail
responsive         1 pass, 0 fail
assets             2 pass, 0 fail
seo                7 pass, 0 fail
─────────────────────────────────────────
TOTAL            185 passed, 0 failed
```

Raw output: `qa/tests/results.json`, `qa/tests/run.log`.

### What each group actually asserts

| Group | Coverage |
| --- | --- |
| `routes` | 21 public routes return 200, exactly one `h1`, a title, a ≥40-char meta description and a canonical URL — 5 assertions × 21 routes. Plus 4 unknown paths return 404. |
| `navigation` | Every internal `href` on `/` resolves; primary nav navigates; `aria-current` is set; 3 legacy `.html` redirects land correctly; no console errors. |
| `experiments` | Records render with **JavaScript disabled**; no loading string in the HTML; filter by robot, by subsystem, stacked; URL carries state; impossible filter shows the empty state with a reset; clear restores 4; search hit and miss; deep link restores; **Back button** restores the previous filter; detail links resolve. |
| `three` | Canvas present with real dimensions; live WebGL context; tab changes the panel; `ArrowRight` moves the roving tabindex; **clicking the projected perception marker** selects it; **clicking the projected manipulation marker** selects it; reset control present and does not throw; with `getContext()` stubbed to `null`, the fallback appears, the canvas is absent, and the tablist still works. |
| `forms` | Empty submit produces 3 invalid fields and moves focus to the first; invalid email rejected; valid submit composes the correct `mailto:` with subject and body; fallback link offered; button acknowledges; 3 recruitment CTAs point at the right routes; all external links are `https` + `rel="noopener"`. |
| `keyboard` | Menu trigger ≥ 44×44; opens; `aria-expanded` correct; focus enters the sheet; Tab from the last item wraps; Escape closes; focus returns to the trigger; skip link is the first Tab stop; focus ring is `solid 2px`. |
| `motion` | No `[data-reveal]` element left at `opacity: 0`; static timeline renders; no sticky scrub track exists. |
| `responsive` | 21 routes × 6 widths, stepped **down** from a 1440 px load (the path that previously broke). |
| `assets` | No `<img>` with `naturalWidth === 0` after a full scroll on 6 image-heavy routes; no 4xx/5xx responses. |
| `seo` | `robots.txt` exists and declares the sitemap; sitemap has ≥20 URLs and excludes `/content-status`; `og:image` is absolute; homepage canonical is the deployment host; `/content-status` is `noindex`; all 21 titles unique. |

### Image pipeline check

```bash
node qa/imagecheck.mjs http://localhost:4311
```

Walks 15 content routes in Chromium, scrolls to the bottom of each, and asserts
every `<img>` decoded:

```
/                        images=23 notLoaded=0
/robots                  images=4  notLoaded=0
/robots/aegis            images=5  notLoaded=0
/robots/zugbee-x1        images=5  notLoaded=0
/research                images=2  notLoaded=0
/research/mobility-over-rubble images=2 notLoaded=0
/experiments             images=2  notLoaded=0
/experiments/aegis-flipper-stair-ascent images=2 notLoaded=0
/engineering             images=2  notLoaded=0
/journey                 images=3  notLoaded=0
/people                  images=20 notLoaded=0
/resources               images=6  notLoaded=0
/join                    images=3  notLoaded=0
/collaborate             images=8  notLoaded=0
/contact                 images=2  notLoaded=0

Distinct stuck image URLs: 0
```

Before the WebP-only change the same script reported `notLoaded=1` on `/`.

---

## 3. Accessibility

### 3.1 axe-core

```bash
node qa/audit.mjs http://localhost:4311
```

Injected `axe-core` and ran the rule sets `wcag2a`, `wcag2aa`, `wcag21a`,
`wcag21aa`, `best-practice` on 22 routes at 1440 px.

**Result: 0 violations, 0 routes.**

```
200  /                        axe=0 err=0 net=0 oflow=0
200  /robots                  axe=0 err=0 net=0 oflow=0
… all 22 routes …
404  /nonexistent-route       axe=0 err=0 net=0 oflow=0

axe violations: 0
```

Progression across the session:

| Run | Rules firing | Nodes |
| --- | --- | --- |
| Baseline | `color-contrast`, `label-content-name-mismatch`, `heading-order` | 233 |
| After token + caption fix | `label-content-name-mismatch` | 22 |
| After header fix | — | 0 |

### 3.2 Manual keyboard and semantics

Driven through Playwright, not eyeballed:

| Check | Result |
| --- | --- |
| First Tab stop is the skip link | pass — `"Skip to content"` |
| Focus indicator computed style | `solid 2px` |
| Mobile menu focus trap wraps at both ends | pass |
| Escape closes the menu | pass |
| Focus returns to the trigger after Escape | pass |
| `aria-expanded` tracks menu state | pass |
| Roving tabindex on the 3D tablist (`ArrowRight`) | pass — focus lands on `tab-perception` |
| Tab panel is `aria-labelledby` the active tab | pass |
| Status is conveyed by shape + label + colour, not colour alone | by construction — `status-chip.tsx` draws filled / half-filled / dashed / hollow SVG marks plus a text label |
| Canvas is `aria-hidden` and the tablist carries the semantics | pass |
| Reduced motion: nothing hidden, no scrub | pass |

### 3.3 Not done

**No screen-reader session.** NVDA, JAWS and VoiceOver were not driven. The
semantics were verified through axe-core and the accessibility tree, which is not
the same thing. This is a real gap, listed again in §8.

---

## 4. Lighthouse

```bash
node qa/lighthouse.mjs http://localhost:4311 / /robots/aegis /experiments /people /journey
```

Lighthouse 12 via `chrome-launcher`, against the local production build.
Mobile profile: 412 × 823, DPR 1.75, simulated throttling
(150 ms RTT, 1 638 kbps, 4× CPU slowdown). Desktop: 1350 × 940, no throttling.

Final run, on the committed build (`d3253d7`):

| Route | Profile | Perf | A11y | Best practices | SEO | LCP | CLS | TBT | FCP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | mobile | **97** | **100** | **100** | **100** | 2.5 s | 0 | 30 ms | 1.5 s |
| `/` | desktop | **100** | **100** | **100** | **100** | 0.6 s | 0 | 0 ms | 0.4 s |
| `/robots/aegis` | mobile | **98** | **100** | **100** | **100** | 2.3 s | 0 | 30 ms | 1.4 s |
| `/robots/aegis` | desktop | **100** | **100** | **100** | **100** | 0.5 s | 0 | 0 ms | 0.3 s |
| `/experiments` | mobile | **99** | **100** | **100** | **100** | 2.0 s | 0.016 | 30 ms | 1.4 s |
| `/experiments` | desktop | **100** | **100** | **100** | **100** | 0.5 s | 0 | 0 ms | 0.3 s |
| `/people` | mobile | **100** | **100** | **100** | **100** | 1.6 s | 0 | 30 ms | 0.8 s |
| `/people` | desktop | **100** | **100** | **100** | **100** | 0.5 s | 0 | 0 ms | 0.3 s |
| `/journey` | mobile | **98** | **100** | **100** | **100** | 2.4 s | 0 | 30 ms | 1.4 s |
| `/journey` | desktop | **100** | **100** | **100** | **100** | 0.5 s | 0 | 0 ms | 0.3 s |

Targets were 90 / 95 / 95 / 95. Every run cleared every target on both profiles.
Full JSON per run in `qa/lighthouse/`.

**Mobile Performance varies between runs.** Three runs of the same build gave
mobile Performance of 97–100, with LCP moving between 1.9 s and 2.5 s and the
score following it. Nothing changed in the build between them; this is the noise
floor of simulated throttling on a shared machine. The table above is the last
run, not the best one. Accessibility, Best Practices and SEO were 100 on every
route in every run, which is the part that is actually stable.

**Conditions, stated honestly.** These are localhost measurements on a fast
machine. Real-world mobile scores on the Netlify host will be lower — the
simulated throttling approximates a mid-tier phone on 4G, but it cannot model
CDN cold-start, TLS setup, or an actual radio. Expect mobile Performance in the
low-to-mid 90s rather than 97–100.

**The one non-zero CLS** is `/experiments` on mobile at 0.016, well inside the
0.1 "good" band. It comes from the webfont swap on the first paint of a long
list. Not chased further because fixing it would mean blocking first paint on a
font, which costs more than it saves.

---

## 5. Responsive matrix

Exercised at **320, 375, 480, 768, 1024, 1280, 1536** — seven widths, matching the
brief. The automated assertion (`qa/tests.mjs`) steps 1440 → 1280 → 1024 → 768 →
480 → 375 → 320 on all 21 routes and asserts
`documentElement.scrollWidth - clientWidth <= 1`.

**Result: 21 routes × 6 stepped widths = 126 checks, 0 overflow cases.**
320 px is additionally covered by the 1536 → 320 direction in `qa/audit.mjs`,
which reported `oflow=0` on all 22 routes.

Screenshots at 1440 / 834 / 390 for all 16 primary routes: `qa/final/`.
Section-level crops at 1440: `qa/sections/`.

The defect this caught is documented as P1-02 in `docs/AUDIT_REPORT.md`: a
desktop-to-mobile resize left the 12-column sticky scrub layout in place and
produced 56 px of horizontal overflow. A fresh load at 320 px did **not** reproduce
it, which is why the test steps down rather than loading at each width.

---

## 6. Route and link integrity

```bash
for p in / /robots /robots/aegis … ; do curl -s -o /dev/null -w "%{http_code}" http://localhost:4311$p; done
```

| Check | Result |
| --- | --- |
| Public routes returning 200 | 21 / 21 |
| Unknown slugs returning 404 | 4 / 4 (`/robots/nope`, `/experiments/nope`, `/research/nope`, `/nonexistent-route`) |
| Legacy `.html` URLs redirecting (308 → 200) | 11 / 11 |
| Internal links resolved | 16 on `/`, 21 distinct across the crawl, 0 broken |
| External links | all `https`, all `rel="noopener"` |
| `sitemap.xml` | 200, 20 URLs |
| `robots.txt` | 200, declares sitemap and host |

---

## 7. Deployment status — action required

**The live site at `https://urrt-website.netlify.app` has not been updated.** It
still serves the build audited at the start of this session. Verified:

```bash
$ curl -s https://urrt-website.netlify.app/experiments | grep -c BAILOUT_TO_CLIENT_SIDE_RENDERING
1
$ curl -s https://urrt-website.netlify.app/experiments | grep -o "Loading experiment records"
Loading experiment records
$ curl -o /dev/null -w "%{http_code}" https://urrt-website.netlify.app/robots.txt
404
$ curl -o /dev/null -w "%{http_code}" https://urrt-website.netlify.app/sitemap.xml
404
$ curl -s https://urrt-website.netlify.app/ | grep -c 'rel="canonical"'
0
```

To ship:

1. Commit and push. Netlify builds on push (`next build`, publish `.next` with the
   Next runtime, or `@netlify/plugin-nextjs`).
2. Optionally set `NEXT_PUBLIC_SITE_URL` to the production origin. If the site
   moves to its own domain, this **must** be set or canonical tags and the sitemap
   will keep pointing at the Netlify host.
3. Re-run `node qa/tests.mjs https://urrt-website.netlify.app` against the deployed
   URL — the suite takes a base URL as its first argument.
4. Re-run Lighthouse against the deployed URL and replace the table in §4.

**Never run `next build` while `next dev` is running against the same `.next`
directory.** Doing so mid-session produced a corrupted build in which every
dynamic slug returned 500 instead of 404. It is not an application bug, and it
looks exactly like one.

---

## 8. Requirement-by-requirement acceptance

| # | Requirement | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Visual design and consistency | **PASS** | 16 full-page screenshots × 3 viewports in `qa/final/`; 21 section crops in `qa/sections/`; 0 overflow at 7 widths |
| 2 | Content accuracy and credibility | **PASS** | `docs/FACT_CHECK_REPORT.md`; 22-claim ledger on `/content-status`; 4 misattributed results removed; 3 unsupported counters removed |
| 3 | Functional completeness | **PASS** | 185/185 assertions; 21 routes 200; 4 unknown paths 404 |
| 4 | Three.js and interactive experiences | **PASS (with a documented limit)** | Real R3F scene, orbit, zoom, marker selection, tablist sync, camera reset, context-loss fallback, no-WebGL fallback. **Model is conceptual, not authentic — see §9.** |
| 5 | Responsive behaviour | **PASS** | 21 routes × 7 widths, 0 overflow; screenshots at 390/834/1440 |
| 6 | Accessibility | **PASS with caveats** | axe 0 violations on 22 routes; 10 keyboard assertions pass. **No screen-reader session — see §3.3.** |
| 7 | Performance and stability | **PASS** | Lighthouse 97–100 mobile across three runs, 100 desktop; CLS ≤ 0.016; TBT ≤ 30 ms; image hang fixed |
| 8 | SEO and metadata | **PASS** | Unique titles, per-page canonical, absolute OG, `robots.txt`, `sitemap.xml`, noindex only where intended |
| 9 | Navigation, recruitment, contact | **PASS** | All CTAs resolve; contact form validates, composes a real `mailto:`, offers a fallback; no fake success claim |
| 10 | Testing, documentation, deployment readiness | **PASS on testing and docs; BLOCKED on deployment** | 4 runnable suites committed; 4 reports written. **Live site still serves the old build — §7.** |
| 11 | Deliverables | **PASS** | `AUDIT_REPORT.md`, `FACT_CHECK_REPORT.md`, `QA_REPORT.md`, `ASSET_SOURCES.md` |

**Score claim: none.** The brief asked for a 10/10 standard, not a 10/10 label. Two
items above are marked with caveats and one is blocked, and those are the honest
readings.

---

## 9. Remaining blockers and external dependencies

| # | Item | Blocks | Owner |
| --- | --- | --- | --- |
| 1 | **Redeploy.** The live site serves the pre-audit build. | Everything in this report | Site maintainer |
| 2 | **No authentic 3D model.** No GLB/GLTF/CAD export exists. The explorer ships a labelled conceptual assembly. | Requirement 4 being fully met | Mechanical lead |
| 3 | **No experiment measurements.** No logs, CSVs or trial counts. Every record shows an absent results plate; no chart renders anywhere. | Experiments page being complete | Research lead |
| 4 | **No RoboCup 2026 participation record.** No entry list, result sheet or announcement names URRT. | `/journey` closing `comp-001` | Competition coordinator |
| 5 | **No real-device testing.** Chromium only. Safari, Firefox, iOS and Android untested. | Confidence in the WebP and WebGL paths | QA |
| 6 | **No screen-reader session.** axe-core and the accessibility tree only. | Requirement 6 caveat | QA |
| 7 | **No CI.** Tests are runnable but not enforced on push. | Regressions going unnoticed | Site maintainer |
| 8 | **No CMS.** Content lives in typed files under `content/`. Edits need a developer and a redeploy. | Team self-service | Site maintainer |
| 9 | **Contact address unconfirmed as monitored.** `rescuerover@cair.uiu.ac.bd` is transcribed from the source site, not independently verified. | Contact reliability | Project lead |
| 10 | **`NEXT_PUBLIC_SITE_URL` unset.** Defaults to the Netlify host. Must be set if the site moves to `rescuerover.uiu.ac.bd`. | Correct canonical/OG on a custom domain | Site maintainer |
| 11 | **`npm audit` reports 2 advisories (1 moderate, 1 high) that cannot be fixed here.** `postcss` is bundled *inside* `next`; the only remedy is `next@16`, a breaking major upgrade. | `npm audit` being clean | Site maintainer, at the next major upgrade |

`npm audit fix` was run once. It cleared the three `sharp` advisories by moving
the image optimiser from 0.34.5 to 0.35.5, with `package.json` unchanged. The
image pipeline check in §2 was re-run afterwards to confirm the optimiser still
produces WebP for every source (no stuck variants). The two remaining advisories
are in Next's own vendored `postcss`; they are build-time, not reachable from
request input, and remediation requires `next@16`.

---

## 10. Reproducing this report

```bash
# 1. build and serve
npm run build
npx next start -p 4311

# 2. in another shell
node qa/audit.mjs       http://localhost:4311   # axe + console + network + overflow + links
node qa/tests.mjs       http://localhost:4311   # 185 assertions
node qa/imagecheck.mjs  http://localhost:4311   # every image, every route
node qa/lighthouse.mjs  http://localhost:4311   # scores
node qa/overflow.mjs    http://localhost:4311 / 320   # single-route overflow diagnosis

# npm aliases
npm run lint
npm run typecheck
npm run audit
npm run test:e2e
npm run lighthouse
```

`qa/tests.mjs` exits non-zero if any assertion fails, so it is CI-ready as written.
`npm run lint` and `npm run typecheck` both exit 0 with no output.
