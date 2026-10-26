import type { Advisor, Member } from "./types";

/**
 * Roster transcribed from rescuerover.uiu.ac.bd/member.html
 * (page states "2026 TEAM MEMBERS — ACTIVE MEMBERS — ROBOCUP RESCUE 2026",
 * "15 / 15 operatives"). Names, IDs and disciplines are as published.
 * No individual contribution is claimed, because none is published.
 */
export const members: Member[] = [
  {
    id: "URRT-001",
    name: "Dewan Rois Bin Omar",
    role: "Electrical Team",
    discipline: "Electrical",
    photo: "/assets/team/dewan-rois-bin-omar.jpg",
  },
  {
    id: "URRT-002",
    name: "Mahir Faisal Nafis",
    role: "Mechanical Team",
    discipline: "Mechanical",
    photo: "/assets/team/mahir-faisal-nafis.jpg",
  },
  {
    id: "URRT-003",
    name: "Ahmed Jebail Shoukhin",
    role: "Software & Autonomous",
    discipline: "Software & Autonomous",
    photo: "/assets/team/ahmed-jebail-shoukhin.jpg",
  },
  {
    id: "URRT-004",
    name: "Nazmul Hasan Athin",
    role: "Software & Autonomous",
    discipline: "Software & Autonomous",
    photo: "/assets/team/nazmul-hasan-athin.jpg",
  },
  {
    id: "URRT-005",
    name: "Md. Yeahyea Hassan Siddique",
    role: "Electrical Team",
    discipline: "Electrical",
    photo: "/assets/team/md-yeahyea-hassan-siddique.jpg",
  },
  {
    id: "URRT-006",
    name: "Mathin Ahmed",
    role: "Software & Autonomous",
    discipline: "Software & Autonomous",
    photo: "/assets/team/mathin-ahmed.jpg",
  },
  {
    id: "URRT-007",
    name: "Nurer Raihan Salmaan",
    role: "Software & Autonomous",
    discipline: "Software & Autonomous",
    photo: "/assets/team/nurer-raihan-salmaan.jpg",
  },
  {
    id: "URRT-008",
    name: "Adipta Shaha",
    role: "Mechanical Team",
    discipline: "Mechanical",
    photo: "/assets/team/adipta-shaha.jpg",
  },
  {
    id: "URRT-009",
    name: "Nazmul Hasan Nayem",
    role: "Mechanical Team",
    discipline: "Mechanical",
    photo: "/assets/team/nazmul-hasan-nayem.jpg",
  },
  {
    id: "URRT-010",
    name: "Jannatul Haque Usha",
    role: "Electrical Team",
    discipline: "Electrical",
    photo: "/assets/team/jannatul-haque-usha.jpg",
  },
  {
    id: "URRT-011",
    name: "Tanjila Akter Simi",
    role: "Software & Autonomous",
    discipline: "Software & Autonomous",
    photo: "/assets/team/tanjila-akter-simi.jpg",
  },
  {
    id: "URRT-012",
    name: "Dayad Muhammad Illin",
    role: "Mechanical Team",
    discipline: "Mechanical",
    photo: "/assets/team/dayad-muhammad-illin.jpg",
  },
  {
    id: "URRT-013",
    name: "Iftiaque Ahmed Auporba",
    role: "Mechanical Team",
    discipline: "Mechanical",
    photo: "/assets/team/iftiaque-ahmed-auporba.jpg",
  },
  {
    id: "URRT-014",
    name: "Saad Ahmmed Tonmoy",
    role: "Mechanical Team",
    discipline: "Mechanical",
    photo: "/assets/team/saad-ahmmed-tonmoy.jpg",
  },
  {
    id: "URRT-015",
    name: "Sokanto Roy",
    role: "Software & Autonomous",
    discipline: "Software & Autonomous",
    photo: "/assets/team/sokanto-roy.jpg",
  },
];

/** Transcribed from rescuerover.uiu.ac.bd/Advisors.html */
export const advisors: Advisor[] = [
  {
    name: "Prof Dr. Md. Abul Kashem Mia",
    title: "Vice-Chancellor",
    affiliation: "United International University",
    role: "Team Chief-Advisor",
    email: "kashem@uiu.ac.bd",
    interests: [
      "Algorithm theory",
      "Graph theory and algorithms",
      "Computational complexity",
      "Bioinformatics",
    ],
    photo: "/assets/advisors/abul-kashem-mia.jpg",
  },
  {
    name: "Prof Dr. Hasan Sarwar",
    title: "Professor",
    affiliation: "United International University",
    role: "Team Advisor",
    email: "sarwar@cse.uiu.ac.bd",
    interests: [
      "Software engineering",
      "Health engineering",
      "Education data mining",
      "Bangla OCR",
      "Nanomaterial development",
      "Blockchain",
    ],
    photo: "/assets/advisors/hasan-sarwar.jpg",
  },
  {
    name: "Md. Abid Hossain",
    title: "Lecturer",
    affiliation: "United International University",
    role: "Director",
    email: "abid@cse.uiu.ac.bd",
    interests: [
      "Robotics and electrical systems",
      "Drones",
      "Design and manufacturing",
      "Electrical engineering",
      "Machine learning",
    ],
    photo: "/assets/advisors/abid-hossain.jpg",
  },
];

export const disciplines = [
  "All",
  "Mechanical",
  "Electrical",
  "Software & Autonomous",
] as const;

export function countByDiscipline(d: string) {
  return d === "All"
    ? members.length
    : members.filter((m) => m.discipline === d).length;
}
