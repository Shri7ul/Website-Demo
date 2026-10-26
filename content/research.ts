export type ResearchTheme = {
  slug: string;
  title: string;
  question: string;
  why: string;
  approach: string;
  experiments: string[];
  /** Papers, preprints, datasets — empty until something is published. */
  publications: { title: string; venue: string; status: string; doi?: string }[];
  limitations: string;
};

/**
 * Research themes derived from the team's own published subsystem descriptions.
 * No publication, dataset or citation is claimed: the arrays are empty because
 * nothing has been published, and the page says so.
 */
export const researchThemes: ResearchTheme[] = [
  {
    slug: "mobility-over-rubble",
    title: "Mobility over rubble and steps",
    question:
      "What locomotion configuration lets a small ground vehicle keep a stable, recoverable pose on irregular collapse debris?",
    why: "The failure mode that ends a search is usually mobility, not sensing. A platform that cannot hold position on a step edge cannot deliver its sensors anywhere useful.",
    approach:
      "The team moved from four-wheel drive on Zugbee X1 to continuous tracks with articulated flippers on AEGIS. The flippers act as levers over a lip rather than relying on traction alone.",
    experiments: ["aegis-flipper-stair-ascent", "aegis-obstacle-rig-traverse", "zugbee-x1-outdoor-mobility"],
    publications: [],
    limitations:
      "No instrumented trial has been published. Whether the configuration is repeatable, and at what riser height it fails, is unknown. This is a design rationale, not a result.",
  },
  {
    slug: "mapping-in-degraded-environments",
    title: "Mapping where the data is bad",
    question:
      "How far does a LiDAR SLAM map drift over a closed indoor loop when corridors are feature-poor and air is dusty?",
    why: "A drifted map is actively misleading: it places a room where it is not. Drift has to be characterised before mapping can be called a capability.",
    approach:
      "AEGIS is specified with LiDAR, RGB-D depth cameras and an IMU in one stack. The intended pipeline is SLAM-based mapping feeding an operator display.",
    experiments: ["aegis-lidar-slam-drift"],
    publications: [],
    limitations:
      "The experiment is planned, not run. No map, accuracy figure or dataset exists. Nothing on this site claims mapping accuracy.",
  },
  {
    slug: "manipulation-in-confined-space",
    title: "Manipulation in confined space",
    question:
      "Can a 6-DOF arm on a tracked base reach and operate a door handle from a pose the base can actually achieve inside a collapse void?",
    why: "Reach is easy to specify and hard to achieve. The constraint is rarely the arm's workspace in free space; it is the base pose available in a low void.",
    approach:
      "AEGIS carries a 6-DOF articulated arm with a parallel jaw gripper, intended for interacting with casualties, doors, debris and equipment.",
    experiments: [],
    publications: [],
    limitations:
      "No experiment is registered for manipulation yet, and no reach envelope, payload or repeatability figure has been published. The section on /engineering marks this subsystem as documented in intent only.",
  },
];

export function getResearchTheme(slug: string) {
  return researchThemes.find((t) => t.slug === slug);
}
