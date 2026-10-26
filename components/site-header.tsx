"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Focus trap, Escape, and scroll lock while the sheet is open
  useEffect(() => {
    if (!open) return;

    const sheet = sheetRef.current;
    if (!sheet) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Captured here so the cleanup below closes over a stable node rather than
    // reading `.current` after React may have detached it.
    const trigger = triggerRef.current;
    document.documentElement.classList.add("no-scroll");

    const focusables = () =>
      Array.from(
        sheet.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("no-scroll");
      // Return focus to the trigger
      (previouslyFocused ?? trigger)?.focus();
    };
  }, [open]);

  const isCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-steel bg-paper">
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/assets/brand/urrt-logo.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 md:h-10 md:w-10"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="ui font-semibold tracking-tight text-ink">URRT</span>
            <span className="meta hidden text-steel-deep sm:block">
              UIU Rescue Rover Team
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={`ui relative py-1 text-ink transition-colors hover:text-lime-deep ${
                isCurrent(item.href)
                  ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-lime"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/join" className="btn btn-primary hidden md:inline-flex">
            Join the team
          </Link>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="ui flex h-11 w-11 items-center justify-center border border-steel text-ink lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
              ) : (
                <path d="M2 6h16M2 14h16" stroke="currentColor" strokeWidth="1.6" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          ref={sheetRef}
          className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-steel bg-paper lg:hidden"
        >
          <nav aria-label="Primary mobile" className="shell flex flex-col py-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className="title flex min-h-[56px] items-center justify-between border-b border-steel/40 py-3 text-ink"
              >
                {item.label}
                {isCurrent(item.href) && (
                  <span className="meta text-lime-deep">Current</span>
                )}
              </Link>
            ))}
            <Link
              href="/join"
              className="title mt-6 flex min-h-[56px] items-center border-b border-steel/40 py-3 text-ink"
            >
              Join the team
            </Link>
            <Link
              href="/contact"
              className="title flex min-h-[56px] items-center border-b border-steel/40 py-3 text-ink"
            >
              Contact
            </Link>
            <p className="meta mt-6 text-steel-deep">{site.email}</p>
          </nav>
        </div>
      )}
    </header>
  );
}
