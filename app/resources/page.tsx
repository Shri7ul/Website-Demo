import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusChip } from "@/components/status-chip";
import { PhotoPlate } from "@/components/plate";
import { assetManifest } from "@/content/assets";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Publications, code, data and media from the UIU Rescue Rover Team — including an honest record of what has not been published.",
};

export default function ResourcesPage() {
  const media = assetManifest.filter(
    (a) => a.status === "verified" && a.localPath.startsWith("/assets/")
  );
  const photoCount = media.length;

  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Resources" }]}
        title="Open resources, and the honest gaps."
        lede={
          <p>
            Publications, code, datasets and media in one place. Three of those
            four categories are currently empty, and saying so is more useful than
            hiding it.
          </p>
        }
        meta={
          <div className="flex flex-wrap gap-3">
            <StatusChip status="unsupported" label="0 publications" />
            <StatusChip status="unsupported" label="0 datasets" />
            <StatusChip status="verified" label={`${photoCount} media assets`} />
          </div>
        }
      />

      <div className="shell section">
        {/* publications */}
        <section aria-labelledby="pub-heading">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="pub-heading" className="display-3">
                Publications
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="border border-dashed border-steel bg-paper-sunk p-6">
                <p className="body text-steel-deep">
                  Nothing published. No paper, preprint, conference entry or
                  technical report has been released. A Team Description Paper
                  was listed as in preparation on the team&apos;s timeline; it has
                  not been published here, so it is not listed.
                </p>
                <p className="meta mt-3 text-steel-deep">
                  A submitted paper is not an accepted paper. Neither is listed
                  until there is a venue and a DOI.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule my-12" />

        {/* code + data */}
        <section aria-labelledby="code-heading">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="code-heading" className="display-3">
                Code and data
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    t: "Source code",
                    d: "No public repository. No licence has been published, so nothing is redistributed here.",
                  },
                  {
                    t: "Datasets",
                    d: "No trial logs, sensor bags or measurement CSVs have been released.",
                  },
                  {
                    t: "CAD / 3D models",
                    d: "No STEP, STL or GLB export. The 3D explorer is a schematic, not an export.",
                  },
                  {
                    t: "Protocols",
                    d: "The four experiment protocols are published as text on their records. They are the only reproducible artefacts.",
                  },
                ].map((x) => (
                  <div key={x.t} className="border border-steel p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="ui font-semibold">{x.t}</p>
                      <StatusChip status="unsupported" label="None" />
                    </div>
                    <p className="meta mt-2 text-steel-deep">{x.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="rule my-12" />

        {/* media */}
        <section aria-labelledby="media-heading">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="media-heading" className="display-3">
                Media
              </h2>
              <p className="body mt-3 max-w-[38ch] text-steel-deep">
                Recovered from the team&apos;s own site and re-published with
                factual captions. Each plate records where it came from.
              </p>
              <Link href="/content-status" className="btn btn-secondary mt-6">
                Full asset manifest
              </Link>
            </div>

            <div className="lg:col-span-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <PhotoPlate
                  src="/assets/robots/aegis/aegis-workshop-front.jpg"
                  alt="A tracked rescue rover with orange track treads and a raised articulated robotic arm on a workshop floor."
                  width={1600}
                  height={1204}
                  sizes="(max-width: 640px) 100vw, 32vw"
                  caption={
                    <>
                      <span className="block font-semibold text-ink">AEGIS</span>
                      <span className="mt-0.5 block">
                        Workshop, undated. Source: projects.html
                      </span>
                    </>
                  }
                />
                <PhotoPlate
                  src="/assets/robots/zugbee-x1/zugbee-x1-campus.jpg"
                  alt="A small red-tracked white-bodied rover on a grass lawn with a mosque behind."
                  width={1600}
                  height={900}
                  sizes="(max-width: 640px) 100vw, 32vw"
                  caption={
                    <>
                      <span className="block font-semibold text-ink">
                        Zugbee X1
                      </span>
                      <span className="mt-0.5 block">
                        Campus lawn. Source: projects.html
                      </span>
                    </>
                  }
                />
                <PhotoPlate
                  src="/assets/resources/urrt-cap.jpg"
                  alt="A cap with the URRT badge."
                  width={832}
                  height={464}
                  sizes="(max-width: 640px) 100vw, 32vw"
                  caption={
                    <>
                      <span className="block font-semibold text-ink">
                        Team cap
                      </span>
                      <span className="mt-0.5 block">
                        Merchandise as published. Source: gears.html
                      </span>
                    </>
                  }
                />
                <PhotoPlate
                  src="/assets/events/team-campus-rover.jpg"
                  alt="A group of people standing on a patterned paved area with a small rover in front."
                  width={1947}
                  height={1542}
                  sizes="(max-width: 640px) 100vw, 32vw"
                  caption={
                    <>
                      <span className="block font-semibold text-ink">
                        Team and rover, campus
                      </span>
                      <span className="mt-0.5 block">
                        Undated. Individuals not identified.
                      </span>
                    </>
                  }
                />
              </div>

              <div className="mt-6 border-l-2 border-needs-review bg-paper-sunk p-4">
                <p className="meta text-steel-deep">
                  <strong className="font-semibold text-ink">Reuse terms.</strong>{" "}
                  The team has published no licence for these images. They are
                  reproduced here because this site is the team&apos;s own. If you
                  want to reuse one elsewhere, ask first:{" "}
                  <a href="mailto:rescuerover@cair.uiu.ac.bd" className="link-prose">
                    rescuerover@cair.uiu.ac.bd
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule my-12" />

        {/* press */}
        <section aria-labelledby="press-heading">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="press-heading" className="display-3">
                Press
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="border border-dashed border-steel p-6">
                <p className="body text-steel-deep">
                  The previous site displayed press mastheads under URRT. On
                  inspection the linked coverage concerns the UIU Mars Rover
                  Team&apos;s competition results — a different team. No
                  URRT-specific press coverage has been verified, so no outlet is
                  cited here.
                </p>
                <p className="meta mt-3 text-steel-deep">
                  Recorded as claim <code className="text-ink">comp-002</code> and
                  asset <code className="text-ink">press-clipping</code>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
