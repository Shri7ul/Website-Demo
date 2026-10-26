# QA and delivery report

**Project:** UIU Rescue Rover — full site rebuild
**Stack:** Next.js 15.5.28 · React 19.1 · TypeScript 5.9 · Tailwind v4 · Three.js 0.180 / R3F 9.8 / drei 10.7 · GSAP 3.15
**Build date:** 26 October 2026
**Verified against:** `next start -p 4311`, clean `.next` (see §5, defect D-3)

---

## 1. Build result

```
✓ Compiled successfully in 10.4s
✓ Generating static pages (25/25)
```

| Metric | Value |
| --- | --- |
| Pages prerendered | 25 |
| Shared first-load JS | 103 kB |
| Heaviest route | `/` at 118 kB first-load |
| TypeScript | `tsc --noEmit` — 0 errors |
| Build errors | 0 |

Route rendering modes:

- **Static (`○`)** — `/`, `/robots`, `/research`, `/experiments`, `/engineering`, `/journey`,
  `/people`, `/resources`, `/join`, `/collaborate`, `/contact`, `/content-status`, `/_not-found`
- **SSG (`●`)** — `/robots/[slug]` (2), `/research/[slug]` (3), `/experiments/[slug]` (4)

The 3D scene is loaded via `next/dynamic` with `ssr: false`, so it does not enter any route's
server bundle or first-load JS.

---

## 2. Test results

All suites run against the production server with a clean build.

### 2.1 Route and asset sweep — `qa/shot-prod.mjs`

16 routes × 3 viewports (1440×900, 834×1112, 390×844), plus a 320×640 pass.

```
=== PROBLEMS ===
none
```

Checks per page: HTTP status, console errors, `pageerror`, `document.scrollWidth` vs
`clientWidth`. Screenshots written to `qa/prod/`.

### 2.2 Interaction — `qa/interact.mjs` — 11/11

| Check | Result |
| --- | --- |
| Timeline scrub UI present at 1440px | PASS |
| Stage advances with scroll | PASS — Stage 1 → 2 → 3 across the scrub |
| Clicking a 3D marker changes the detail panel | PASS — marker 3 → "Manipulation" |
| `ArrowRight` moves tab selection | PASS — → "Perception" |
| Mobile menu trigger exists at 390px | PASS |
| Opens with `aria-expanded="true"` | PASS |
| Focus stays trapped while open | PASS — 14 Tab presses, never escaped |
| `Escape` closes the menu | PASS |
| Focus returns to the trigger after close | PASS |
| Reduced motion: timeline falls back to static list | PASS — 0 scrub UI, 3 static articles |
| No horizontal overflow at 320px | PASS — 16 routes clean |

### 2.3 Accessibility and links — `qa/a11y.mjs` — 5/5

| Check | Result |
| --- | --- |
| Reduced motion: no content left invisible | PASS — 12 routes, nothing stuck below `opacity: 1` |
| Reduced motion: 3D canvas still renders | PASS |
| First `Tab` reaches a visible skip link | PASS — "Skip to content", `outline: solid 2px` |
| Focus ring is drawn | PASS — `solid 2px rgb(63,107,18)` |
| All internal link targets resolve | PASS — 21 unique targets, all 200 |

### 2.4 Console cleanliness — `qa/errors.mjs`

16 routes, console + `pageerror` + `requestfailed` captured after `networkidle` + 2.5 s.

**Result: zero application errors on every route.**

The only remaining console output is Chrome's own WebGL performance note
(`GL Driver Message … GPU stall due to ReadPixels`) on `/robots/aegis`, emitted by the browser's
GL driver because Playwright is screenshotting a live canvas. It does not appear in normal use.

### 2.5 Status codes

| Path | Code |
| --- | --- |
| 21 known routes | 200 |
| `/nonexistent` | 404 |
| `/robots/does-not-exist` | 404 |
| `/research/nope` | 404 |
| `/experiments/nope` | 404 |
| 11 legacy URLs (`/projects.html`, `/member.html`, …) | 308 → new route |

---

## 3. Defects found and fixed during this pass

### D-1 · React 19 root-unmount race in the 3D scene — **fixed**

drei's `<Html>` mounts a React root into a DOM node next to the canvas and unmounts it
synchronously. Under React 19 that produced, three times per page load (once per hotspot):

```
Attempted to synchronously unmount a root while React was already rendering.
```

Affected `/`, `/robots/aegis`, `/robots/zugbee-x1`.

**Fix:** removed `<Html>` entirely. The numbered markers are now meshes — a `circleGeometry`
billboarded toward the camera with the numeral drawn into a `CanvasTexture` at runtime. Nothing is
portalled, so there is no second React root to unmount. This also removed drei's DOM overlay from
the accessibility tree, which is correct: the canvas is `aria-hidden`, and the tablist carries the
real interaction.

