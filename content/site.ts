export const site = {
  name: "UIU Rescue Rover Team",
  shortName: "URRT",
  tagline: "Rescue robotics from United International University, Dhaka.",
  description:
    "The UIU Rescue Rover Team designs and tests tracked and wheeled robots for urban search and rescue, and is preparing an entry for RoboCup Rescue 2026.",
  university: "United International University",
  lab: "Center for Artificial Intelligence Research (CAIR)",
  email: "rescuerover@cair.uiu.ac.bd",
  phone: "+880 1909356346",
  phoneNote: "Mon–Fri, 9AM–5PM",
  address: {
    lines: ["United City, Madani Avenue", "Badda, Dhaka 1212", "Bangladesh"],
    campusHours: "Sunday–Thursday, 8:00 AM – 8:00 PM",
    labNote: "CAIR Lab: 4th Floor, Academic Building",
    mapsUrl: "https://maps.app.goo.gl/CwgAxRgJQgHv7Vjq8",
  },
  social: {
    facebook: "https://www.facebook.com/share/1FaSe57Vd5/",
    instagram: "https://www.instagram.com/uiurescuerover",
  },
  lastUpdated: "2026-10-26",
  lastUpdatedLabel: "26 October 2026",
} as const;

export type NavItem = {
  href: string;
  label: string;
  /** short label for the fold rail */
  rail?: string;
};

export const nav: NavItem[] = [
  { href: "/robots", label: "Robots", rail: "01 Engineering" },
  { href: "/experiments", label: "Experiments", rail: "02 Evidence" },
  { href: "/people", label: "People", rail: "03 The team" },
  { href: "/research", label: "Research" },
  { href: "/engineering", label: "Engineering" },
  { href: "/journey", label: "Journey" },
  { href: "/resources", label: "Resources" },
];

export const footerNav: { heading: string; links: NavItem[] }[] = [
  {
    heading: "The project",
    links: [
      { href: "/robots", label: "Robots" },
      { href: "/engineering", label: "Engineering" },
      { href: "/experiments", label: "Experiments" },
      { href: "/research", label: "Research" },
    ],
  },
  {
    heading: "The team",
    links: [
      { href: "/people", label: "People" },
      { href: "/journey", label: "Journey" },
      { href: "/resources", label: "Resources" },
      { href: "/content-status", label: "Content status" },
    ],
  },
  {
    heading: "Work with us",
    links: [
      { href: "/join", label: "Join the team" },
      { href: "/collaborate", label: "Collaborate or sponsor" },
      { href: "/contact", label: "Contact" },
    ],
  },
];
