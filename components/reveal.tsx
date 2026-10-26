"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The single authored entrance per page (DESIGN.md §7).
 *
 * Content is visible by default in the server HTML. This only marks an element
 * "pending" once it has mounted and is genuinely below the fold, so a JS
 * failure or a crawler still sees fully visible content.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  as?: "div" | "section" | "li" | "article";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const rect = el.getBoundingClientRect();
    // Already on screen at mount: leave it visible, no entrance.
    if (rect.top < window.innerHeight * 0.9) return;

    el.dataset.reveal = "pending";

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (delay) target.style.transitionDelay = `${delay}ms`;
            target.dataset.reveal = "in";
            io.unobserve(target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      data-reveal="visible"
    >
      {children}
    </Tag>
  );
}
