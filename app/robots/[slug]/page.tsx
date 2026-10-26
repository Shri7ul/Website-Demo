import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { PhotoPlate, AbsentPlate } from "@/components/plate";
import { RoverExplorer } from "@/components/rover-explorer";
import { robots, getRobot } from "@/content/robots";

export function generateStaticParams() {
  return robots.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const robot = getRobot(slug);
  if (!robot) return { title: "Robot not found" };
  return {
    title: robot.name,
    description: robot.summary,
    alternates: { canonical: `/robots/${robot.slug}` },
    openGraph: {
      title: robot.name,
      description: robot.summary,
      url: `/robots/${robot.slug}`,
    },
  };
}

export default async function RobotPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const robot = getRobot(slug);
  if (!robot) notFound();

  const dims: Record<string, { w: number; h: number }> = {
    "/assets/robots/aegis/aegis-workshop-front.jpg": { w: 1600, h: 1204 },
    "/assets/robots/aegis/aegis-obstacle-rear.jpg": { w: 1599, h: 899 },
    "/assets/robots/aegis/aegis-obstacle-side.jpg": { w: 1599, h: 899 },
    "/assets/robots/zugbee-x1/zugbee-x1-campus.jpg": { w: 1600, h: 900 },
    "/assets/robots/zugbee-x1/zugbee-x1-grass.jpg": { w: 900, h: 1600 },
    "/assets/robots/zugbee-x1/zugbee-x1-steps.jpg": { w: 900, h: 1600 },
    "/assets/robots/zugbee-x1/zugbee-x1-detail.jpg": { w: 900, h: 1600 },
  };

  return (
    <>
      <PageHeader
        breadcrumb={[
          { href: "/", label: "Home" },
          { href: "/robots", label: "Robots" },
          { label: robot.name },
        ]}
        title={robot.name}
        lede={<p>{robot.intro}</p>}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip
              status={robot.status === "completed" ? "verified" : "needs-review"}
              label={robot.statusLabel}
            />
            <span className="meta text-steel-deep">{robot.designation}</span>
            <span className="meta text-steel-mid">{robot.version}</span>
          </div>
        }
      />

      {/* gallery */}
      <section className="shell section-tight" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="title">
          Gallery
        </h2>
        <p className="meta mt-1 max-w-[70ch] text-steel-deep">
          Every photograph is from the team&apos;s own project page. Captions
          describe only what is visible; they do not assert an outcome.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {robot.gallery.map((g, i) => {
            const d = dims[g.src] ?? { w: 1600, h: 900 };
            return (
              <PhotoPlate
                key={g.src}
                src={g.src}
                alt={g.alt}
                width={d.w}
                height={d.h}
                sizes="(max-width: 768px) 100vw, 32vw"
                className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
                caption={
                  <>
                    <span className="plate-strong">
                      Plate {i + 1}
                    </span>
                    <span className="mt-0.5 block">{g.caption}</span>
                  </>
                }
              />
            );
          })}
        </div>
      </section>

      {/* architecture / 3D */}
      <section
        className="section bg-paper-sunk"
        aria-labelledby="architecture-heading"
      >
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="architecture-heading" className="display-2">
                Architecture
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-2">
              <p className="body-lg text-steel-deep">
                Select a subsystem to read what the team publishes about it. The
                assembly is a schematic — no authentic model has been released.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <RoverExplorer
              robotName={robot.name}
              modelLabel="Conceptual assembly"
              subsystems={robot.subsystems}
            />
          </div>

          <p className="meta mt-6 max-w-[72ch] text-steel-deep">
            The assembly is generated from primitives and is not the physical
            platform. It exists to give the subsystem descriptions a spatial
            anchor. No dimension on it should be read as a measurement.
          </p>
        </div>
      </section>

      {/* specs */}
      <section className="shell section" aria-labelledby="specs-heading">
        <h2 id="specs-heading" className="display-2">
          Specifications
        </h2>
        <p className="body-lg mt-4 max-w-[52ch] text-steel-deep">
          A row that reads &ldquo;Not yet documented&rdquo; means exactly that.
          The owner is named so the gap can be closed.
        </p>

        <div className="mt-8 overflow-x-auto border border-steel">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              {robot.name} specification table
            </caption>
            <thead>
              <tr className="bg-paper-sunk">
                <th scope="col" className="meta px-4 py-3 text-steel-deep">
                  Parameter
                </th>
                <th scope="col" className="meta px-4 py-3 text-steel-deep">
                  Value
                </th>
                <th scope="col" className="meta px-4 py-3 text-steel-deep">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {robot.specs.map((s) => (
                <tr key={s.label} className="border-t border-steel/50">
                  <th
                    scope="row"
                    className="ui px-4 py-3 align-top font-medium text-ink"
                  >
                    {s.label}
                  </th>
                  <td
                    className={`ui tabular px-4 py-3 align-top ${
                      s.value === "Not yet documented" ? "text-steel-mid" : "text-ink"
                    }`}
                  >
                    {s.value === "Not yet documented" ? "—" : s.value}
                  </td>
                  <td className="meta px-4 py-3 align-top text-steel-deep">
                    {s.note ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="meta mt-3 text-steel-mid">
          Source: rescuerover.uiu.ac.bd/projects.html. Transcribed 26 October
          2026.
        </p>
      </section>

      {/* constraints + changelog */}
      <section className="section bg-paper-sunk" aria-labelledby="constraints-heading">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="constraints-heading" className="display-3">
              Constraints and open questions
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                "Mass, runtime and payload are unpublished, so endurance cannot be assessed.",
                "No instrumented trial exists, so no success rate can be quoted.",
                "Autonomy is a stated design intent; no demonstration is published.",
                "No authentic 3D model or CAD export has been released.",
              ].map((c) => (
                <li key={c} className="flex gap-3 border-b border-steel/50 pb-3">
                  <span aria-hidden="true" className="meta mt-1 text-steel-mid">
                    —
                  </span>
                  <span className="body text-steel-deep">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <h2 className="display-3">Changelog</h2>
            <ol className="mt-6 border-t border-steel">
              {robot.changelog.map((c, i) => (
                <li key={i} className="border-b border-steel py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="meta tabular text-steel-deep">{c.date}</span>
                    <StatusChip status={c.status} />
                  </div>
                  <p className="body mt-2 text-steel-deep">{c.entry}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="shell mt-12">
          <AbsentPlate
            title="Build log"
            body="No dated build log has been published for this platform. If you maintain the build records, they can be added here as a versioned table."
            caption={
              <>
                <span className="plate-strong">
                  Build log — absent
                </span>
                <span className="mt-0.5 block">
                  Owner: mechanical lead · requested 26 October 2026
                </span>
              </>
            }
          />
        </div>
      </section>

      <div className="shell section-tight">
        <div className="flex flex-wrap gap-3">
          <Link href="/robots" className="btn btn-secondary">
            All robots
          </Link>
          <Link href="/engineering" className="btn btn-secondary">
            Engineering detail
          </Link>
          <Link href="/experiments" className="btn btn-primary">
            Experiments on this platform
          </Link>
        </div>
      </div>
    </>
  );
}
