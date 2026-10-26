import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PeopleGrid } from "@/components/people-grid";
import { PhotoPlate } from "@/components/plate";
import { members, advisors } from "@/content/team";

export const metadata: Metadata = {
  title: "People",
  description:
    "The 2026 URRT roster of 15 members across mechanical, electrical and software, plus the team's three advisors and director.",
};

export default function PeoplePage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "People" }]}
        title="Fifteen members, three advisors, one roster."
        lede={
          <p>
            Names, IDs and disciplines are transcribed from the team&apos;s roster
            page. It publishes discipline but not individual subsystem ownership,
            so this page does not invent job titles.
          </p>
        }
        meta={
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="meta text-steel-deep">Members</p>
              <p className="ui tabular">{members.length}</p>
            </div>
            <div>
              <p className="meta text-steel-deep">Advisors</p>
              <p className="ui tabular">{advisors.length}</p>
            </div>
            <div>
              <p className="meta text-steel-deep">Roster source</p>
              <p className="ui">rescuerover.uiu.ac.bd/member.html</p>
            </div>
          </div>
        }
      />

      <section className="shell section" aria-labelledby="roster-heading">
        <h2 id="roster-heading" className="display-2">
          Roster
        </h2>
        <p className="body-lg mt-4 max-w-[54ch] text-steel-deep">
          Filter by discipline. The count in each filter is derived from the
          roster, not asserted separately.
        </p>

        <div className="mt-8">
          <PeopleGrid members={members} />
        </div>
      </section>

      <section className="section bg-paper-sunk" aria-labelledby="advisors-heading">
        <div className="shell">
          <h2 id="advisors-heading" className="display-2">
            Advisors and director
          </h2>
          <p className="body-lg mt-4 max-w-[54ch] text-steel-deep">
            Roles and research interests as published on the team&apos;s advisors
            page.
          </p>

          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {advisors.map((a) => (
              <li key={a.name}>
                <div className="flex gap-4">
                  <PhotoPlate
                    src={a.photo}
                    alt={`Portrait photograph of ${a.name}.`}
                    width={240}
                    height={300}
                    sizes="120px"
                    className="w-[104px] shrink-0"
                    caption={<span className="sr-only">{a.name}</span>}
                  />
                  <div className="min-w-0">
                    <p className="meta text-lime-deep">{a.role}</p>
                    <h3 className="title mt-1 leading-tight">{a.name}</h3>
                    <p className="meta mt-1 text-steel-deep">
                      {a.title}, {a.affiliation}
                    </p>
                    <a
                      href={`mailto:${a.email}`}
                      className="meta mt-1 inline-block text-lime-deep underline underline-offset-4"
                    >
                      {a.email}
                    </a>
                  </div>
                </div>
                <div className="mt-3 border-t border-steel/50 pt-3">
                  <p className="meta text-steel-deep">Research interests</p>
                  <p className="meta mt-1 text-steel">
                    {a.interests.join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="shell section-tight">
        <div className="flex flex-wrap gap-3">
          <Link href="/join" className="btn btn-primary">
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
