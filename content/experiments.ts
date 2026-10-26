import type { Experiment } from "./types";

/**
 * Experiments are recorded with the fields the blueprint's detail template
 * requires. Where a field has no published value it says so — it is never
 * filled with a plausible-looking number.
 *
 * `measurements: null` means no validated dataset exists, so the site renders
 * an absent plate describing what will be plotted, not a decorative chart.
 */
export const experiments: Experiment[] = [
  {
    slug: "aegis-flipper-stair-ascent",
    code: "EXP-001",
    title: "Flipper-assisted stair ascent",
    robot: "AEGIS",
    subsystem: "Locomotion",
    question:
      "Can AEGIS ascend a standard stair flight using its active flippers, and at what riser height does ascent stop being repeatable?",
    whyItMatters:
      "Stairs are the most common obstacle between a robot and a trapped person in a multi-storey collapse. A platform that cannot climb them cannot reach the rooms that matter.",
    status: "protocol-drafted",
    method:
      "Repeated ascent trials on a fixed stair set, with flipper angle treated as the independent variable and success/failure of a clean ascent as the outcome.",
    setup: [
      { label: "Hardware revision", value: "Not recorded in any published document" },
      { label: "Firmware / software", value: "Not recorded" },
      { label: "Terrain", value: "Outdoor concrete steps, fixed flight" },
      { label: "Operator role", value: "Direct line-of-sight remote control" },
      { label: "Environment", value: "Outdoors, daylight; weather not logged" },
    ],
    protocol: [
      "Place the rover at the base of the flight, square to the first riser.",
      "Set the flipper angle for the trial condition and record it.",
      "Command forward motion at a constant throttle until either a clean ascent is complete or the attempt stalls.",
      "Record outcome, time to ascend, and the failure mode where applicable.",
      "Repeat for the planned number of trials per condition.",
      "Stop the series if two consecutive attempts damage the platform.",
    ],
    measurements: null,
    failures:
      "No failure log has been published. The photographs on the project page show the rover on a stepped timber rig, but no accompanying protocol or outcome record exists.",
    interpretation:
      "Nothing can be concluded yet. The protocol above is the team's stated intent; it has not produced a published result set.",
    evidence: [
      { label: "Test video", available: false, note: "Not published" },
      { label: "Raw logs / CSV", available: false, note: "Not published" },
      { label: "Photographs", available: true, note: "Timber obstacle rig, project page" },
      { label: "Written report", available: false, note: "Not published" },
    ],
  },
  {
    slug: "zugbee-x1-outdoor-mobility",
    code: "EXP-002",
    title: "Outdoor mobility baseline",
    robot: "Zugbee X1",
    subsystem: "Locomotion",
    question:
      "What surfaces and step heights can Zugbee X1 traverse reliably with four-wheel drive and a basic end-effector?",
    whyItMatters:
      "X1's limits defined the requirements AEGIS was designed against. Recording them is what makes the second prototype's design decisions legible.",
    status: "completed",
    method:
      "Photographic documentation of the platform on grass, paving and outdoor concrete steps. No instrumented measurement was taken.",
    setup: [
      { label: "Hardware revision", value: "Zugbee X1, completed January 2025" },
      { label: "Terrain", value: "Campus grass, paving, outdoor concrete steps" },
      { label: "Operator role", value: "Remote control" },
      { label: "Environment", value: "Outdoors, daylight" },
    ],
    protocol: [
      "Drive the platform onto each surface type.",
      "Photograph the platform in position.",
      "Note qualitatively whether the surface was traversable.",
    ],
    measurements: null,
    failures:
      "Not recorded. The steps photograph shows the rover stationary on a flight; whether it climbed them is not documented.",
    interpretation:
      "The photographs establish that X1 was operated outdoors on grass, paving and steps. They do not establish any quantitative mobility limit.",
    evidence: [
      { label: "Photographs", available: true, note: "Four published images, project page" },
      { label: "Test video", available: false, note: "Not published" },
      { label: "Raw logs / CSV", available: false, note: "Not published" },
      { label: "Written report", available: false, note: "Not published" },
    ],
  },
  {
    slug: "aegis-obstacle-rig-traverse",
    code: "EXP-003",
    title: "Timber obstacle rig traverse",
    robot: "AEGIS",
    subsystem: "Locomotion",
    question:
      "Can AEGIS traverse a stepped timber rig that approximates rubble and broken floor edges?",
    whyItMatters:
      "Rubble is not a staircase. A rig built from timber steps and angled sheets is a cheap proxy for the irregular surfaces the platform will meet.",
    status: "completed",
    method:
      "Qualitative traverse on a workshop rig built from timber framing and plywood sheets. Documented photographically from two angles.",
    setup: [
      { label: "Rig", value: "Timber frame, plywood deck, stepped and angled faces" },
      { label: "Location", value: "Workshop floor" },
      { label: "Operator role", value: "Remote control" },
      { label: "Instrumentation", value: "None" },
    ],
    protocol: [
      "Place the rover at the rig entry.",
      "Drive across the deck and down the step face.",
      "Photograph from the rear and from the side.",
    ],
    measurements: null,
    failures:
      "Not recorded. Two photographs show the rover on the rig at different points; neither is annotated with an outcome.",
    interpretation:
      "The platform was demonstrably placed on and driven across a stepped timber rig. Success rate, repeatability and failure modes are unknown.",
    evidence: [
      { label: "Photographs", available: true, note: "Two angles, project page" },
      { label: "Test video", available: false, note: "Not published" },
      { label: "Trial count", available: false, note: "Not published" },
      { label: "Written report", available: false, note: "Not published" },
    ],
  },
  {
    slug: "aegis-lidar-slam-drift",
    code: "EXP-004",
    title: "LiDAR SLAM mapping drift",
    robot: "AEGIS",
    subsystem: "Perception",
    question:
      "How much positional drift accumulates in the LiDAR SLAM map over a closed loop in an indoor environment with feature-poor corridors?",
    whyItMatters:
      "A map that drifts is worse than no map: it tells an operator a room is where it is not. Drift must be characterised before mapping is claimed as a capability.",
    status: "planned",
    method:
      "Planned closed-loop traverse with a surveyed start/end point, comparing estimated return position against ground truth.",
    setup: [
      { label: "Hardware revision", value: "To be recorded at time of test" },
      { label: "Sensor", value: "LiDAR as specified on the project page" },
      { label: "Environment", value: "Indoor corridor loop, to be selected" },
      { label: "Ground truth", value: "Surveyed start and end marker" },
    ],
    protocol: [
      "Survey and mark the start position.",
      "Drive a closed loop at constant speed.",
      "Return to the start marker and record the estimated pose.",
      "Compute the difference between estimated and surveyed return position.",
      "Repeat across the planned number of loops and lighting conditions.",
    ],
    measurements: null,
    failures:
      "Not applicable — the experiment has not been run.",
    interpretation:
      "This is a planned experiment. No mapping accuracy is claimed anywhere on this site.",
    evidence: [
      { label: "Test video", available: false, note: "Planned" },
      { label: "Raw logs / CSV", available: false, note: "Planned" },
      { label: "Photographs", available: false, note: "Planned" },
      { label: "Written report", available: false, note: "Planned" },
    ],
  },
];

export const experimentRobots = ["All", "AEGIS", "Zugbee X1"] as const;
export const experimentSubsystems = [
  "All",
  "Locomotion",
  "Perception",
  "Manipulation",
] as const;

export function getExperiment(slug: string) {
  return experiments.find((e) => e.slug === slug);
}
