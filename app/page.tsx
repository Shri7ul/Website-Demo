import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MissionSection } from "@/components/mission-section";
import { ChallengeList } from "@/components/challenge-list";
import { PrototypeTimeline, type Stage } from "@/components/prototype-timeline";
import { TradeoffTabs } from "@/components/tradeoff-tabs";
import { RoverExplorer } from "@/components/rover-explorer";
import { EvidenceList } from "@/components/evidence-list";
import { PeopleGrid } from "@/components/people-grid";
import { StatusChip } from "@/components/status-chip";
import { PhotoPlate, FigurePlate } from "@/components/plate";
import { robots } from "@/content/robots";
import { members } from "@/content/team";
import { experiments } from "@/content/experiments";
import { timeline } from "@/content/timeline";
import { site } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "When humans cannot enter, robots go first",
  description: site.description,
};

const stages: Stage[] = [
  {
    label: "Prototype 01",
    date: "Autumn 2024",
    title: "A first chassis",
    body: "The team's first build was a four-wheel-drive rover with red treaded wheels and a white body shell. It carried a camera, ultrasonic rangefinders and a basic end-effector.",
    image: "/assets/robots/zugbee-x1/zugbee-x1-grass.jpg",
    alt: "Close view of a small rover with red treaded wheels and a white body shell on tall grass.",
    caption:
      "Zugbee X1 on grass, rear three-quarter. The photograph is undated on the team's project page.",
    status: "verified",
  },
  {
    label: "Prototype 01",
    date: "Winter 2024–25",
    title: "Taken outside",
    body: "The platform was driven on campus grass, paving and outdoor concrete steps. These photographs are the only mobility evidence the team has published — no instrumented trial accompanied them.",
    image: "/assets/robots/zugbee-x1/zugbee-x1-steps.jpg",
    alt: "The small red-tracked rover sitting on concrete outdoor steps beside potted plants.",
    caption:
      "Zugbee X1 on outdoor steps. Whether it climbed the flight is not documented.",
    status: "needs-review",
  },
  {
    label: "Prototype 01",
    date: "January 2025",
    title: "Zugbee X1 completed",
    body: "The first rescue rover was signed off with basic mobility and sensor systems. Its mechanical constraints and software architecture became the specification AEGIS was designed against.",
    image: "/assets/robots/zugbee-x1/zugbee-x1-campus.jpg",
    alt: "A small red-tracked white-bodied rover on a grass lawn, with a gold-domed mosque and minaret behind.",
    caption:
      "Zugbee X1 on the campus lawn, with the university mosque behind. Completed January 2025.",
    status: "verified",
  },
];

const tradeoffs = [
  {
    key: "locomotion",
    name: "Locomotion",
    from: "4-wheel drive on fixed axles.",
    to: "Continuous rubber tracks with articulated front and rear flippers.",
    why: "Wheels stall on step edges and rubble voids. Tracks distribute load across an irregular surface, and flippers let the platform lever itself over a lip rather than climb it.",
    cost: "More mechanical complexity, more mass low in the chassis, and a track that can be thrown. Serviceability drops.",
  },
  {
    key: "perception",
    name: "Perception",
    from: "Camera plus ultrasonic rangefinders.",
    to: "LiDAR, RGB-D depth cameras and an IMU in one stack.",
    why: "Ultrasonic gives sparse range and no scene structure. A LiDAR and depth pair can produce a dense map for SLAM, which is what a mapping claim would require.",
    cost: "Power draw, calibration effort, and data volume. Nothing is claimed until drift is characterised (EXP-004).",
  },
  {
    key: "manipulation",
    name: "Manipulation",
    from: "A basic end-effector.",
    to: "A 6-DOF articulated arm.",
    why: "A fixed effector can only push. Opening a door, moving a obstruction, or passing a item to a casualty needs articulation in six axes.",
    cost: "Every extra axis is another motor, encoder, gearbox and failure mode, and it moves the centre of mass upward.",
  },
];

