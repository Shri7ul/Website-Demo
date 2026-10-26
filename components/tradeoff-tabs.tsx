"use client";

import { useRef, useState } from "react";

type Tradeoff = {
  key: string;
  name: string;
  from: string;
  to: string;
  why: string;
  cost: string;
};

/**
 * Scene 04 — design trade-off tabs.
 * Roving tabindex, arrow/Home/End keys, one live panel.
 */
export function TradeoffTabs({ tradeoffs }: { tradeoffs: Tradeoff[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = tradeoffs.length - 1;
    let next = i;
    if (e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  const t = tradeoffs[active];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Design trade-offs"
        className="flex flex-wrap gap-2 border-b border-steel/50 pb-3"
      >
        {tradeoffs.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`tradeoff-tab-${item.key}`}
              aria-selected={isActive}
              aria-controls={`tradeoff-panel-${item.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`ui min-h-[44px] border px-3 transition-colors ${
                isActive
                  ? "border-ink bg-ink text-paper"
                  : "border-steel text-ink hover:border-ink"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`tradeoff-panel-${t.key}`}
        aria-labelledby={`tradeoff-tab-${t.key}`}
        tabIndex={0}
        className="mt-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-t-2 border-steel pt-3">
            <p className="meta text-steel-deep">Zugbee X1 — V1</p>
            <p className="body-lg mt-1 text-ink">{t.from}</p>
          </div>
          <div className="border-t-2 border-lime-deep pt-3">
            <p className="meta text-lime-deep">AEGIS — V2</p>
            <p className="body-lg mt-1 text-ink">{t.to}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="meta text-steel-deep">Why it changed</p>
            <p className="body mt-1 text-steel-deep">{t.why}</p>
          </div>
          <div>
            <p className="meta text-steel-deep">What it cost</p>
            <p className="body mt-1 text-steel-deep">{t.cost}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
