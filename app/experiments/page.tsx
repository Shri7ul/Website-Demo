import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ExperimentExplorer } from "@/components/experiment-explorer";
import { experiments } from "@/content/experiments";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "Registered experiments on the URRT rescue rovers, with protocol, setup, evidence and an honest statement of which measurements exist.",
  alternates: { canonical: "/experiments" },
};

export default function ExperimentsPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Experiments" }]}
        title="Four questions the team has asked of its hardware."
        lede={
          <p>
            Each record states the question, the protocol, and what evidence
            actually exists. Where no validated measurement has been published,
            the record says so instead of drawing a chart.
          </p>
        }
        meta={
          <p className="meta text-steel-deep">
            Filters are stored in the URL, so a link to a filtered view restores
            the same state.
          </p>
        }
      />

      <div className="shell section">
        <ExperimentExplorer experiments={experiments} />

        <div className="mt-14 border border-dashed border-steel bg-paper-sunk p-6 md:p-8">
          <h2 className="display-3">Why there are no charts</h2>
          <p className="body-lg mt-3 max-w-[62ch] text-steel-deep">
            A chart renders only when verified numeric data exists. None of these
            four records has a published measurement set, so none of them shows a
            figure. When logs, trial counts and a definition of success arrive,
            the figures appear here — and the schema of what will be plotted is
            already recorded on each page.
          </p>
          <Link href="/content-status" className="btn btn-secondary mt-6">
            See the claim ledger
          </Link>
        </div>
      </div>
    </>
  );
}
