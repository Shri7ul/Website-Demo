# Fact-check report

**Checked:** 27 October 2026
**Scope:** every date-sensitive, competition-related or high-impact claim the site
makes, plus the claims inherited from the previous site that were removed.
**Method:** read the claim ledger (`content/claims.ts`), then for each claim go to
the primary source. Where no primary source exists, the claim is marked as such —
it is not softened into something that sounds verified.

The public-facing version of this ledger is `/content-status`, which is `noindex`.
Counts there are derived from the array, not typed in, so they cannot drift.

**Ledger totals after this pass: 22 claims — 10 verified, 6 needs review, 0 planned,
6 unsupported.**

---

## 1. RoboCup Rescue 2026 — the date-sensitive core

### 1.1 The event itself — VERIFIED

| Field | Value | Source |
| --- | --- | --- |
| Event | RoboCup 2026 (world championship, incl. RoboCupRescue Robot League) | <https://robocup.org/events/80> |
| Dates | **30 June – 6 July 2026** | <https://robocup.org/events/80> |
| Venue | Songdo Convensia, Incheon, Republic of Korea | <https://2026.robocup.org/> |
| Rescue league size | **23 teams** travelled | <https://rrl.robocup.org/> (closing letter, 6 July 2026) |
| Season status | Closed — "as the 2026 RoboCup Rescue League comes to a close" | <https://rrl.robocup.org/> |
| Next edition | Germany, 2027 | <https://rrl.robocup.org/> |

The rescue league's own site states 35 team participation forms were received,
including 17 new teams, and that 25 could be accepted. It does not publish a
2026 team list, and it does not publish 2026 results or rankings.

### 1.2 URRT's participation — UNVERIFIED, and that is the finding

| Question | Answer | Basis |
| --- | --- | --- |
| Did URRT qualify? | **No published evidence** | No 2026 team list is published by the league; the March 20 and April 28, 2026 qualification announcements are not accessible as a list naming URRT |
| Did URRT compete? | **No published evidence** | No entry list, result sheet, or announcement naming URRT or United International University was found |
| Did URRT place? | **No claim is made** | The league published no 2026 rankings |

**What the team's own site says.** `rescuerover.uiu.ac.bd/index.html` still reads:

> "…represent internationally at RoboCup Rescue 2026." · "Icheon, South Korea • July 2026"

Two problems with that sentence, both preserved as findings:

1. It is written in the future tense for an event that finished on 6 July 2026.
2. It spells the host city **"Icheon"**. The correct name is **Incheon**. The
   original site's error is recorded in claim `comp-001` rather than silently
   corrected, so anyone reconciling the two sites knows why the spelling differs.

**What the site now says.** `/journey` shows the event facts and the team status
side by side:

> **Event** concluded · **URRT** No published participation record

and the timeline entry is titled *"RoboCup Rescue 2026, Incheon — event concluded"*.
Nothing anywhere on the site says URRT attended, qualified, or placed.

**To close this gap** the competition coordinator needs to supply one of: the
league's acceptance email, the team's registration confirmation, a dated
photograph from the venue, or the league's published team list. Until then
`comp-001` stays `needs-review` and the journey page keeps both rows.

### 1.3 Wording that had to change

| File | Was | Now |
| --- | --- | --- |
| `content/site.ts` (site-wide meta description) | "…is preparing an entry for RoboCup Rescue 2026." | "…publishes the engineering record — including what is not yet known." |
| `components/site-footer.tsx` | "…targeting RoboCup Rescue 2026." | "…built toward the RoboCup Rescue league." |
| `app/page.tsx` (sponsorship paragraph) | "…travel support for RoboCup Rescue 2026." | "…travel support to compete at league level." |
| `app/collaborate/page.tsx` (meta description) | "…travel support for RoboCup Rescue 2026." | "…travel support for competition entry." |
| `app/collaborate/page.tsx` (travel need) | "RoboCup Rescue 2026 is the stated target." | Past tense, plus "the team has not published a participation record" |
| `content/timeline.ts` | "As of 26 October 2026 this date has passed…" | Real dates, "event concluded", explicit non-claim |

---

## 2. Claims removed because the evidence does not support them

### 2.1 Competition results belonging to a different team — UNSUPPORTED

The previous site listed four results under "Our achievements" on the URRT
homepage. All four belong to the **UIU Mars Rover Team (UMRT)**, a different team
at the same university, with different rovers (AXIOS and TELOS):

| Result | Actual owner |
| --- | --- |
| BEAR Summit 2025 — 2nd runner-up | UMRT |
| Anatolian Rover Challenge 2025 — 3rd place, Best Science, Best Autonomous Driving | UMRT (rover AXIOS) |
| Anatolian Rover Challenge 2023 — 3rd place | UMRT (rover TELOS) |
| University Rover Challenge 2025 — 6th place | UMRT |

**Treatment:** removed from every page. Listed on `/journey` under "Excluded from
this record" with the reason, and recorded as claim `comp-002` (`unsupported`).
They are not shown as URRT milestones anywhere.

**Why this matters more than a typo:** presenting another team's trophies is the
single most damaging thing a student robotics site can do. It survives exactly
until a judge or a sponsor checks.

### 2.2 "50+ hours of testing" — UNSUPPORTED

Claim `robot-007`. No log, no time-tracking export, no dated test record exists
anywhere on the source site. Removed. The experiments pages instead say, per
record, "No validated measurements published".

