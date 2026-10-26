import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { robots } from "@/content/robots";
import { experiments } from "@/content/experiments";

export const metadata: Metadata = {
  alternates: { canonical: "/engineering" },
  title: "Engineering",
  description:
    "AEGIS subsystem breakdown and the design decisions behind it, with the layers the team has not published marked as undocumented.",
};

const layers = [
  {
    n: "01",
    name: "Mechanical / locomotion",
    documented: true,
    body: "Continuous rubber tracks with articulated front and rear flippers. The flippers lever the platform over a lip instead of relying on wheel traction.",
    evidence: "Specification table and three photographs of the physical platform.",
  },
  {
    n: "02",
    name: "Manipulation",
    documented: true,
    body: "A 6-DOF articulated arm with a parallel jaw gripper, for interacting with casualties, doors, debris and equipment.",
    evidence: "Specification table and subsystem description. No reach envelope published.",
  },
  {
    n: "03",
    name: "Perception",
    documented: true,
    body: "LiDAR, RGB-D depth cameras and an IMU in one stack, intended to feed SLAM-based mapping and victim detection.",
    evidence: "Specification table and subsystem description. No accuracy figure published.",
  },
  {
    n: "04",
    name: "Power",
    documented: false,
    body: "Battery chemistry, capacity, runtime, distribution and thermal management.",
    evidence: "Not published anywhere on the team's site.",
  },
  {
    n: "05",
    name: "Communications",
    documented: false,
    body: "Radio band, link budget, teleoperation range, and behaviour on link loss.",
    evidence: "Not published anywhere on the team's site.",
  },
  {
    n: "06",
    name: "Control & autonomy",
    documented: false,
    body: "Control architecture, state estimation, autonomy stack and the operator interface.",
    evidence: "Named as a design intent only. Tracked as EXP-004 (planned).",
  },
];

