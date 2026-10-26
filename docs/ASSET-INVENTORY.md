# Asset inventory and recovery report

**Source site:** `https://rescuerover.uiu.ac.bd` · crawled 26 October 2026
**Crawl scope:** 11 discoverable internal pages
**Result:** 51 manifest records · 50 production files · 52 preserved originals · 5 documented gaps
**Imagery substitution:** none. No stock photograph and no generated image ships in `public/`.

Machine-readable source of truth: `content/assets.ts` (`assetManifest`, `missingAssets`).
Public-facing view: `/content-status`.

---

## 1. Pages crawled

| Page | Contributed |
| --- | --- |
| `/index.html` | Logo, wordmark, hero images (`a1`–`a3`, `ho1`–`ho5`, `Team.jpg`), press marks |
| `/projects.html` | All 7 rover photographs (`t1`–`t3`, `prototype-x1*.jpeg`) |
| `/member.html` | 15 member portraits |
| `/Advisors.html` | 3 advisor portraits |
| `/sponsor.html` | 6 sponsor marks |
| `/gears.html` | 2 merchandise photographs |
| `/contact.html` | Contact details, CAIR lab address |
| `/video.html` | No recoverable media |
| `/Assets.html` | No downloadable assets |
| `/Join.html` | Recruitment copy |
| `/webmaster.html` | Maintainer credit |

---

## 2. Manifest

### 2.1 Brand — P0

| ID | Subject | Original URL | Source page | Local path | Status |
| --- | --- | --- | --- | --- | --- |
| `brand-logo` | Official team badge | `/images/umrt_logo.png` | `/index.html` | `/assets/brand/urrt-logo.png` | verified |
| `brand-wordmark` | Team wordmark | `/images/urrt_text.png` | `/index.html` | `/assets/brand/urrt-wordmark.png` | verified |
| `brand-uiu` | University logo | `/images/uiu-logo.png` | `/sponsor.html` | `/assets/brand/uiu-logo.png` | verified |
| `brand-cair` | CAIR logo | `/images/cair-logo.png` | `/sponsor.html` | `/assets/brand/cair-logo.png` | verified |

The badge is used **unmodified**. `urrt-mark-square.png` is a square crop of the same badge, used
only as `app/icon.png` because the original is not square. No mark was redrawn.

### 2.2 Robots — P0

| ID | Subject | Original URL | Local path | Status |
| --- | --- | --- | --- | --- |
| `aegis-front` | AEGIS, workshop, front three-quarter | `/images/t1.jpeg` | `/assets/robots/aegis/aegis-workshop-front.jpg` | verified |
| `aegis-rig-rear` | AEGIS on the timber obstacle rig, rear | `/images/t2.jpeg` | `/assets/robots/aegis/aegis-obstacle-rear.jpg` | verified |
| `aegis-rig-side` | AEGIS on the timber rig, side | `/images/t3.jpeg` | `/assets/robots/aegis/aegis-obstacle-side.jpg` | verified |
| `x1-campus` | Zugbee X1 on campus, mosque behind | `/images/prototype-x1.jpeg` | `/assets/robots/zugbee-x1/zugbee-x1-campus.jpg` | verified |
| `x1-grass` | Zugbee X1 on grass | `/images/prototype-x1-1.jpeg` | `/assets/robots/zugbee-x1/zugbee-x1-grass.jpg` | verified |
| `x1-steps` | Zugbee X1 at a step edge | `/images/prototype-x1-2.jpeg` | `/assets/robots/zugbee-x1/zugbee-x1-steps.jpg` | verified |
| `x1-detail` | Zugbee X1 detail | `/images/prototype-x1-3.jpeg` | `/assets/robots/zugbee-x1/zugbee-x1-detail.jpg` | verified |

All seven were opened and inspected individually. The three `t*.jpeg` files show one machine: a
tracked chassis with **orange treads** and an articulated arm — AEGIS. The four `prototype-x1*`
files show a **red-treaded** machine — Zugbee X1. This is the only visual basis for telling the two
platforms apart, and it is stated in the captions.

### 2.3 People — P1

15 member portraits, `team-*` records, source `/member.html`.

