import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { PhotoPlate } from "@/components/plate";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Join the team",
  description:
    "URRT recruits across mechanical, electrical and software & autonomous disciplines at United International University.",
};

const disciplines = [
  {
    name: "Mechanical",
    detail:
      "Chassis and track design, flipper mechanisms, the manipulator, and the rigs the platform is tested on. CAD and fabrication experience helps; willingness to rebuild something three times matters more.",
  },
  {
    name: "Electrical",
    detail:
      "Power distribution, motor drives, sensor integration and wiring harnesses. This is the layer the team has published least about, so there is the most to write down.",
  },
  {
    name: "Software & Autonomous",
    detail:
      "Teleoperation, SLAM and mapping, perception, and the operator interface. The experiment records on this site exist because this work needs measuring, not just shipping.",
  },
];

export default function JoinPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Join the team" }]}
        title="The team is fifteen people. It can be more."
        lede={
          <p>
            URRT recruits students at United International University across three
            disciplines. There is no published selection process, so this page
            describes what the work involves rather than promising a route in.
          </p>
        }
      />

      <div className="shell section">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display-2">What the work actually is</h2>
            <ul className="mt-8 border-t border-steel">
              {disciplines.map((d, i) => (
                <li key={d.name} className="border-b border-steel py-6">
                  <div className="flex items-baseline gap-3">
                    <span className="meta tabular text-steel">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="title">{d.name}</h3>
                  </div>
                  <p className="body mt-2 max-w-[58ch] text-steel-deep">
                    {d.detail}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-l-2 border-lime-deep bg-paper-sunk p-5">
              <p className="body text-steel-deep">
                <strong className="font-semibold text-ink">
                  An honest caveat.
                </strong>{" "}
                This site exists partly because the previous one overstated what
                the team had done. Joining means writing things down: protocols,
                trial counts, and the results that did not work. If that sounds
                like the boring part, it is also the part that makes the rest
                credible.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <PhotoPlate
              src="/assets/events/team-workshop.jpg"
              alt="A group of people in a workshop with shelving, components and equipment behind them."
              width={2048}
              height={1166}
              sizes="(max-width: 1024px) 100vw, 38vw"
              caption={
                <>
                  <span className="block font-semibold text-ink">
                    Team members in the workshop
                  </span>
                  <span className="mt-0.5 block">
                    Undated. Individuals are not identified, because the source
                    does not identify them.
                  </span>
                </>
              }
            />

            <div className="mt-8">
              <h2 className="display-3">Register interest</h2>
              <p className="body mt-2 text-steel-deep">
                Tell us your discipline and what you have built. The message opens
                in your mail client.
              </p>
              <div className="mt-5">
                <ContactForm defaultSubject="Recruitment" compact />
              </div>
              <p className="meta mt-4 text-steel-deep">
                Or email{" "}
                <a href={`mailto:${site.email}`} className="link-prose">
                  {site.email}
                </a>{" "}
                directly.
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-16 flex flex-wrap gap-3 border-t border-steel pt-6">
          <Link href="/people" className="btn btn-secondary">
            Who is on the team
          </Link>
          <Link href="/collaborate" className="btn btn-secondary">
            Collaborate or sponsor
          </Link>
        </div>
      </div>
    </>
  );
}
