import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { PhotoPlate } from "@/components/plate";
import { robots } from "@/content/robots";

export const metadata: Metadata = {
  alternates: { canonical: "/robots" },
  title: "Robots",
  description:
    "Two rescue rover prototypes from the UIU Rescue Rover Team: Zugbee X1 (completed January 2025) and AEGIS (in development).",
};

export default function RobotsPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Robots" }]}
        title="Two platforms, one line of development."
        lede={
          <p>
            Zugbee X1 established the architecture. AEGIS is what replaced it.
            Specifications below are transcribed from the team&apos;s own project
            page; rows without a published value say so.
          </p>
        }
        meta={
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="meta text-steel-deep">Platforms</dt>
              <dd className="ui tabular">{robots.length}</dd>
            </div>
            <div>
              <dt className="meta text-steel-deep">Completed</dt>
              <dd className="ui tabular">
                {robots.filter((r) => r.status === "completed").length}
              </dd>
            </div>
            <div>
              <dt className="meta text-steel-deep">In development</dt>
              <dd className="ui tabular">
                {robots.filter((r) => r.status === "active-development").length}
              </dd>
            </div>
          </dl>
        }
      />

      <div className="shell section">
        <ol className="flex flex-col gap-16">
          {[...robots].reverse().map((r, i) => (
            <li key={r.slug}>
              <article className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="meta tabular text-steel-mid">{r.version}</span>
                    <StatusChip
                      status={
                        r.status === "completed" ? "verified" : "needs-review"
                      }
                      label={r.statusLabel}
                    />
                  </div>

                  <h2 className="display-2 mt-3">{r.name}</h2>
                  <p className="meta mt-1 text-steel-deep">{r.designation}</p>

                  <p className="body-lg mt-5 max-w-[46ch] text-steel-deep">
                    {r.summary}
                  </p>

                  <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-steel pt-4">
                    {r.specs.slice(0, 6).map((s) => (
                      <div key={s.label}>
                        <dt className="meta text-steel-deep">{s.label}</dt>
                        <dd
                          className={`ui mt-0.5 ${
                            s.value === "Not yet documented"
                              ? "text-steel-mid"
                              : "text-ink"
                          }`}
                        >
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={`/robots/${r.slug}`}
                    className="btn btn-secondary mt-8"
                  >
                    Full record — {r.name}
                  </Link>
                </div>

                <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <PhotoPlate
                    src={r.gallery[0].src}
                    alt={r.gallery[0].alt}
                    width={1600}
                    height={1204}
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    priority={i === 0}
                    caption={
                      <>
                        <span className="plate-strong">
                          {r.name}
                        </span>
                        <span className="mt-0.5 block">{r.gallery[0].caption}</span>
                      </>
                    }
                  />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