| Local file | Original | Member |
| --- | --- | --- |
| `dewan-rois-bin-omar.jpg` | `rois.jpg` | Dewan Rois Bin Omar |
| `mahir-faisal-nafis.jpg` | `mahir.jfif` | Mahir Faisal Nafis |
| `ahmed-jebail-shoukhin.jpg` | `shoukhin.jpg` | Ahmed Jebail Shoukhin |
| `nazmul-hasan-athin.jpg` | `athin.jpg` | Nazmul Hasan Athin |
| `md-yeahyea-hassan-siddique.jpg` | `yeahyea.jpeg` | Md. Yeahyea Hassan Siddique |
| `mathin-ahmed.jpg` | `mathin.jpeg` | Mathin Ahmed |
| `nurer-raihan-salmaan.jpg` | `salman.jpg` | Nurer Raihan Salmaan |
| `adipta-shaha.jpg` | `adipta.jfif` | Adipta Shaha |
| `nazmul-hasan-nayem.jpg` | `nazmul.jpg` | Nazmul Hasan Nayem |
| `jannatul-haque-usha.jpg` | `usha.jpg` | Jannatul Haque Usha |
| `tanjila-akter-simi.jpg` | `simi.jpeg` | Tanjila Akter Simi |
| `dayad-muhammad-illin.jpg` | `illin.jpg` | Dayad Muhammad Illin |
| `iftiaque-ahmed-auporba.jpg` | `ifti.jpg` | Iftiaque Ahmed Auporba |
| `saad-ahmmed-tonmoy.jpg` | `saad.jpg` | Saad Ahmmed Tonmoy |
| `sokanto-roy.jpg` | `sokanto.jpeg` | Sokanto Roy |

Two source files were `.jfif` (`mahir.jfif`, `adipta.jfif`) and were re-encoded to JPEG so every
browser decodes them.

Advisors, source `/Advisors.html`:

| ID | Subject | Original | Local path |
| --- | --- | --- | --- |
| `advisor-kashem` | Prof. Dr. Md. Abul Kashem Mia | `abul-kashem-VC-UIU.jpg` | `/assets/advisors/abul-kashem-mia.jpg` |
| `advisor-sarwar` | Prof. Dr. Hasan Sarwar | `Dr.-Hasan-Sarwar.jpg` | `/assets/advisors/hasan-sarwar.jpg` |
| `advisor-abid` | Md. Abid Hossain | `abid.jpg` | `/assets/advisors/abid-hossain.jpg` |

The roster is reproduced exactly as published: 15 members, 3 advisors. No member was added,
removed, re-titled, or given a contribution the roster does not state.

### 2.4 Events and team activity — P1

| ID | Subject | Original | Local path | Status |
| --- | --- | --- | --- | --- |
| `event-outdoor` | Competition, outdoors | `/images/a2.png` | `/assets/events/team-competition-outdoor.png` | verified |
| `event-rover` | Competition, rover in field | `/images/a3.png` | `/assets/events/team-competition-rover.png` | verified |
| `event-arrival` | Team travelling | `/images/ok3.png` | `/assets/events/team-competition-arrival.png` | verified |
| `event-review` | Team at a review table | `/images/ho1.jpg` | `/assets/events/team-review-table.jpg` | verified |
| `event-gathering-01` | Group photograph | `/images/ho2.jpg` | `/assets/events/team-gathering-01.jpg` | verified |
| `event-gathering-02` | Group photograph | `/images/ho3.jpg` | `/assets/events/team-gathering-02.jpg` | verified |
| `event-gathering-03` | Group photograph | `/images/ho4.jpg` | `/assets/events/team-gathering-03.jpg` | verified |
| `event-workshop` | Workshop | `/images/ho5.jpg` | `/assets/events/team-workshop.jpg` | verified |
| `event-campus` | Team with rover on campus | `/images/Team.jpg` | `/assets/events/team-campus-rover.jpg` | verified |
| `event-composite` | Composite graphic | `/images/a1.png` | `/assets/events/rover-competition-composite.png` | **review** |

`event-composite` is a designed composite rather than a photograph. It is kept but marked
`review`, and it is not used as a hero or as evidence for any claim.

### 2.5 Sponsors, press, merchandise — P2

