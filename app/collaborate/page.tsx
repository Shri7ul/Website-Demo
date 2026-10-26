import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/collaborate" },
  title: "Collaborate or sponsor",
  description:
    "Work with the UIU Rescue Rover Team: research collaboration, components, laboratory access and travel support for competition entry.",
};

const supporters = [
  { name: "United International University", logo: "/assets/brand/uiu-logo.png", role: "Academic home" },
  { name: "Center for Artificial Intelligence Research", logo: "/assets/brand/cair-logo.png", role: "Research facilities" },
  { name: "Dassault Systèmes", logo: "/assets/partners/dassault-systemes.png", role: "Published as R&D partner" },
  { name: "SOLIDWORKS", logo: "/assets/partners/solidworks.png", role: "Published as R&D partner" },
  { name: "Protospace", logo: "/assets/partners/protospace.png", role: "Published as R&D partner" },
  { name: "DFRobot", logo: "/assets/partners/dfrobot.png", role: "Published as R&D partner" },
];

const needs = [
  {
    title: "Components and spares",
    detail:
      "Motor drives, LiDAR units, depth cameras, batteries and track material. Consumables are the difference between one trial and a repeatable series.",
  },
  {
    title: "Machining and fabrication",
    detail:
      "Access to a mill, lathe or waterjet for chassis revisions. The team already builds test rigs; it needs the parts to survive more than one run.",
  },
  {
    title: "Travel to competition",
    detail:
      "Moving a team and a robot to an international league is the largest single cost in the plan. URRT named RoboCup Rescue 2026 as its target; that event has run, and the team has not published a participation record. Travel support is what makes the next attempt possible.",
  },
  {
    title: "Research collaboration",
    detail:
      "Supervision, dataset sharing or joint measurement of mobility and mapping performance. The team's experiment records are written to be fillable.",
  },
];

export default function CollaboratePage() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { href: "/", label: "Home" },
          { label: "Collaborate or sponsor" },
        ]}
        title="What the team actually needs."
        lede={
          <p>
            Not a tiered sponsorship deck. Four concrete needs, and the current
            supporters as the team publishes them.
          </p>
        }
      />

      <div className="shell section">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display-2">Four things that would change the work</h2>
            <ol className="mt-8 border-t border-steel">
              {needs.map((n, i) => (
                <li key={n.title} className="border-b border-steel py-6">
                  <div className="flex items-baseline gap-3">
                    <span className="meta tabular text-steel-mid">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="title">{n.title}</h3>
                  </div>
                  <p className="body mt-2 max-w-[58ch] text-steel-deep">
                    {n.detail}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 border border-dashed border-steel bg-paper-sunk p-5">
              <p className="body text-steel-deep">
                <strong className="font-semibold text-ink">No sponsor tiers.</strong>{" "}
                The previous site used the language of a fundraising campaign
                without published terms. This page states what is needed and lets
                you ask; it does not offer benefits it cannot guarantee.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <h2 className="display-3">Start a conversation</h2>
            <p className="body mt-2 text-steel-deep">
              Tell us what you can offer and we will route it to the right lead.
            </p>
            <div className="mt-5">
              <ContactForm defaultSubject="Sponsorship" compact />
            </div>
            <p className="meta mt-4 text-steel-deep">
              Or email{" "}
              <a href={`mailto:${site.email}`} className="link-prose">
                {site.email}
              </a>
              .
            </p>
          </aside>
        </div>

        <section className="mt-20" aria-labelledby="supporters-heading">
          <h2 id="supporters-heading" className="display-3">
            Supporters on record
          </h2>
          <p className="body mt-2 max-w-[64ch] text-steel-deep">
            Logos and relationship wording are as the team publishes them. Only
            marks the team itself has published are shown — no logo is added on
            the assumption of a relationship.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {supporters.map((s) => (
              <li key={s.name}>
                <div className="flex h-20 items-center justify-center border border-steel bg-paper p-3">
                  <Image
                    src={s.logo}
                    alt={`${s.name} logo`}
                    width={200}
                    height={80}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
                <p className="ui mt-2 leading-snug">{s.name}</p>
                <p className="meta text-steel-deep">{s.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 flex flex-wrap gap-3 border-t border-steel pt-6">
          <Link href="/join" className="btn btn-secondary">
            Join the team
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}
