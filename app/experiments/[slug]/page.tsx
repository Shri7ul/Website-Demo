import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { AbsentPlate } from "@/components/plate";
import { experiments, getExperiment } from "@/content/experiments";

export function generateStaticParams() {
  return experiments.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = getExperiment(slug);
  if (!e) return { title: "Experiment not found" };
  return { title: `${e.code} · ${e.title}`, description: e.question };
}

const statusMap = {
  completed: "verified",
  "protocol-drafted": "needs-review",
  planned: "planned",
} as const;

const statusLabel = {
  completed: "Completed — unmeasured",
  "protocol-drafted": "Protocol drafted",
  planned: "Planned",
} as const;

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = getExperiment(slug);
  if (!e) notFound();

  return (
    <>
      <PageHeader
        breadcrumb={[
          { href: "/", label: "Home" },
          { href: "/experiments", label: "Experiments" },
          { label: e.code },
        ]}
        title={e.title}
        lede={<p>{e.question}</p>}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip status={statusMap[e.status]} label={statusLabel[e.status]} />
            <span className="meta text-steel-deep">
              {e.robot} · {e.subsystem}
            </span>
            <span className="meta tabular text-steel">{e.code}</span>
          </div>
        }
      />

      <div className="shell section">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display-3">Why it matters</h2>
            <p className="body-lg mt-3 max-w-[62ch] text-steel-deep">
              {e.whyItMatters}
            </p>

            <h2 className="display-3 mt-12">Method</h2>
            <p className="body-lg mt-3 max-w-[62ch] text-steel-deep">{e.method}</p>

            <h2 className="display-3 mt-12">Protocol</h2>
            <ol className="mt-3 border-t border-steel">
              {e.protocol.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-4 border-b border-steel/50 py-3"
                >
                  <span className="meta tabular mt-1 shrink-0 text-steel">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="body text-steel-deep">{step}</span>
                </li>
              ))}
            </ol>

            <h2 className="display-3 mt-12">Results</h2>
            {e.measurements ? (
              <div className="mt-4 overflow-x-auto border border-steel">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-paper-sunk">
                      <th className="meta px-4 py-2 text-steel-deep">Measure</th>
                      <th className="meta px-4 py-2 text-steel-deep">Value</th>
                      <th className="meta px-4 py-2 text-steel-deep">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e.measurements.map((m) => (
                      <tr key={m.label} className="border-t border-steel/50">
                        <th scope="row" className="ui px-4 py-2 font-medium">
                          {m.label}
                        </th>
                        <td className="ui tabular px-4 py-2">{m.value}</td>
                        <td className="meta px-4 py-2 text-steel-deep">
                          {m.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4">
                <AbsentPlate
                  title="No validated measurements published"
                  body="This record has no numeric result. The figure below is the schema that will be plotted once logs and a trial count exist — it is not data."
                  caption={
                    <>
                      <span className="block font-semibold text-ink">
                        Figure 1 — absent
                      </span>
                      <span className="mt-0.5 block">
                        Schema: trial index (x) against outcome and time-to-complete
                        (y). Owner: research lead.
                      </span>
                    </>
                  }
                />
              </div>
            )}

            <h2 className="display-3 mt-12">Failures</h2>
            <p className="body-lg mt-3 max-w-[62ch] text-steel-deep">
              {e.failures}
            </p>

            <h2 className="display-3 mt-12">Interpretation</h2>
            <p className="body-lg mt-3 max-w-[62ch] text-steel-deep">
              {e.interpretation}
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-steel">
              <div className="border-b border-steel bg-paper-sunk px-4 py-3">
                <h2 className="ui font-semibold">Setup</h2>
              </div>
              <dl className="divide-y divide-steel/50">
                {e.setup.map((s) => (
                  <div key={s.label} className="px-4 py-3">
                    <dt className="meta text-steel-deep">{s.label}</dt>
                    <dd className="ui mt-0.5 text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 border border-steel">
              <div className="border-b border-steel bg-paper-sunk px-4 py-3">
                <h2 className="ui font-semibold">Evidence</h2>
              </div>
              <ul className="divide-y divide-steel/50">
                {e.evidence.map((ev) => (
                  <li key={ev.label} className="flex items-start gap-3 px-4 py-3">
                    <StatusChip
                      status={ev.available ? "verified" : "unsupported"}
                      label={ev.available ? "Available" : "Missing"}
                    />
                    <span className="min-w-0">
                      <span className="ui block font-medium text-ink">
                        {ev.label}
                      </span>
                      <span className="meta block text-steel-deep">{ev.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border border-dashed border-steel p-4">
              <p className="meta text-steel-deep">
                Reproducibility: no configuration file, dataset schema or
                revision history has been published for this record.
              </p>
            </div>

            <Link href="/experiments" className="btn btn-secondary mt-6 w-full">
              All experiments
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