| ID | Subject | Original | Local path | Status |
| --- | --- | --- | --- | --- |
| `partner-uiu` | United International University | `uiu-logo.png` | `/assets/brand/uiu-logo.png` | verified |
| `partner-cair` | CAIR | `cair-logo.png` | `/assets/brand/cair-logo.png` | verified |
| `partner-dassault` | Dassault Systèmes | `Dassauly-systemes-logo.png` | `/assets/partners/dassault-systemes.png` | verified |
| `partner-solidworks` | SOLIDWORKS | `solidworks-logo.png` | `/assets/partners/solidworks.png` | verified |
| `partner-protospace` | Protospace | `protospace-logo.png` | `/assets/partners/protospace.png` | verified |
| `partner-dfrobot` | DFRobot | `DFRobot-logo.png` | `/assets/partners/dfrobot.png` | verified |
| `press-daily-star` | The Daily Star | `daily-star-logo.png` | `/assets/press/the-daily-star.png` | verified |
| `press-prothom-alo` | Prothom Alo | `Prothom_Alo_logo.svg.png` | `/assets/press/prothom-alo.png` | verified |
| `press-business-standard` | The Business Standard | `the-business-standard-logo-02.png` | `/assets/press/the-business-standard.png` | verified |
| `press-clipping` | Newspaper clipping | `newspaper.png` | `/assets/press/press-clipping.png` | **review** |
| `merch-cap` | Team cap | `cap.jpeg` | `/assets/resources/urrt-cap.jpg` | verified |
| `merch-tshirt` | Team t-shirt | `tshirt.png` | `/assets/resources/urrt-tshirt.png` | verified |

The source filename `Dassauly-systemes-logo.png` contains a typo that is preserved here for
traceability; the local file is spelled correctly.

---

## 3. Defects found during recovery

### 3.1 Mis-captioned photograph — claim `asset-002`

`/images/ho1.jpg` is published on the source homepage with `alt="Aegis Rover"`. Inspecting the file
shows **people at a table with a laptop** — no rover is present.

Handling: re-captioned as `team-review-table.jpg` ("Team members at a review table"), and the
mislabelling is recorded as an unsupported claim on `/content-status`. The original `alt` text is
**not** reproduced anywhere.

### 3.2 Two files were `.jfif`

`mahir.jfif` and `adipta.jfif` are JPEG data with a non-standard extension. Re-encoded to `.jpg`
so every decoder accepts them.

### 3.3 No rover identity in any filename

No source file is named for the robot it shows. AEGIS vs. Zugbee X1 was determined from the
machines themselves — orange treads vs. red treads, presence vs. absence of the arm — and every
caption states which machine is pictured.

---

## 4. Gaps — what could not be recovered

Rendered publicly on `/content-status` under "Still missing", with the owner who can supply each.

| Missing | Owner | Effect on the site |
| --- | --- | --- |
| Authentic 3D model (GLB / GLTF / CAD export) of either rover | Mechanical lead | The 3D explorer renders a **labelled conceptual assembly**, not the real machine |
| Instrumented test data — logs, CSV, trial counts — for any experiment | Research lead | Every experiment shows an absent-results plate instead of a chart |
| Dated photographs of AEGIS on the timber rig, with trial outcomes | Mechanical lead | EXP-001 and EXP-003 are recorded as photographed but unmeasured |
| Official competition participation or result records | Competition coordinator | RoboCup Rescue 2026 stays labelled a target, not a result |
| Higher-resolution, correctly labelled hero imagery | Site maintainer | Hero uses the workshop photograph; `ho1.jpg` is re-captioned |

Also absent upstream and therefore absent here: **publications** (none), **code repositories**
(none), **datasets** (none), **video** (`/video.html` had no recoverable media).

---

## 5. Storage layout

```
public/assets/
├── brand/            5 files   logo, wordmark, university, CAIR, square icon crop
├── robots/
│   ├── aegis/        3 files
│   └── zugbee-x1/    4 files
├── events/          10 files
├── team/            15 files
├── advisors/         3 files
├── partners/         4 files   (UIU and CAIR marks are shared with brand/)
├── press/            4 files
├── resources/        2 files
└── source/          52 files   untouched originals, exact bytes as downloaded
```

`source/` exists so any derivative can be re-cut without re-crawling. It is not referenced by the
application and is not part of any route.

Responsive derivatives are generated at request time by `next/image` (AVIF/WebP). No hand-cut
`sizes` variants are committed, so there is a single source of truth per photograph.

---

## 6. Re-running the crawl

The crawler is `scripts/_crawl.py` (the extracted blueprint text it was written against is
`scripts/_blueprint.txt`). It writes to `public/assets/source/` and prints a URL → local-path map.
To add an asset:

1. Fetch into `public/assets/source/` keeping the original filename.
2. Open the file and confirm what it actually shows — do not trust the `alt` text.
3. Add an `AssetRecord` to `content/assets.ts` with the real subject and a factual caption.
4. Reference it from `content/robots.ts`, `content/team.ts`, or the page that needs it.

Step 2 is not optional. It is what caught `ho1.jpg`.
