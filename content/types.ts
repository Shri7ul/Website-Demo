/**
 * Verification vocabulary — per blueprint §06.
 * These four states must remain distinguishable without colour
 * (shape + label + colour), because they carry meaning.
 */
export type ClaimStatus = "verified" | "needs-review" | "planned" | "unsupported";

export type Claim = {
  id: string;
  text: string;
  status: ClaimStatus;
  /** What evidence exists, in plain language. Never fabricated. */
  evidence: string;
  /** Where the claim came from. */
  source?: string;
  /** Who is responsible for confirming it. */
  owner: string;
  /** ISO date of last review, or null if never reviewed. */
  reviewed: string | null;
  /** Why it is not displayed publicly, when applicable. */
  publicTreatment: string;
};

export type AssetRecord = {
  assetId: string;
  originalUrl: string;
  sourcePage: string;
  subject: string;
  localPath: string;
  caption: string;
  alt: string;
  /** Width x height of the recovered original, when known. */
  dimensions?: string;
  status: "verified" | "review" | "rejected";
  note?: string;
};

export type Robot = {
  slug: string;
  name: string;
  designation: string;
  version: string;
  status: "active-development" | "completed" | "planned";
  statusLabel: string;
  summary: string;
  intro: string;
  tags: string[];
  specs: { label: string; value: string; note?: string }[];
  subsystems: {
    key: string;
    name: string;
    summary: string;
    detail: string;
    /** Where this subsystem sits on the conceptual 3D model. */
    anchor: [number, number, number];
  }[];
  gallery: { src: string; caption: string; alt: string; aspect: "portrait" | "landscape" }[];
  changelog: { date: string; entry: string; status: ClaimStatus }[];
};

export type Member = {
  id: string;
  name: string;
  role: string;
  discipline: "Mechanical" | "Electrical" | "Software & Autonomous";
  photo: string | null;
};

export type Advisor = {
  name: string;
  title: string;
  affiliation: string;
  role: string;
  email: string;
  interests: string[];
  photo: string;
};

export type TimelineEvent = {
  date: string;
  sortKey: string;
  title: string;
  detail: string;
  status: ClaimStatus;
  /** planned events are future goals, never achieved capability */
  kind: "milestone" | "goal";
};

export type Experiment = {
  slug: string;
  code: string;
  title: string;
  robot: string;
  subsystem: string;
  question: string;
  whyItMatters: string;
  status: "completed" | "protocol-drafted" | "planned";
  method: string;
  setup: { label: string; value: string }[];
  protocol: string[];
  /** null when no validated numbers exist — never a decorative fake chart */
  measurements: { label: string; value: string; unit: string }[] | null;
  failures: string;
  interpretation: string;
  evidence: { label: string; available: boolean; note: string }[];
};
