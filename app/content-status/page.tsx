import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { claims, claimCounts } from "@/content/claims";
import { assetManifest, missingAssets } from "@/content/assets";
import { site } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/content-status" },
  title: "Content status",
  description:
    "The claim ledger and asset manifest behind this site: what is verified, what needs review, what is planned, and what is unsupported.",
  robots: { index: false, follow: true },
};

export default function ContentStatusPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Content status" }]}
        title="What this site knows, and how it knows it."
        lede={
          <p>
            Every claim on the site is registered here with its evidence, owner
            and review date. This page is for the team, not for visitors — it is
            excluded from search indexing.
          </p>
        }
        meta={
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="meta text-steel-deep">Verified</dt>
              <dd className="ui tabular">{claimCounts.verified}</dd>
            </div>
            <div>
              <dt className="meta text-steel-deep">Needs review</dt>
              <dd className="ui tabular">{claimCounts.needsReview}</dd>
            </div>
            <div>
              <dt className="meta text-steel-deep">Planned</dt>
              <dd className="ui tabular">{claimCounts.planned}</dd>
            </div>
            <div>
              <dt className="meta text-steel-deep">Unsupported</dt>
              <dd className="ui tabular">{claimCounts.unsupported}</dd>
            </div>
            <div>
              <dt className="meta text-steel-deep">Total</dt>
              <dd className="ui tabular">{claimCounts.total}</dd>
            </div>
          </dl>
        }
      />

      <div className="shell section">
        <section aria-labelledby="ledger-heading">
          <h2 id="ledger-heading" className="display-2">
            Claim ledger
          </h2>
          <p className="body-lg mt-4 max-w-[62ch] text-steel-deep">
            <strong className="font-semibold text-ink">Verified</strong> means the
            evidence was checked and is internally consistent.{" "}
            <strong className="font-semibold text-ink">Needs review</strong> means
            it is published by the team but conflicts, or cannot be confirmed.{" "}
            <strong className="font-semibold text-ink">Planned</strong> is a goal.{" "}
            <strong className="font-semibold text-ink">Unsupported</strong> has no
            evidence and is not displayed as fact.
          </p>

          <div className="mt-8 overflow-x-auto border border-steel">
            <table className="w-full min-w-[52rem] border-collapse text-left">
              <caption className="sr-only">
                Claim ledger with status, evidence and owner
              </caption>
              <thead>
                <tr className="bg-paper-sunk">
                  {["ID", "Claim", "Status", "Evidence", "Owner", "Reviewed"].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        className="meta px-3 py-3 align-bottom text-steel-deep"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c.id} className="border-t border-steel/50 align-top">
                    <td className="meta tabular px-3 py-3 text-steel-mid">{c.id}</td>
                    <td className="px-3 py-3">
                      <p className="ui text-ink">{c.text}</p>
                      <p className="meta mt-1 text-steel-deep">
                        Public treatment: {c.publicTreatment}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <StatusChip status={c.status} />
                    </td>
                    <td className="meta px-3 py-3 text-steel-deep">
                      {c.evidence}
                      {c.source && (
                        <span className="mt-1 block text-steel-mid">{c.source}</span>
                      )}
                    </td>
                    <td className="meta px-3 py-3 text-steel-deep">{c.owner}</td>
                    <td className="meta tabular px-3 py-3 text-steel-deep">
                      {c.reviewed ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="rule my-14" />

        <section aria-labelledby="assets-heading">
          <h2 id="assets-heading" className="display-2">
            Asset manifest
          </h2>
          <p className="body-lg mt-4 max-w-[62ch] text-steel-deep">
            {assetManifest.length} assets recovered from{" "}
            <code className="text-ink">rescuerover.uiu.ac.bd</code>, with original
            URL, source page and local destination. Originals are preserved
            untouched in <code className="text-ink">public/assets/source/</code>.
          </p>

          <div className="mt-8 overflow-x-auto border border-steel">
            <table className="w-full min-w-[56rem] border-collapse text-left">
              <caption className="sr-only">Asset manifest</caption>
              <thead>
                <tr className="bg-paper-sunk">
                  {["ID", "Subject", "Source page", "Local path", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        className="meta px-3 py-3 align-bottom text-steel-deep"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {assetManifest.map((a) => (
                  <tr key={a.assetId} className="border-t border-steel/50 align-top">
                    <td className="meta tabular px-3 py-2.5 text-steel-mid">
                      {a.assetId}
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="ui text-ink">{a.subject}</p>
                      {a.note && (
                        <p className="meta mt-1 text-steel-deep">{a.note}</p>
                      )}
                    </td>
                    <td className="meta px-3 py-2.5 text-steel-deep">
                      {a.sourcePage.replace("https://rescuerover.uiu.ac.bd", "")}
                    </td>
                    <td className="meta px-3 py-2.5 text-steel-deep">
                      {a.localPath}
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusChip
                        status={a.status === "verified" ? "verified" : "needs-review"}
                        label={a.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="rule my-14" />

        <section aria-labelledby="missing-heading">
          <h2 id="missing-heading" className="display-2">
            Still missing
          </h2>
          <p className="body-lg mt-4 max-w-[62ch] text-steel-deep">
            These gaps are designed into the site rather than hidden. Each names
            what would close it.
          </p>

          <ul className="mt-8 border-t border-steel">
            {missingAssets.map((m) => (
              <li key={m.what} className="border-b border-steel py-5">
                <div className="grid gap-3 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <p className="ui font-semibold text-ink">{m.what}</p>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="meta text-steel-deep">Owner</p>
                    <p className="meta mt-0.5 text-ink">{m.owner}</p>
                  </div>
                  <div className="lg:col-span-5">
                    <p className="meta text-steel-deep">Effect on the site</p>
                    <p className="meta mt-0.5 text-steel-deep">{m.effect}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 border border-dashed border-steel bg-paper-sunk p-6">
          <h2 className="display-3">Maintenance</h2>
          <p className="body mt-3 max-w-[64ch] text-steel-deep">
            Project lead approves project status. Research lead reviews technical
            claims. Team coordinator maintains the roster. Competition coordinator
            maintains events. Site maintainer manages deployment. Quarterly content
            audit; immediate update after a verified major milestone.
          </p>
          <p className="meta mt-4 text-steel-deep">
            Last updated{" "}
            <time dateTime={site.lastUpdated}>{site.lastUpdatedLabel}</time>. Send
            corrections to{" "}
            <a href={`mailto:${site.email}?subject=Content%20correction`} className="link-prose">
              {site.email}
            </a>
            .
          </p>
          <Link href="/" className="btn btn-secondary mt-6">
            Back to the site
          </Link>
        </div>
      </div>
    </>
  );
}