export default function HomePage() {
  const aegis = robots[0];

  return (
    <>
      {/* ═══════════════ 01 · THE MISSION ═══════════════ */}
      <section className="on-ink relative bg-ink text-paper">
        <div className="shell pb-10 pt-12 md:pb-14 md:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-6">
              <h1 className="display-1 text-paper">
                When humans cannot enter, robots go first.
              </h1>

              <p className="body-lg mt-6 max-w-[46ch] text-steel-light">
                Designing and testing robotic systems for challenging
                search-and-rescue environments.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/robots" className="btn btn-primary">
                  Explore our robots
                </Link>
                <Link href="/experiments" className="btn btn-secondary">
                  See our experiments
                </Link>
              </div>

              <p className="meta mt-7 max-w-[54ch] text-steel-light">
                A positioning statement, not a claim of operational deployment.
                URRT is a student team at United International University, Dhaka.
              </p>
            </div>

            <div className="lg:col-span-6">
              <PhotoPlate
                src="/assets/robots/aegis/aegis-workshop-front.jpg"
                alt="A tracked rescue rover with orange track treads and a raised articulated robotic arm, on a workshop floor beside a timber obstacle rig."
                width={1600}
                height={1204}
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                caption={
                  <>
                    <span className="plate-strong">
                      AEGIS, prototype 02
                    </span>
                    <span className="mt-0.5 block">
                      Tracked chassis, orange treads, 6-DOF arm. Workshop,
                      undated. Photograph published by the team.
                    </span>
                  </>
                }
                note="Not a render. Not a stock image. Not the Mars rover."
              />
            </div>
          </div>

          {/* rail closing the fold */}
          <nav
            aria-label="Start here"
            className="mt-10 grid grid-cols-1 border-t border-steel sm:grid-cols-3"
          >
            {[
              { href: "/engineering", n: "01", label: "Engineering" },
              { href: "/experiments", n: "02", label: "Evidence" },
              { href: "/people", n: "03", label: "The team" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex items-center justify-between border-b border-steel py-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              >
                <span className="ui text-paper">
                  <span className="meta mr-2 text-steel-light">{l.n}</span>
                  {l.label}
                </span>
                <span
                  aria-hidden="true"
                  className="text-lime transition-transform duration-150 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* ═══════════════ 02 · THE HUMAN PROBLEM ═══════════════ */}
      <section className="section" aria-labelledby="problem-heading">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 id="problem-heading" className="display-2">
                The space a rescue robot has to work in is not a corridor.
              </h2>
              <p className="body-lg mt-5 max-w-[46ch] text-steel-deep">
                Four constraints decide whether a machine is useful in a
                collapse. Each one shapes a decision in the engineering, and each
                one is a reason the platform looks the way it does.
              </p>
            </div>

            <div className="lg:col-span-7">
              <FigurePlate
                caption={
                  <>
                    <span className="plate-strong">
                      Section through a collapsed floor
                    </span>
                    <span className="mt-0.5 block">
                      Cut material hatched at 45°, voids left open, smoke as
                      horizontal dashed haze. The route is the only accent.
                    </span>
                  </>
                }
                note="Drawing by the site, from the physical description of the problem. Not a survey of a real building. Not to scale."
                aspect="aspect-[8/5]"
              >
                <MissionSection className="h-full w-full" />
              </FigurePlate>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="title">Open a constraint</p>
              <p className="body mt-2 text-steel-deep">
                Each expands to the engineering consequence it forces.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ChallengeList />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 03 · THE FIRST PROTOTYPE ═══════════════ */}
      <section className="section bg-paper-sunk" aria-labelledby="prototype-heading">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="prototype-heading" className="display-2">
                Zugbee X1 was built to find out what the team did not know.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <p className="body-lg text-steel-deep">
                A first prototype is a question, not a product. These three
                photographs are the documented record of the build — and where the
                record stops, the caption says so.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <PrototypeTimeline stages={stages} />
          </div>
        </div>
      </section>

      {/* ═══════════════ 04 · THE EVOLUTION ═══════════════ */}
      <section className="section" aria-labelledby="evolution-heading">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 id="evolution-heading" className="display-2">
                Three parts changed between V1 and V2.
              </h2>
              <p className="body-lg mt-5 max-w-[44ch] text-steel-deep">
                Each change answers a constraint from the section above, and each
                one costs something. Select a subsystem.
              </p>

              <div className="mt-8">
                <TradeoffTabs tradeoffs={tradeoffs} />
              </div>
            </div>

            <div className="lg:col-span-7">
              <PhotoPlate
                src="/assets/robots/aegis/aegis-obstacle-side.jpg"
                alt="The tracked rover seen from the side on a timber obstacle, tracks angled across a step edge and arm folded forward."
                width={1599}
                height={899}
                sizes="(max-width: 1024px) 100vw, 55vw"
                caption={
                  <>
                    <span className="plate-strong">
                      AEGIS on the timber obstacle rig
                    </span>
                    <span className="mt-0.5 block">
                      Flippers and arm articulated across a step edge. Workshop
                      rig, not a field trial.
                    </span>
                  </>
                }
                note="Photographed, not measured. See EXP-003."
              />

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-steel pt-4 sm:grid-cols-3">
                {[
                  ["Platform", "Tracked UGV"],
                  ["Locomotion", "Tracks + flippers"],
                  ["Manipulator", "6-DOF arm"],
                  ["Sensors", "LiDAR, depth, IMU"],
                  ["Design", "Modular"],
                  ["Status", "In development"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="meta text-steel-deep">{k}</dt>
                    <dd className="ui mt-0.5 text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 05 · INSIDE THE MACHINE ═══════════════ */}
      <section className="section bg-paper-sunk" aria-labelledby="machine-heading">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="machine-heading" className="display-2">
                Three subsystems are documented. Three are not.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <p className="body-lg text-steel-deep">
                AEGIS is described publicly in terms of locomotion, perception and
                manipulation. Power, communications and control are named nowhere,
                so they are shown as undocumented rather than filled in.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <RoverExplorer
              robotName={aegis.name}
              modelLabel="Conceptual assembly"
              subsystems={aegis.subsystems}
            />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                layer: "Power",
                note: "Battery chemistry, capacity, runtime and distribution are not published. Request from the electrical lead.",
              },
              {
                layer: "Communications",
                note: "Radio band, link budget and teleoperation range are not published. Request from the software lead.",
              },
              {
                layer: "Control & autonomy",
                note: "Named as a design intent. No architecture document or demonstration is published. Tracked as EXP-004.",
              },
            ].map((l) => (
              <div
                key={l.layer}
                className="border border-dashed border-steel bg-paper p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="ui font-semibold">{l.layer}</p>
                  <StatusChip status="unsupported" label="Undocumented" />
                </div>
                <p className="meta mt-2 text-steel-deep">{l.note}</p>
              </div>
            ))}
          </div>

          <p className="meta mt-8 max-w-[70ch] text-steel-deep">
            The 3D assembly above is a schematic built from primitives, not the
            physical rover. No authentic model of AEGIS has been published. Drop a
            GLB at <code className="text-ink">/models/aegis.glb</code> and set{" "}
            <code className="text-ink">NEXT_PUBLIC_ROVER_GLB</code> to replace it.
          </p>
        </div>
      </section>

      {/* ═══════════════ 06 · BUILT / TESTED / MEASURED ═══════════════ */}
      <section className="on-ink section bg-ink text-paper" aria-labelledby="evidence-heading">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="evidence-heading" className="display-2 text-paper">
                Four experiments are registered. None has a published number.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <p className="body-lg text-steel-light">
                A record exists for each question the team has asked of its
                hardware. Where a measurement does not exist, the record says what
                is missing and who owns it — it does not draw a chart.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <EvidenceList experiments={experiments} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/experiments" className="btn btn-primary">
              Open the experiment index
            </Link>
            <Link href="/content-status" className="btn btn-tertiary meta text-paper">
              See what is verified and what is not
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ 07 · THE PEOPLE ═══════════════ */}
      <section className="section" aria-labelledby="people-heading">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="people-heading" className="display-2">
                Fifteen people, three disciplines, one roster.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <p className="body-lg text-steel-deep">
                The roster is published with names, IDs and disciplines. It does
                not say who owns which subsystem, so this page does not either.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <PeopleGrid members={members} />
          </div>

          <div className="mt-10">
            <Link href="/people" className="btn btn-secondary">
              Advisors and full roster
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ 08 · THE JOURNEY ═══════════════ */}
      <section className="section bg-paper-sunk" aria-labelledby="journey-heading">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="journey-heading" className="display-2">
                A short record, kept honestly.
              </h2>
              <p className="body-lg mt-5 max-w-[42ch] text-steel-deep">
                Two years, one completed prototype, one in development, and a
                competition target. Future goals are labelled as goals.
              </p>
              <Link href="/journey" className="btn btn-secondary mt-8">
                Read the full journey
              </Link>
            </div>

            <div className="lg:col-span-7">
              <ol className="border-t border-steel">
                {timeline.map((e) => (
                  <li key={e.title} className="border-b border-steel py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="meta tabular text-steel-deep">{e.date}</span>
                      <StatusChip status={e.status} />
                    </div>
                    <h3 className="title mt-2">{e.title}</h3>
                    <p className="body mt-1 max-w-prose text-steel-deep">
                      {e.detail}
                    </p>
                  </li>
                ))}
              </ol>

              <p className="meta mt-6 max-w-[70ch] text-steel-deep">
                Achievements belonging to the UIU Mars Rover Team are not listed
                here. They are a different team with different rovers, and the
                previous site presented them as URRT&apos;s. See{" "}
                <Link href="/journey" className="link-prose">
                  the journey page
                </Link>{" "}
                for the exclusion record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 09 · JOIN THE WORK ═══════════════ */}
      <section className="on-ink section bg-ink text-paper" aria-labelledby="join-heading">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="join-heading" className="display-2 text-paper">
                The next useful thing is usually a person.
              </h2>
              <p className="body-lg mt-5 max-w-[48ch] text-steel-light">
                URRT recruits across mechanical, electrical and software. The team
                also needs laboratory access, components and travel support to
                compete at league level.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/join" className="btn btn-primary">
                  Join the team
                </Link>
                <Link href="/collaborate" className="btn btn-secondary">
                  Collaborate or sponsor
                </Link>
              </div>

              <p className="meta mt-6 text-steel-light">
                <a
                  href={`mailto:${site.email}`}
                  className="text-paper underline decoration-steel underline-offset-4 hover:decoration-lime"
                >
                  {site.email}
                </a>{" "}
                · {site.phone}
              </p>
            </div>

            <div className="lg:col-span-5">
              <Image
                src="/assets/events/team-workshop.jpg"
                alt="A group of people in a workshop with shelving, components and equipment behind them."
                width={2048}
                height={1166}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="w-full border border-steel"
              />
              <p className="meta mt-2 text-steel-light">
                Team members in the workshop. Photograph published by the team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
