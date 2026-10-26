import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  lede,
  breadcrumb,
  meta,
  children,
}: {
  title: string;
  lede?: ReactNode;
  breadcrumb: { href?: string; label: string }[];
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-steel">
      <div className="shell py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="meta text-steel-deep">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {breadcrumb.map((b, i) => (
              <li key={`${b.label}-${i}`} className="flex items-center gap-2">
                {b.href ? (
                  <Link
                    href={b.href}
                    className="underline decoration-transparent underline-offset-4 hover:decoration-lime-deep"
                  >
                    {b.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">
                    {b.label}
                  </span>
                )}
                {i < breadcrumb.length - 1 && (
                  <span aria-hidden="true" className="text-steel">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="display-2">{title}</h1>
          </div>
          {lede && (
            <div className="lg:col-span-5 lg:pt-2">
              <div className="body-lg max-w-[46ch] text-steel-deep">{lede}</div>
            </div>
          )}
        </div>

        {meta && <div className="mt-6">{meta}</div>}
        {children}
      </div>
    </header>
  );
}
