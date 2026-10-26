import type { Robot } from "./types";

/**
 * All specifications below are transcribed from the team's own project page
 * (rescuerover.uiu.ac.bd/projects.html). Nothing here is inferred, and no
 * numeric performance figure is stated because none has been published.
 */
export const robots: Robot[] = [
  {
    slug: "aegis",
    name: "AEGIS",
    designation: "Prototype 02 / Tracked UGV",
    version: "V2",
    status: "active-development",
    statusLabel: "In development",
    summary:
      "A tracked unmanned ground vehicle for urban search and rescue, with active flippers and a 6-DOF manipulator.",
    intro:
      "AEGIS is a tracked unmanned ground vehicle designed for urban search and rescue environments. It combines high-mobility locomotion with active flippers, a multi-sensor perception stack, and a 6-DOF manipulator for interaction in confined and hazardous spaces.",
    tags: [
      "Tracked locomotion",
      "Active flippers",
      "6-DOF arm",
      "Multi-sensor",
      "Modular",
    ],
    specs: [
      { label: "Platform", value: "Tracked UGV" },
      { label: "Locomotion", value: "Rubber tracks + active flippers" },
      { label: "Manipulator", value: "6-DOF robotic arm" },
      { label: "Sensors", value: "LiDAR, depth camera, IMU" },
      { label: "Design", value: "Modular, rapid deployment" },
      { label: "Status", value: "In development" },
      {
        label: "Mass",
        value: "Not yet documented",
        note: "No published figure. Request from the mechanical lead.",
      },
      {
        label: "Runtime",
        value: "Not yet documented",
        note: "No published figure. Request from the electrical lead.",
      },
      {
        label: "Test hours",
        value: "Not yet documented",
        note: "The previous site claimed 50+ hours; no logs support it.",
      },
    ],
    subsystems: [
      {
        key: "locomotion",
        name: "Locomotion",
        summary: "Tracks + active flippers",
        detail:
          "Continuous rubber tracks with articulated front and rear flippers enable traversal of stairs, rubble piles, and extreme terrain profiles found in disaster zones.",
        anchor: [0.66, 0.2, 0.3],
      },
      {
        key: "perception",
        name: "Perception",
        summary: "Multi-sensor stack",
        detail:
          "Integrated LiDAR, RGB-D depth cameras, and an IMU provide a 360° spatial awareness pipeline intended for SLAM-based mapping and victim detection.",
        anchor: [0, 0.99, 0.3],
      },
      {
        key: "manipulation",
        name: "Manipulation",
        summary: "6-DOF robotic arm",
        detail:
          "A 6 degree-of-freedom articulated arm allows the robot to interact with victims, open doors, move debris, and operate equipment in confined hazardous spaces.",
        anchor: [0.38, 1.07, -0.25],
      },
    ],
    gallery: [
      {
        src: "/assets/robots/aegis/aegis-workshop-front.jpg",
        caption:
          "AEGIS in the workshop, front three-quarter view. Tracked chassis, orange track treads, articulated arm with gripper.",
        alt: "A tracked rescue rover with orange track treads and a raised articulated robotic arm, standing on a workshop floor beside a timber obstacle rig.",
        aspect: "landscape",
      },
      {
        src: "/assets/robots/aegis/aegis-obstacle-rear.jpg",
        caption:
          "AEGIS on the timber obstacle rig, rear view. Flippers raised against the step face.",
        alt: "The same tracked rover photographed from behind on a stepped timber obstacle, with its flippers raised.",
        aspect: "landscape",
      },
      {
        src: "/assets/robots/aegis/aegis-obstacle-side.jpg",
        caption:
          "AEGIS descending the rig, side view. The arm is folded forward and the tracks are angled across the step edge.",
        alt: "The tracked rover seen from the side on a timber obstacle, tracks angled across a step edge and arm folded forward.",
        aspect: "landscape",
      },
    ],
    changelog: [
      {
        date: "2026-01",
        entry:
          "Listed on the team's project page as the current platform, in active development.",
        status: "verified",
      },
      {
        date: "2025-01",
        entry:
          "Successor to Zugbee X1; the team states X1's design constraints shaped this platform.",
        status: "verified",
      },
      {
        date: "—",
        entry:
          "No dated build log, mass, runtime, or test record has been published. This page will be updated when those exist.",
        status: "needs-review",
      },
    ],
  },
  {
    slug: "zugbee-x1",
    name: "Zugbee X1",
    designation: "Prototype 01 / Wheeled Rover",
    version: "V1",
    status: "completed",
    statusLabel: "Completed January 2025",
    summary:
      "The team's first rescue rover: a four-wheel-drive platform that established the architecture AEGIS builds on.",
    intro:
      "Zugbee X1 is the team's inaugural rescue rover, completed in January 2025. It established the foundational architecture, sensor integration pipeline, and software stack that AEGIS builds upon.",
    tags: ["First prototype", "4-wheel drive", "Basic end-effector", "Legacy"],
    specs: [
      { label: "Platform", value: "Wheeled rover" },
      { label: "Locomotion", value: "4-wheel drive" },
      { label: "Manipulator", value: "Basic end-effector" },
      { label: "Sensors", value: "Camera, ultrasonic" },
      { label: "Completed", value: "January 2025" },
      { label: "Status", value: "Legacy / completed" },
      {
        label: "Mass",
        value: "Not yet documented",
        note: "No published figure.",
      },
      {
        label: "Range",
        value: "Not yet documented",
        note: "No published figure.",
      },
    ],
    subsystems: [
      {
        key: "locomotion",
        name: "Locomotion",
        summary: "Four-wheel drive",
        detail:
          "A four-wheel-drive chassis. The recovered photographs show red treaded wheels and a white body shell on grass and on outdoor steps.",
        anchor: [0.66, 0.2, 0.3],
      },
      {
        key: "perception",
        name: "Perception",
        summary: "Camera + ultrasonic",
        detail:
          "A camera and ultrasonic rangefinders. This was the sensor pipeline that later informed AEGIS's multi-sensor stack.",
        anchor: [0, 0.95, 0.3],
      },
      {
        key: "manipulation",
        name: "Manipulation",
        summary: "Basic end-effector",
        detail:
          "A basic end-effector rather than a full manipulator. The step to a 6-DOF arm came with AEGIS.",
        anchor: [0.38, 1.0, -0.25],
      },
    ],
    gallery: [
      {
        src: "/assets/robots/zugbee-x1/zugbee-x1-campus.jpg",
        caption:
          "Zugbee X1 on the campus lawn, with the university mosque behind. The rover is roughly knee height at the body.",
        alt: "A small red-tracked white-bodied rover on a grass lawn, with a gold-domed mosque and minaret in the background.",
        aspect: "landscape",
      },
      {
        src: "/assets/robots/zugbee-x1/zugbee-x1-grass.jpg",
        caption: "Zugbee X1 on grass, rear three-quarter. Red treaded wheels, white shell.",
        alt: "Close view of a small rover with red treaded wheels and a white body shell resting on tall grass.",
        aspect: "portrait",
      },
      {
        src: "/assets/robots/zugbee-x1/zugbee-x1-steps.jpg",
        caption:
          "Zugbee X1 on outdoor concrete steps. The photograph is undated and no protocol accompanies it.",
        alt: "The small red-tracked rover sitting on concrete outdoor steps beside potted plants.",
        aspect: "portrait",
      },
    ],
    changelog: [
      {
        date: "2025-01",
        entry: "Prototype completed with basic mobility and sensor systems.",
        status: "verified",
      },
      {
        date: "2024-09",
        entry: "Team formed; X1 became its first build.",
        status: "verified",
      },
      {
        date: "—",
        entry:
          "No logged test protocol, trial count, or measurement set has been published for X1.",
        status: "needs-review",
      },
    ],
  },
];

export function getRobot(slug: string): Robot | undefined {
  return robots.find((r) => r.slug === slug);
}