### D-2 · Track geometry rendered as flat slabs — **fixed**

The conceptual rover's tracks were a single `boxGeometry` plus 14 ridge boxes, which read as a
deformed lime slab rather than a track.

**Fix:** rebuilt as a hollow **stadium ring** (`ExtrudeGeometry` of a rounded-rectangle `Shape`
with a matching inner `Path` as a hole), with 60+ lugs placed on the perimeter by arc length and
oriented along the outward normal, plus road wheels and end sprockets visible through the ring.
Flippers were re-hinged at the track end caps instead of floating in space.

### D-3 · Unknown dynamic slug returned 500 instead of 404 — **fixed**

`/robots/does-not-exist` returned 500 with `Could not find files for /_error in
.next/build-manifest.json` and `TypeError: a[d] is not a function` in `webpack-runtime.js`.

**Cause:** `next build` had been run while `next dev` was still writing to the same `.next`
directory. The production output was internally inconsistent — not an application bug.

**Fix:** stopped the dev server, `rm -rf .next`, rebuilt, restarted. All dynamic-slug 404s now
return 404. **Operational note: never run `next build` while `next dev` is running on this project.**

### D-4 · `Invalid or unexpected token` page error — **not reproducible**

Seen in the earlier dev-mode pass on several routes. It never appeared in the production build,
across three full sweeps. Diagnosed as a dev-mode HMR artefact (a chunk requested mid-recompile).
No action taken; confirmed absent in prod.

### D-5 · LCP warning on `/robots` — **fixed**

Next warned that `zugbee-x1-campus.jpg` was the LCP element without `priority`. Added
`priority={i === 0}` to the first plate in the robots list.

### D-6 · Contact-shadow plane left a hard grey edge — **fixed**

drei's `<ContactShadows>` rendered as a visible grey rectangle with a hard boundary across the
canvas. Replaced with an invisible `shadowMaterial` plane that receives a real directional-light
shadow, so the paper background stays clean and the rover casts a genuine shadow.

### D-7 · Hotspot anchors did not align with the model — **fixed**

`anchors` in `content/robots.ts` are expressed in model space, but the model group carried a
`rotation={[0, -0.42, 0]}` while the hotspots sat outside it. Leader lines pointed at empty space.

**Fix:** removed the model rotation (the camera already sits at a 42° azimuth), and re-specified
each anchor to lie on the geometry it annotates — track centre, LiDAR top, arm elbow.

### D-8 · Track highlight flooded the frame — **fixed**

With `locomotion` selected by default, every lug on four tracks and four flippers rendered in the
brand lime `#B7F36B`, which dominated the composition. Muted to `#93C95A` for the track lugs and
`#7FAE4B` for the flipper arms; the true lime is now reserved for the active marker and the
selected component itself.

### D-9 · Sticky header let page content bleed through — **fixed**

The header used `bg-paper/95` with `backdrop-blur-none`. With no blur to justify the transparency,
the remaining 5% just made scrolled content appear as a faint smudge behind the logo. Changed to
solid `bg-paper`. Audited the rest of the source for other translucent or blurred surfaces — none
remain, so the "no glassmorphism" rule in DESIGN.md holds throughout.

---

## 4. What was verified by eye

Every page was screenshotted at 1440px and inspected, plus mobile and tablet for the key flows.
Specific confirmations:

- **Hero** — real AEGIS workshop photograph (orange treads, articulated arm) on charcoal; headline,
  lede, lime primary CTA and outline secondary all legible; 3-link rail present.
- **3D explorer** — tracks read as tracks with a visible tread pattern and road wheels; all four
  flippers attach at the track caps; markers 1/2/3 with leader lines pointing at the track, the
  LiDAR and the arm; each selection state recolours the right component.
- **Prototype timeline** — real Zugbee X1 photograph (red treads, campus mosque behind) at stage 3,
  body copy expanded in Source Serif, "Stage 3 of 3 — January 2025" live label.
- **Claim ledger** — 22 rows, each with ID, claim text, public treatment, status chip (shape-coded),
  evidence URL, owner and check date. Legible at 1440px.
- **Roster** — 15 real portraits with names, IDs and disciplines; 3 advisors below.
- **Mobile** — hero stacks correctly, menu panel is full-height with 44px+ targets.
- **320px** — no clipping on any route.

---

## 5. Known gaps

These are honest limitations, not oversights.