function StackFigure() {
  const rowH = 56;
  const top = 24;
  const height = top * 2 + layers.length * rowH + 28;

  return (
    <svg
      viewBox={`0 0 760 ${height}`}
      role="img"
      aria-labelledby="stack-title stack-desc"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="stack-title">AEGIS subsystem stack</title>
      <desc id="stack-desc">
        Six layers stacked from mechanical at the bottom to control at the top.
        The bottom three are documented with a solid outline; the top three are
        undocumented and drawn with a dashed outline.
      </desc>

      <rect width="760" height={height} fill="var(--color-paper)" />

      <text
        x="24"
        y="18"
        fill="var(--color-steel-deep)"
        fontFamily="var(--font-archivo)"
        fontSize="11.5"
        letterSpacing="0.06em"
      >
        AEGIS · SUBSYSTEM STACK
      </text>

      {[...layers].reverse().map((l, i) => {
        const y = top + i * rowH;
        return (
          <g key={l.n}>
            <rect
              x="24"
              y={y}
              width="712"
              height={rowH - 10}
              fill={l.documented ? "var(--color-paper-sunk)" : "none"}
              stroke={l.documented ? "var(--color-ink)" : "var(--color-steel)"}
              strokeWidth="1.3"
              strokeDasharray={l.documented ? undefined : "5 4"}
            />
            <text
              x="40"
              y={y + 27}
              fill="var(--color-steel)"
              fontFamily="var(--font-archivo)"
              fontSize="11"
            >
              {l.n}
            </text>
            <text
              x="76"
              y={y + 27}
              fill={l.documented ? "var(--color-ink)" : "var(--color-steel-deep)"}
              fontFamily="var(--font-archivo)"
              fontSize="14"
              fontWeight="600"
            >
              {l.name}
            </text>
            <text
              x="720"
              y={y + 27}
              textAnchor="end"
              fill={l.documented ? "var(--color-verified)" : "var(--color-unverified)"}
              fontFamily="var(--font-archivo)"
              fontSize="11"
            >
              {l.documented ? "DOCUMENTED" : "NOT PUBLISHED"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function EngineeringPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Engineering" }]}
        title="What is designed, what is decided, and what is not written down."
        lede={
          <p>
            AEGIS is publicly described in three subsystems. The other three
            layers of any rescue platform — power, communications and control —
            are not described anywhere, so they are drawn as gaps rather than
            filled with plausible detail.
          </p>
        }
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip status="verified" label="3 documented" />
            <StatusChip status="unsupported" label="3 not published" />
          </div>
        }
      />

      <div className="shell section">
        <figure className="plate">
          <div className="plate-media">
            <StackFigure />
          </div>
          <figcaption className="plate-caption">
            <span className="plate-strong">
              Figure 1 — subsystem stack
            </span>
            <span className="mt-0.5 block">
              Solid outline: described by the team. Dashed outline: named nowhere
              in public material. Order is logical, not a claim about
              implementation.
            </span>
          </figcaption>
        </figure>

        <ol className="mt-14 border-t border-steel">
          {layers.map((l) => (
            <li key={l.n} className="border-b border-steel py-8">
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-1">
                  <span className="meta tabular text-steel-mid">{l.n}</span>
                </div>
                <div className="lg:col-span-4">
                  <h2 className="display-3">{l.name}</h2>
                  <div className="mt-2">
                    <StatusChip
                      status={l.documented ? "verified" : "unsupported"}
                      label={l.documented ? "Documented" : "Not published"}
                    />
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <p className="body-lg text-steel-deep">{l.body}</p>
                </div>
                <div className="lg:col-span-3">
                  <p className="meta text-steel-deep">Evidence</p>
                  <p className="meta mt-1 text-steel-mid">{l.evidence}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="display-2">Design decisions on record</h2>
            <p className="body-lg mt-4 max-w-[52ch] text-steel-deep">
              Two decisions are documented well enough to state: the move from
              wheels to tracks, and the move from a fixed effector to an
              articulated arm.
            </p>
            <Link href="/robots/aegis" className="btn btn-secondary mt-6">
              AEGIS full record
            </Link>
          </div>

          <div className="lg:col-span-6">
            <ul className="border-t border-steel">
              {[
                {
                  t: "Wheels → tracks with flippers",
                  d: "Wheels stall on step edges; tracks distribute load across an irregular surface and flippers lever the platform over a lip.",
                },
                {
                  t: "Fixed effector → 6-DOF arm",
                  d: "A fixed effector can push but cannot grasp. Six axes allow door handles, debris and equipment to be operated.",
                },
                {
                  t: "Single sensor → multi-sensor stack",
                  d: "Camera and ultrasonic give sparse range with no scene structure. LiDAR and depth can produce a dense map — if drift is characterised.",
                },
              ].map((d) => (
                <li key={d.t} className="border-b border-steel py-4">
                  <p className="ui font-semibold">{d.t}</p>
                  <p className="body mt-1 text-steel-deep">{d.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border border-dashed border-steel bg-paper-sunk p-6 md:p-8">
          <h2 className="display-3">Open engineering gaps</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "No mass, runtime or payload figures for either platform.",
              "No control architecture or state-estimation description.",
              "No radio specification or link-loss behaviour.",
              "No authentic CAD or 3D model released.",
              `No measurement published for any of the ${experiments.length} registered experiments.`,
              "No build log with dated revisions.",
            ].map((g) => (
              <li key={g} className="flex gap-3">
                <span aria-hidden="true" className="meta mt-1 text-steel-mid">
                  —
                </span>
                <span className="body text-steel-deep">{g}</span>
              </li>
            ))}
          </ul>
          <p className="meta mt-6 text-steel-deep">
            Platforms referenced:{" "}
            {robots.map((r, i) => (
              <span key={r.slug}>
                {i > 0 && ", "}
                <Link href={`/robots/${r.slug}`} className="link-prose">
                  {r.name}
                </Link>
              </span>
            ))}
            .
          </p>
        </div>
      </div>
    </>
  );
}