### 2.3 "15+ members" — UNSUPPORTED

Claim `roster-002`. The roster publishes exactly 15 named members. The "+" implied
a larger, uncounted group. Removed; the page states 15 and the filter counts are
derived from the roster array.

### 2.4 "AEGIS has a verified quantitative performance figure" — UNSUPPORTED

Claim `evidence-001`. There is no speed, runtime, payload or success-rate figure
in any published source. Every experiment record therefore renders an absent
results plate and a note on what would be plotted once data exists. **No chart
renders anywhere on the site, because no chart could be honest.**

### 2.5 "An authentic 3D model of AEGIS or Zugbee X1 is available" — UNSUPPORTED

Claim `asset-003`. No GLB, GLTF, OBJ or CAD export is published. The 3D explorer
renders a **conceptual assembly built from primitives**, labelled as such in the
caption ("Conceptual assembly — interactive assembly of AEGIS"), in the caption
note ("Dimensions are not to scale"), and in a paragraph beneath the plate. It is
never described as the AEGIS CAD model.

`NEXT_PUBLIC_ROVER_GLB` swaps in a real model. When that happens, claim `asset-003`
must be retired and the caption changed — otherwise the site will keep calling an
authentic model conceptual. This is written into `docs/REPORT.md` §7 as well.

---

## 3. Media whose published description is wrong

### 3.1 `ho1.jpg` — the alt text names the wrong subject

| | |
| --- | --- |
| **Published alt** | "Aegis Rover" |
| **Actually shows** | Several people around a laptop at a review table; no rover is visible |
| **Verification** | Opened the file at full size and inspected it |
| **Treatment** | Re-captioned as `team-review-table.jpg`, alt text rewritten to describe what is visible, recorded as claim `asset-002` (`unsupported`) |

### 3.2 `brand-logo` — the filename belongs to another team, the artwork does not

The team badge is served from `/images/umrt_logo.png` on the source site — a
filename that references the Mars Rover Team. The artwork itself reads
**"UIU RESCUE ROVER TEAM"** and **"#URRT"**, so it is URRT's own badge and is kept.

Recorded so the next maintainer does not "fix" a non-problem, and so nobody
assumes the file was swapped by mistake.

---

## 4. Claims that survived checking

| ID | Claim | Status | Basis |
| --- | --- | --- | --- |
| `org-001` | URRT is a student team at United International University, Dhaka | verified | Team site, university attribution, `@cair.uiu.ac.bd` contact domain |
| `org-002` | URRT was formed in September 2024 | verified | Source site mission timeline |
| `org-003` | URRT operates within CAIR at UIU | verified | Contact page and sponsor page both name CAIR and the 4th-floor lab |
| `roster-001` | The team has 15 active members | verified | 15 named, photographed members on the roster page |
| `robot-001` | Zugbee X1 is a four-wheel-drive wheeled rover completed January 2025 | verified | Project page spec table and photographs |
| `robot-002` | AEGIS is a tracked UGV with active flippers, 6-DOF manipulator, LiDAR/depth/IMU | verified | Project page spec table; visible in the published photographs |
| `robot-003` | AEGIS is in active development | verified | Project page describes it as the current platform |
| `robot-008` | The team has built 2 rover prototypes | verified | Two distinct platforms with separate spec tables and photographs |
| `asset-001` | The published photographs show URRT hardware and members | verified | Every image inspected; hardware and roster match the written record |
| `contact-001` | `rescuerover@cair.uiu.ac.bd` and `+880 1909356346` are current contact routes | verified against source | Both transcribed from the source contact page. **Not independently confirmed as still monitored** — the team should confirm before relying on them |

---

## 5. Claims left standing but flagged for review

These are published by the team and repeated on the site, but conflict internally
or cannot be checked from outside.

| ID | Claim | Why it is `needs-review` |
| --- | --- | --- |
| `robot-004` | A "final rescue rover" was "fully workable" by January 2026 | The source site's homepage says this; its project page simultaneously describes AEGIS as still in development. The two statements cannot both be true, and no test record supports the stronger one. The site quotes both and says they conflict. |
| `robot-005` | AEGIS has autonomous navigation capability | Claimed on the source site. No autonomy log, demo or trial record is published. |
| `robot-006` | AEGIS performs victim detection | Claimed. No detection result, dataset or false-positive rate is published. |
| `roster-003` | Individual members hold specific technical ownership of subsystems | The roster publishes discipline only. The site therefore shows discipline and does not invent job titles. |
| `comp-003` | URRT is "Bangladesh's premier rescue robotics team" | A superlative with no comparative evidence. Not displayed as fact anywhere. |
| `comp-001` | URRT will compete at RoboCup Rescue 2026 | Event concluded; participation unconfirmed. See §1. |

---

## 6. Standing rule for future edits

1. A number needs a log, a photograph with a date, or a published table. Otherwise
   it does not go on the site.
2. A result needs a result sheet that names this team.
3. A photograph needs a caption that describes what is in the frame, not what the
   previous site said was in the frame.
4. A goal stays a goal until someone publishes evidence that it was met.
5. Every new claim gets an entry in `content/claims.ts` before it gets a sentence
   on a page.

`/content-status` is the enforcement surface. If a claim is not in the ledger, it
is not on the site.
