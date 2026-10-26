import Link from "next/link";
import Image from "next/image";
import { footerNav, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="on-ink border-t border-steel bg-ink text-paper">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/brand/urrt-logo.png"
                alt=""
                width={56}
                height={56}
                className="h-12 w-12"
              />
              <div>
                <p className="title text-paper">{site.name}</p>
                <p className="meta text-steel-light">
                  {site.university} · Dhaka
                </p>
              </div>
            </div>

            <p className="body mt-5 max-w-sm text-steel-light">
              Student-built rescue robotics. Two prototypes, documented
              honestly, built toward the RoboCup Rescue league.
            </p>

            <address className="meta mt-6 not-italic text-steel-light">
              <a
                href={`mailto:${site.email}`}
                className="block text-paper underline decoration-steel underline-offset-4 hover:decoration-lime"
              >
                {site.email}
              </a>
              <span className="mt-1 block">{site.phone}</span>
              <span className="mt-3 block">
                {site.address.lines.join(", ")}
              </span>
            </address>

            <div className="meta mt-6 flex gap-5">
              <a
                href={site.social.facebook}
                rel="noopener noreferrer me"
                target="_blank"
                className="text-steel-light underline decoration-steel underline-offset-4 hover:text-paper hover:decoration-lime"
              >
                Facebook
              </a>
              <a
                href={site.social.instagram}
                rel="noopener noreferrer me"
                target="_blank"
                className="text-steel-light underline decoration-steel underline-offset-4 hover:text-paper hover:decoration-lime"
              >
                Instagram
              </a>
            </div>
          </div>

          {footerNav.map((group) => (
            <nav
              key={group.heading}
              aria-label={group.heading}
              className="md:col-span-2"
            >
              <h2 className="meta text-steel-light">{group.heading}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="ui text-paper underline decoration-transparent underline-offset-4 transition-colors hover:decoration-lime"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-steel pt-6 md:flex-row md:items-center md:justify-between">
          <p className="meta text-steel-light">
            © 2026 URRT — {site.name}. All rights reserved.
          </p>
          <div className="meta flex flex-wrap items-center gap-x-5 gap-y-2 text-steel-light">
            <span>
              Last updated{" "}
              <time dateTime={site.lastUpdated}>{site.lastUpdatedLabel}</time>
            </span>
            <Link
              href="/content-status"
              className="underline decoration-steel underline-offset-4 hover:text-paper hover:decoration-lime"
            >
              Content status
            </Link>
            <a
              href={`mailto:${site.email}?subject=Content%20correction`}
              className="underline decoration-steel underline-offset-4 hover:text-paper hover:decoration-lime"
            >
              Report a correction
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
