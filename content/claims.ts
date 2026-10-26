import type { Claim } from "./types";

/**
 * Claim ledger — blueprint §06.
 *
 * Every statement the site makes about the team is registered here with its
 * status, evidence and owner. The public site renders only `verified` claims as
 * confident fact; `planned` claims are labelled as goals; `needs-review` and
 * `unsupported` claims are not presented as achievements.
 */
export const claims: Claim[] = [
  {
    id: "org-001",
    text: "URRT is a student team at United International University, Dhaka.",
    status: "verified",
    evidence:
      "Team site, university attribution and @cair.uiu.ac.bd contact domain. University logo used with the team's own published assets.",
    source: "rescuerover.uiu.ac.bd",
    owner: "Project lead",
    reviewed: "2026-10-26",
    publicTreatment: "Stated as fact on every page, in the footer and the about block.",
  },
  {
    id: "org-002",
    text: "URRT was formed in September 2024.",
    status: "verified",
    evidence: "Mission timeline on the team's homepage.",
    source: "rescuerover.uiu.ac.bd/index.html",
    owner: "Project lead",
    reviewed: "2026-10-26",
    publicTreatment: "Shown on /journey as a dated milestone.",
  },
  {
    id: "org-003",
    text: "URRT operates within the Center for Artificial Intelligence Research (CAIR) at UIU.",
    status: "verified",
    evidence:
      "Contact address is rescuerover@cair.uiu.ac.bd; the site names the CAIR Lab as 4th Floor, Academic Building.",
    source: "rescuerover.uiu.ac.bd/contact.html",
    owner: "Team coordinator",
    reviewed: "2026-10-26",
    publicTreatment: "Stated in the footer and on /contact.",
  },
  {
    id: "roster-001",
    text: "The team has 15 active members.",
    status: "verified",
    evidence:
      "Roster page lists exactly 15 members with IDs URRT-001 to URRT-015, headed '2026 TEAM MEMBERS'.",
    source: "rescuerover.uiu.ac.bd/member.html",
    owner: "Team coordinator",
    reviewed: "2026-10-26",
    publicTreatment:
      "Rendered from the roster itself, so the count is derived, not asserted.",
  },
  {
    id: "roster-002",
    text: "The team has '15+' members.",
    status: "unsupported",
    evidence:
      "The homepage counter reads '15+' but the roster contains exactly 15 entries. The '+' has no supporting roster.",
    source: "rescuerover.uiu.ac.bd/index.html",
    owner: "Team coordinator",
    reviewed: "2026-10-26",
    publicTreatment:
      "Not used. The site states the derived count of 15 and links to the roster.",
  },
  {
    id: "roster-003",
    text: "Individual members hold specific technical ownership of subsystems.",
    status: "needs-review",
    evidence:
      "Only team-level discipline is published (Mechanical / Electrical / Software & Autonomous). No individual contribution is documented.",
    source: "rescuerover.uiu.ac.bd/member.html",
    owner: "Team coordinator",
    reviewed: "2026-10-26",
    publicTreatment:
      "People cards show discipline only. No invented job titles or contributions.",
  },
  {
    id: "robot-001",
    text: "Zugbee X1 is a four-wheel-drive wheeled rover completed in January 2025.",
    status: "verified",
    evidence:
      "Project page specification table plus four published photographs of the platform outdoors.",
    source: "rescuerover.uiu.ac.bd/projects.html",
    owner: "Mechanical lead",
    reviewed: "2026-10-26",
    publicTreatment: "Stated on /robots/zugbee-x1 with the photographs as evidence.",
  },
  {
    id: "robot-002",
    text: "AEGIS is a tracked UGV with active flippers, a 6-DOF manipulator, and LiDAR / depth / IMU sensing.",
    status: "verified",
    evidence:
      "Project page specification table and subsystem descriptions, plus three photographs of the physical platform on a timber rig.",
    source: "rescuerover.uiu.ac.bd/projects.html",
    owner: "Mechanical lead",
    reviewed: "2026-10-26",
    publicTreatment: "Stated on /robots/aegis, each subsystem linked to its photograph.",
  },
  {
    id: "robot-003",
    text: "AEGIS is in active development.",
    status: "verified",
    evidence: "Project page status field reads 'In Development'.",
    source: "rescuerover.uiu.ac.bd/projects.html",
    owner: "Project lead",
    reviewed: "2026-10-26",
    publicTreatment: "Status chip on /robots and /robots/aegis.",
  },
  {
    id: "robot-004",
    text: "A 'final rescue rover' was 'fully workable' by January 2026.",
    status: "needs-review",
    evidence:
      "The homepage timeline asserts this, but the project page simultaneously describes AEGIS as in development. No test record supports 'fully workable'.",
    source: "rescuerover.uiu.ac.bd/index.html",
    owner: "Project lead",
    reviewed: "2026-10-26",
    publicTreatment:
      "Not displayed as an achievement. /journey shows the contradiction explicitly.",
  },
  {
    id: "robot-005",
    text: "AEGIS has autonomous navigation capability.",
    status: "needs-review",
    evidence:
      "The project page lists 'Autonomous Nav' as a tag and describes a SLAM pipeline, but no demonstration, dataset or accuracy figure is published. Photographs show remote-controlled operation.",
    source: "rescuerover.uiu.ac.bd/projects.html",
    owner: "Software & Autonomous lead",
    reviewed: "2026-10-26",
    publicTreatment:
      "Presented as a design intent, never as a demonstrated capability. EXP-004 is registered as planned.",
  },
  {
    id: "robot-006",
    text: "AEGIS performs victim detection.",
    status: "needs-review",
    evidence:
      "Mentioned inside the perception description. No dataset, protocol, or false-positive/false-negative rate is published.",
    source: "rescuerover.uiu.ac.bd/projects.html",
    owner: "Software & Autonomous lead",
    reviewed: "2026-10-26",
    publicTreatment:
      "Named as part of the perception stack's intended role, never as a working detector.",
  },
  {
    id: "robot-007",
    text: "The team has logged 50+ hours of testing.",
    status: "unsupported",
    evidence:
      "Homepage counter only. No test logs, dates, or trial counts are published anywhere on the site.",
    source: "rescuerover.uiu.ac.bd/index.html",
    owner: "Project lead",
    reviewed: "2026-10-26",
    publicTreatment:
      "Removed from the public surface. Replaced by per-experiment evidence lists that state what exists.",
  },
  {
    id: "robot-008",
    text: "The team has built 2 rover prototypes.",
    status: "verified",
    evidence:
      "Two documented platforms with distinct specification tables and photographs: Zugbee X1 (V1) and AEGIS (V2).",
    source: "rescuerover.uiu.ac.bd/projects.html",
    owner: "Project lead",
    reviewed: "2026-10-26",
    publicTreatment: "Derived from the robots collection on /robots.",
  },
  {
    id: "comp-001",
    text: "URRT will compete at RoboCup Rescue 2026 in Incheon, South Korea, 30 June – 6 July 2026.",
    status: "needs-review",
    evidence:
      "Stated as a target on the team's homepage and project page. The event itself is verified: RoboCup 2026 ran 30 June – 6 July 2026 at Songdo Convensia, Incheon (robocup.org/events/80), and the rescue league closed its 2026 season on 6 July with 23 teams. No entry list, result sheet or announcement naming URRT has been published, so participation is unconfirmed. Note the team's site spells the city 'Icheon'.",
    source: "rescuerover.uiu.ac.bd/index.html · robocup.org/events/80 · rrl.robocup.org",
    owner: "Competition coordinator",
    reviewed: "2026-10-27",
    publicTreatment:
      "Labelled as a target on /journey and /robots, never as participation or a result. The event date is stated in the past tense; team participation remains unconfirmed.",
  },
  {
    id: "comp-002",
    text: "URRT has achieved results at BEAR Summit, ARC 2023, ARC 2025 or URC 2025.",
    status: "unsupported",
    evidence:
      "These results belong to the UIU Mars Rover Team (UMRT) and its rovers AXIOS and TELOS. They were presented on the URRT homepage under 'Our achievements', which is a misattribution.",
    source: "rescuerover.uiu.ac.bd/index.html",
    owner: "Project lead",
    reviewed: "2026-10-26",
    publicTreatment:
      "Excluded entirely. Not shown as URRT achievements on any page. Recorded here and on /journey as excluded.",
  },
  {
    id: "comp-003",
    text: "URRT is 'Bangladesh's premier rescue robotics team'.",
    status: "needs-review",
    evidence:
      "Comparative superlative with no ranking, judging body, or citation behind it.",
    source: "rescuerover.uiu.ac.bd/member.html",
    owner: "Project lead",
    reviewed: "2026-10-26",
    publicTreatment: "Not used anywhere. Marketing language removed.",
  },
  {
    id: "evidence-001",
    text: "AEGIS has a verified quantitative performance figure (speed, runtime, payload, success rate).",
    status: "unsupported",
    evidence:
      "No measurement set, trial log, or protocol has been published for either platform.",
    source: "—",
    owner: "Research lead",
    reviewed: "2026-10-26",
    publicTreatment:
      "No numbers appear. Every spec row without a published value reads 'Not yet documented' with the owner named.",
  },
  {
    id: "asset-001",
    text: "The published photographs show UIU Rescue Rover Team hardware and members.",
    status: "verified",
    evidence:
      "All media was recovered from the team's own domain and retains its original filename, page of origin and alt text. No third-party stock imagery is used.",
    source: "rescuerover.uiu.ac.bd",
    owner: "Site maintainer",
    reviewed: "2026-10-26",
    publicTreatment: "Every plate carries a factual caption and records its source page.",
  },
  {
    id: "asset-002",
    text: "ho1.jpg depicts the AEGIS rover.",
    status: "unsupported",
    evidence:
      "The source page sets alt=\"Aegis Rover\" on ho1.jpg, but the image shows a group of people around a laptop at a table with no rover visible.",
    source: "rescuerover.uiu.ac.bd/index.html",
    owner: "Site maintainer",
    reviewed: "2026-10-26",
    publicTreatment:
      "Re-captioned as 'team reviewing a laptop at a competition table'. The original alt text is recorded here, not repeated on the site.",
  },
  {
    id: "asset-003",
    text: "An authentic 3D model of AEGIS or Zugbee X1 is available.",
    status: "unsupported",
    evidence:
      "No GLB/GLTF, CAD export, or point cloud is published on the team's site or linked repositories.",
    source: "—",
    owner: "Mechanical lead",
    reviewed: "2026-10-26",
    publicTreatment:
      "The 3D explorer renders a clearly labelled conceptual assembly, not the physical rover. Drop a real GLB at /models/aegis.glb to replace it.",
  },
  {
    id: "contact-001",
    text: "rescuerover@cair.uiu.ac.bd and +880 1909356346 are current contact routes.",
    status: "verified",
    evidence: "Published in the contact block of every page on the team's site.",
    source: "rescuerover.uiu.ac.bd/contact.html",
    owner: "Team coordinator",
    reviewed: "2026-10-26",
    publicTreatment: "Shown on /contact with the published office hours.",
  },
];

export const claimsByStatus = (s: Claim["status"]) =>
  claims.filter((c) => c.status === s);

export const claimCounts = {
  verified: claimsByStatus("verified").length,
  needsReview: claimsByStatus("needs-review").length,
  planned: claimsByStatus("planned").length,
  unsupported: claimsByStatus("unsupported").length,
  total: claims.length,
};
