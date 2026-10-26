import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { researchThemes } from "@/content/research";
import { experiments } from "@/content/experiments";

export const metadata: Metadata = {
  title: "Research",
  description:
    "The research questions behind the URRT rescue rovers, the methods used, and the publication status — currently: none published.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Research" }]}
        title="Three questions, and no publications yet."
        lede={
          <p>
            The team&apos;s public material describes subsystems and intent. It
            does not contain a paper, a dataset or a citation. These themes are
            derived from what the team publishes, and each one is marked with what
            it cannot yet support.
          </p>
        }
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip status="unsupported" label="0 publications" />
            <StatusChip status="planned" label="1 experiment planned" />
            <span className="meta text-steel-deep">
              {experiments.length} experiment records
            </span>
          </div>
        }
      />

      <div className="shell section">
        <ol className="border-t border-steel">
          {researchThemes.map((t, i) => (
            <li key={t.slug} className="border-b border-steel py-8">
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-1">
                  <span className="meta tabular text-steel">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="lg:col-span-6">
                  <h2 className="display-3">
                    <Link
                      href={`/research/${t.slug}`}
                      className="underline decoration-transparent underline-offset-4 hover:decoration-lime-deep"
                    >
                      {t.title}
                    </Link>
                  </h2>
                  <p className="body-lg mt-2 max-w-[54ch] text-steel-deep">
                    {t.question}
                  </p>
                </div>

                <div className="lg:col-span-3">
                  <p className="meta text-steel-deep">Linked experiments</p>
                  <p className="ui mt-1">
                    {t.experiments.length === 0 ? (
                      <span className="text-steel">None registered</span>
                    ) : (
                      t.experiments.length
                    )}
                  </p>
                  <p className="meta mt-3 text-steel-deep">Publications</p>
                  <p className="ui mt-1 text-steel">None</p>
                </div>

                <div className="lg:col-span-2">
                  <Link
                    href={`/research/${t.slug}`}
                    className="ui text-lime-deep underline decoration-1 underline-offset-4 hover:decoration-2"
                  >
                    Read theme →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 border border-dashed border-steel bg-paper-sunk p-6 md:p-8">
          <h2 className="display-3">Publication status</h2>
          <p className="body-lg mt-3 max-w-[64ch] text-steel-deep">
            Nothing has been submitted, accepted or published. A paper that is
            submitted is not a paper that is accepted, and neither would appear
            here until there is a venue and a DOI to point at.
          </p>
          <p className="meta mt-4 text-steel-deep">
            If the team has a manuscript in preparation, the correct treatment is
            to list it as &ldquo;in preparation&rdquo; with no venue claim. The
            slot exists below.
          </p>
          <div className="mt-4 border border-steel bg-paper px-4 py-3">
            <p className="ui text-steel">— no manuscripts registered</p>
          </div>
        </div>
      </div>
    </>
  );
}
