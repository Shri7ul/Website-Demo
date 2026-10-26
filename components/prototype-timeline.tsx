"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Stage = {
  label: string;
  date: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  caption: string;
  status: "verified" | "needs-review" | "planned" | "unsupported";
};

/**
 * Scene 03 — the prototype rail.
 *
 * Scroll-*linked*, never scroll-*hijacked*: the page scrolls at native speed and
 * we only read progress. Below `prefers-reduced-motion: reduce` the scrub is
 * skipped entirely and every stage renders as a static, fully expanded list.
 */
export function PrototypeTimeline({ stages }: { stages: Stage[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [scrub, setScrub] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    if (reduce || !wide) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      setScrub(true);

      const el = wrapRef.current;
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const i = Math.min(
            stages.length - 1,
            Math.floor(self.progress * stages.length * 0.999)
          );
          setIndex(i);
        },
      });

      ctx = { revert: () => st.kill() };
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [stages.length]);

  const go = (dir: 1 | -1) => {
    const next = Math.min(stages.length - 1, Math.max(0, index + dir));
    setIndex(next);
  };

  /* ---------- static fallback: reduced motion, or narrow viewport ---------- */
  if (!scrub) {
    return (
      <div ref={wrapRef} className="flex flex-col gap-12">
        {stages.map((s, i) => (
          <article key={s.title} className="grid gap-5 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5">
              <p className="meta text-steel-deep">
                {String(i + 1).padStart(2, "0")} · {s.date}
              </p>
              <h3 className="display-3 mt-2">{s.title}</h3>
              <p className="body mt-3 text-steel-deep">{s.body}</p>
            </div>
            <figure className="plate md:col-span-7">
              <div className="plate-media">
                <Image
                  src={s.image}
                  alt={s.alt}
                  width={1600}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="h-auto w-full object-cover"
                />
              </div>
              <figcaption className="plate-caption">{s.caption}</figcaption>
            </figure>
          </article>
        ))}
      </div>
    );
  }

  /* ---------- scroll-linked scrub ---------- */
  const current = stages[index];

  return (
    <div
      ref={wrapRef}
      style={{ height: `${stages.length * 88 + 40}vh` }}
      className="relative"
    >
      <div className="sticky top-20 h-[calc(100vh-5rem)] py-8">
        <div className="grid h-full grid-cols-12 gap-8">
          {/* rail */}
          <div className="col-span-4 flex flex-col justify-center">
            <ol className="space-y-0">
              {stages.map((s, i) => {
                const active = i === index;
                return (
                  <li key={s.title}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-current={active ? "step" : undefined}
                      className="group flex w-full items-start gap-3 border-b border-steel/40 py-3 text-left"
                    >
                      <span
                        className={`meta mt-0.5 w-6 shrink-0 tabular ${
                          active ? "text-lime-deep" : "text-steel"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`ui block font-semibold transition-colors ${
                            active ? "text-ink" : "text-steel-deep"
                          }`}
                        >
                          {s.title}
                        </span>
                        <span className="meta block text-steel">{s.date}</span>
                        <span
                          className={`block overflow-hidden text-steel-deep transition-all duration-300 ${
                            active
                              ? "mt-2 max-h-40 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                          style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}
                        >
                          {s.body}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="btn btn-secondary !min-h-[44px] px-3"
              >
                <span className="sr-only">Previous stage</span>
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={index === stages.length - 1}
                className="btn btn-secondary !min-h-[44px] px-3"
              >
                <span className="sr-only">Next stage</span>
                <span aria-hidden="true">→</span>
              </button>
              <p className="meta ml-1 text-steel-deep" aria-live="polite">
                Stage {index + 1} of {stages.length} — {current.date}
              </p>
            </div>
          </div>

          {/* plate stack */}
          <div className="col-span-8">
            <figure className="plate h-full">
              <div className="plate-media relative h-[calc(100%-3.25rem)]">
                {stages.map((s, i) => (
                  <div
                    key={s.image}
                    aria-hidden={i !== index}
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ opacity: i === index ? 1 : 0 }}
                  >
                    <Image
                      src={s.image}
                      alt={i === index ? s.alt : ""}
                      fill
                      sizes="58vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
              <figcaption className="plate-caption">
                <span className="block">{current.caption}</span>
                <span className="mt-1 block text-steel">
                  {current.label} · scroll to advance
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
}
