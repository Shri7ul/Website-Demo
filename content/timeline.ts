import type { TimelineEvent } from "./types";

/**
 * Dates and wording from rescuerover.uiu.ac.bd/index.html "Mission timeline".
 * Statuses reflect what can actually be checked, not what the old page asserted.
 */
export const timeline: TimelineEvent[] = [
  {
    date: "September 2024",
    sortKey: "2024-09",
    title: "Team formed",
    detail:
      "URRT was established at United International University with a stated aim of advancing rescue robotics in Bangladesh.",
    status: "verified",
    kind: "milestone",
  },
  {
    date: "January 2025",
    sortKey: "2025-01",
    title: "Zugbee X1 completed",
    detail:
      "The team's first rescue rover was completed with basic mobility and sensor systems. Photographs of the finished platform are published on the project page.",
    status: "verified",
    kind: "milestone",
  },
  {
    date: "January 2026",
    sortKey: "2026-01",
    title: "AEGIS listed as the current platform",
    detail:
      "The project page describes AEGIS as the current platform in active development. The homepage timeline separately describes a 'final rescue rover' as 'fully workable' — the two statements conflict, and no test record supports the stronger one.",
    status: "needs-review",
    kind: "milestone",
  },
  {
    date: "March 2026",
    sortKey: "2026-03",
    title: "Team description paper",
    detail:
      "The team listed preparation of a Team Description Paper and the competition participation form. The year is not stated on the source page.",
    status: "needs-review",
    kind: "milestone",
  },
  {
    date: "30 June – 6 July 2026",
    sortKey: "2026-07",
    title: "RoboCup Rescue 2026, Incheon — event concluded",
    detail:
      "The competition the team named as its target ran at Songdo Convensia, Incheon, Republic of Korea, and the league has since closed its 2026 season. No entry list, result sheet or announcement naming URRT has been published, so participation is unconfirmed and no result is claimed here.",
    status: "needs-review",
    kind: "goal",
  },
];

/**
 * Deliberately excluded from the journey.
 *
 * The previous site presented three UMRT results (BEAR Summit 2025 runner-up,
 * ARC 2025 third place + Best Science + Best Autonomous Driving, ARC 2023 third
 * place) and a URC 2025 placing inside the URRT page. Those belong to the UIU
 * Mars Rover Team — a different team with different rovers (AXIOS, TELOS).
 * They are recorded in the claim ledger as misattributed and are not shown here.
 */
export const excludedAchievements = [
  "BEAR Summit 2025 — 2nd runner-up (UMRT)",
  "Anatolian Rover Challenge 2025 — 3rd place, Best Science, Best Autonomous Driving (UMRT, rover AXIOS)",
  "Anatolian Rover Challenge 2023 — 3rd place (UMRT, rover TELOS)",
  "University Rover Challenge 2025 — 6th place (UMRT)",
];
