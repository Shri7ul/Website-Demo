import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { researchThemes, getResearchTheme } from "@/content/research";
import { experiments } from "@/content/experiments";

export function generateStaticParams() {
  return researchThemes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getResearchTheme(slug);
  if (!t) return { title: "Theme not found" };
  return { title: t.title, description: t.question };
}

export default async function ResearchThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = getResearchTheme(slug);
  if (!theme) notFound();

  const linked = experiments.filter((e) => theme.experiments.includes(e.slug));

  return (
    <>
      <PageHeader
        breadcrumb={[
          { href: "/", label: "Home" },
          { href: "/research", label: "Research" },
          { label: theme.title },
        ]}
        title={theme.title}
        lede={<p>{theme.question}</p>}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip
              status={theme.publications.length ? "verified" : "unsupported"}
              label={
                theme.publications.length
                  ? `${theme.publications.length} publications`
                  : "No publications"
              }
            />
            <span className="meta text-steel-deep">
              {linked.length} linked experiment{linked.length === 1 ? "" : "s"}
            </span>
          </div>
        }
      />

      <div className="shell section">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display-3">Why this question</h2>
            <p className="body-lg mt-3 max-w-[62ch] text-steel-deep">{theme.why}</p>

            <h2 className="display-3 mt-12">Approach</h2>
            <p className="body-lg mt-3 max-w-[62ch] text-steel-deep">
              {theme.approach}
            </p>

            <h2 className="display-3 mt-12">What this does not support</h2>
            <p className="body-lg mt-3 max-w-[62ch] text-steel-deep">
              {theme.limitations}
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-steel">
              <div className="border-b border-steel bg-paper-sunk px-4 py-3">
                <h2 className="ui font-semibold">Linked experiments</h2>
              </div>
              {linked.length === 0 ? (
                <div className="px-4 py-6">
                  <p className="body text-steel-deep">
                    No experiment is registered for this theme yet. The question
                    stands on the design rationale alone.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-steel/50">
                  {linked.map((e) => (
                    <li key={e.slug}>
                      <Link
                        href={`/experiments/${e.slug}`}
                        className="block px-4 py-3 transition-colors hover:bg-paper-sunk"
                      >
                        <span className="meta tabular text-steel">{e.code}</span>
                        <span className="ui mt-0.5 block font-medium text-ink">
                          {e.title}
                        </span>
                        <span className="meta block text-steel-deep">
                          {e.robot} · {e.subsystem}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-6 border border-steel">
              <div className="border-b border-steel bg-paper-sunk px-4 py-3">
                <h2 className="ui font-semibold">Citations</h2>
              </div>
              <div className="px-4 py-6">
                <p className="body text-steel-deep">
                  None. No paper, preprint or dataset has been published for this
                  theme, so there is nothing to cite.
                </p>
              </div>
            </div>

            <Link href="/research" className="btn btn-secondary mt-6 w-full">
              All research themes
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
