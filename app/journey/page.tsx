import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { PhotoPlate } from "@/components/plate";
import { timeline, excludedAchievements } from "@/content/timeline";
import { competition } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/journey" },
  title: "Journey",
  description:
    "A verified chronology of the UIU Rescue Rover Team, with future goals labelled as goals and achievements belonging to other teams excluded.",
};

export default function JourneyPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Journey" }]}
        title="Two years, told with the gaps left in."
        lede={
          <p>
            Dated events are listed with a status. A goal is not an achievement,
            and an achievement belonging to another team is not ours to list.
          </p>
        }
        meta={
          <div className="flex flex-wrap gap-3">
            <StatusChip status="verified" label="2 verified milestones" />
            <StatusChip status="needs-review" label="3 awaiting confirmation" />
            <StatusChip status="planned" label="1 target" />
          </div>
        }
      />

      <div className="shell section">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ol className="border-t border-steel">
              {timeline.map((e) => (
                <li key={e.title} className="border-b border-steel py-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <span className="meta tabular text-steel-deep">{e.date}</span>
                    <div className="flex items-center gap-2">
                      {e.kind === "goal" && (
                        <StatusChip status="planned" label="Target" />
                      )}
                      <StatusChip status={e.status} />
                    </div>
                  </div>
                  <h2 className="title mt-2">{e.title}</h2>
                  <p className="body mt-1 max-w-[62ch] text-steel-deep">
                    {e.detail}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-12 border-l-2 border-needs-review bg-paper-sunk p-6">
              <h2 className="display-3">Excluded from this record</h2>
              <p className="body mt-3 max-w-[62ch] text-steel-deep">
                The previous site listed four competition results under
                &ldquo;Our achievements&rdquo;. All four belong to the{" "}
                <strong className="font-semibold text-ink">
                  UIU Mars Rover Team (UMRT)
                </strong>{" "}
                — a different team, with different rovers (AXIOS and TELOS). They
                are not URRT results and are not shown as milestones here.
              </p>
              <ul className="mt-4 space-y-2">
                {excludedAchievements.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span aria-hidden="true" className="meta mt-1 text-steel-mid">
                      ×
                    </span>
                    <span className="meta text-steel-deep">{a}</span>
                  </li>
                ))}
              </ul>
              <p className="meta mt-4 text-steel-deep">
                Recorded as claim <code className="text-ink">comp-002</code> in{" "}
                <Link href="/content-status" className="link-prose">
                  the claim ledger
                </Link>
                .
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <PhotoPlate
              src="/assets/events/team-competition-rover.png"
              alt="A group standing on a stage with a wheeled rover in front of them, holding a Bangladesh flag and a UIU pennant."
              width={1388}
              height={858}
              sizes="(max-width: 1024px) 100vw, 38vw"
              caption={
                <>
                  <span className="plate-strong">
                    Team and rover at a competition venue
                  </span>
                  <span className="mt-0.5 block">
                    The source page does not name or date this event, so neither
                    does this caption.
                  </span>
                </>
              }
              note="Event, date and result unknown."
            />

            <div className="mt-8 border border-steel">
              <div className="border-b border-steel bg-paper-sunk px-4 py-3">
                <h2 className="ui font-semibold">On the competition target</h2>
              </div>
              <div className="px-4 py-4">
                <p className="body text-steel-deep">
                  RoboCup Rescue 2026 was listed as the team&apos;s target. The
                  event itself ran {competition.dates} at {competition.venue}, and
                  the league has closed its 2026 season. No entry list, result
                  sheet or announcement naming URRT has been published, so this
                  stays a target rather than a participation record.
                </p>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <dt className="meta text-steel-mid">Event</dt>
                  <dd className="meta text-steel-deep">{competition.eventStatus}</dd>
                  <dt className="meta text-steel-mid">URRT</dt>
                  <dd className="meta text-steel-deep">{competition.teamStatus}</dd>
                </dl>
                <p className="meta mt-3 text-steel-deep">
                  Owner: competition coordinator. Until a record is published,
                  this stays a target on every page.
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                  <a
                    href={competition.eventSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-prose meta inline-block"
                  >
                    RoboCup 2026 ↗
                  </a>
                  <a
                    href={competition.leagueSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-prose meta inline-block"
                  >
                    Rescue league ↗
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