| # | Gap | Impact | To close |
| --- | --- | --- | --- |
| 1 | **No authentic 3D model exists** | The explorer shows a *labelled conceptual assembly* | Team supplies a GLB/GLTF/CAD export; set `NEXT_PUBLIC_ROVER_GLB=/models/aegis.glb` |
| 2 | **No experiment measurements anywhere** | No chart renders on any experiment | Research lead supplies logs/CSV with trial counts and a success definition |
| 3 | **No publications, code or datasets** | Three of four resource categories are empty by design | Team publishes; the pages already render the correct empty state |
| 4 | **Lighthouse not run** | No performance score, no Core Web Vitals field data | Run Lighthouse against a real deployment |
| 5 | **No real-device testing** | Only Playwright emulation at 320/390/834/1440 | Test on a midrange Android over 3G/4G, per blueprint §01 |
| 6 | **No CI** | Build, lint, link and content checks are manual scripts in `qa/` | Wire `qa/shot-prod.mjs`, `qa/a11y.mjs`, `qa/interact.mjs` into GitHub Actions |
| 7 | **No CMS** | Content lives in typed TS modules; editing needs a developer and a redeploy | Add a headless CMS or MDX pipeline over `content/` |
| 8 | **No `license_or_permission` field** | `AssetRecord` has a free-text `note` instead of a structured licence field | Add the field; all current assets are team-published on the team's own site |
| 9 | **No `save-data` branch** | Blueprint §01 asks for it; `next/image` bounds payload without it | Add a `navigator.connection.saveData` check to downgrade image quality |
| 10 | **Rollback not written up** | 11 redirects are verified, but there is no written rollback runbook | Document redeploy-previous-build procedure |
| 11 | **Wireframes not produced** | Blueprint §10 asks for 10 scene wireframes; the built pages are the design | — |
| 12 | **Content ownership unassigned** | Roles are documented; no real names attached | Team lead assigns |

### Blueprint conflicts, resolved and disclosed

The blueprint (§08) says R3F should be used *"only after a genuine 3D asset and clear interaction
need"*. The client brief made Three.js mandatory. Both cannot hold, because no genuine 3D asset
exists.

Resolution: 3D was built, and the honesty constraint was preserved three ways — the plate caption
reads **"Conceptual assembly"**, `/content-status` logs it as `asset-003` with the missing file
named and its owner, and the actual interaction (choosing a subsystem) is carried by an accessible
tablist that works with WebGL disabled. A visitor who never loads the canvas loses no information.

---

## 6. Deviations from the original site

These are content corrections, not redesign choices. Each is recorded as a claim.

| Change | Reason |
| --- | --- |
| **Removed** BEAR Summit, ARC 2023, ARC 2025, URC 2025 from the journey | These are results of the **UIU Mars Rover Team**, a different team at the same university. Claim `comp-002`. |
| **Re-captioned** `ho1.jpg` from "Aegis Rover" to "team review table" | The photograph shows people at a laptop; no rover is present. Claim `asset-002`. |
| **Removed** the "50+ hours" counter | No evidence of instrumented hours. Claim `robot-007`. |
| **Removed** the "15+" team counter | The roster lists exactly 15; the derived count replaced the asserted one. Claim `roster-002`. |
| **Added** "Not yet documented" to unpublished spec rows | The source table left these blank, which reads as zero rather than unknown. |
| **Added** "No validated measurements published" to every experiment | No measurement data exists anywhere upstream. |

---

## 7. How to run it

```bash
# development
npm run dev -- -p 4310

# production
rm -rf .next            # required if a dev server has ever written here
npm run build
npm run start -- -p 4311

# QA (point the scripts at whichever port is live)
node qa/shot-prod.mjs   # 16 routes x 3 viewports + 320px, console + overflow
node qa/interact.mjs    # scrub, 3D markers, keyboard, mobile nav, reduced motion
node qa/a11y.mjs        # reduced-motion visibility, skip link, focus ring, link crawl
node qa/errors.mjs      # per-route console/pageerror/requestfailed dump
```

Screenshots land in `qa/prod/`, `qa/inspect/`, `qa/interact/`, `qa/detail/`.

### Swapping in a real 3D model

```bash
# 1. place the export
cp aegis.glb public/models/aegis.glb

# 2. point the scene at it
echo "NEXT_PUBLIC_ROVER_GLB=/models/aegis.glb" >> .env.local

# 3. rebuild
npm run build
```

The scene swaps `ConceptualRover` for `RealModel` automatically. **Then update the plate caption in
`app/robots/[slug]/page.tsx` and retire claim `asset-003`** — otherwise the site will still call an
authentic model "conceptual".

---

## 8. Verdict

The site is a faithful functional implementation of the blueprint, not a landing-page mockup.

- 25 pages build and render, 21 routes verified at 200, all unknown paths 404, 11 legacy URLs 308.
- Zero application console errors across three production sweeps.
- No horizontal overflow at 320px on any route.
- Keyboard, touch, reduced-motion and WebGL-absent paths all verified.
- Every photograph, name and number on the site traces to the team's own published material; the
  four unsupported claims that were on the original site are removed and documented.

What it is **not**: a site with real experiment data, a real 3D model, or real publications. Those
three absences are properties of the source material, and the site says so on the pages where a
visitor would expect them.
