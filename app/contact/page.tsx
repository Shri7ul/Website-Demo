import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the UIU Rescue Rover Team at United International University, Dhaka.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Contact" }]}
        title="Talk to the team."
        lede={
          <p>
            For collaboration, sponsorship, recruitment or a technical question.
            Email is the reliable route; the form below composes one for you.
          </p>
        }
      />

      <div className="shell section">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <dl className="border-t border-steel">
              {[
                {
                  k: "Email",
                  v: (
                    <a href={`mailto:${site.email}`} className="link-prose">
                      {site.email}
                    </a>
                  ),
                  n: "We aim to respond within 24 hours on working days.",
                },
                {
                  k: "Phone",
                  v: <span className="tabular">{site.phone}</span>,
                  n: site.phoneNote,
                },
                {
                  k: "Address",
                  v: (
                    <>
                      {site.address.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </>
                  ),
                  n: site.address.campusHours,
                },
                {
                  k: "Lab",
                  v: site.address.labNote,
                  n: "Center for Artificial Intelligence Research.",
                },
              ].map((row) => (
                <div key={row.k} className="border-b border-steel py-4">
                  <dt className="meta text-steel-deep">{row.k}</dt>
                  <dd className="ui mt-1 text-ink">{row.v}</dd>
                  <dd className="meta mt-1 text-steel">{row.n}</dd>
                </div>
              ))}
            </dl>

            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary mt-6"
            >
              Open in Google Maps ↗
            </a>

            <div className="mt-8 flex gap-5">
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer me"
                className="meta text-lime-deep underline underline-offset-4"
              >
                Facebook
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer me"
                className="meta text-lime-deep underline underline-offset-4"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="display-3">Send a message</h2>
            <p className="body mt-2 max-w-[54ch] text-steel-deep">
              This form does not post to a server. It composes an email so your
              message arrives in the same inbox as everything else.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-steel pt-6">
          <p className="meta text-steel-deep">
            Looking to join?{" "}
            <Link href="/join" className="link-prose">
              Read what the team needs
            </Link>{" "}
            first. Looking to sponsor?{" "}
            <Link href="/collaborate" className="link-prose">
              See collaboration options
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
