"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Experiment } from "@/content/types";
import { StatusChip } from "./status-chip";

const ROBOTS = ["All", "AEGIS", "Zugbee X1"] as const;
const SUBSYSTEMS = ["All", "Locomotion", "Perception", "Manipulation"] as const;

const statusMap = {
  completed: "verified",
  "protocol-drafted": "needs-review",
  planned: "planned",
} as const;

const statusLabel = {
  completed: "Photographed, unmeasured",
  "protocol-drafted": "Protocol drafted",
  planned: "Planned",
} as const;

type Filters = { robot: string; subsystem: string; query: string };

const EMPTY: Filters = { robot: "All", subsystem: "All", query: "" };

/**
 * Reads the filter state out of the query string.
 *
 * Deliberately *not* `useSearchParams`. That hook forces Next to bail the whole
 * route out to client-side rendering during prerender, which left the static
 * HTML holding nothing but the Suspense fallback — so the records were absent
 * from the document until hydration finished, and a visitor without JavaScript
 * (or with a failed chunk) saw "Loading experiment records…" forever.
 *
 * Reading `location.search` on mount keeps the full, unfiltered record list in
 * the prerendered HTML, and still restores a filtered deep link.
 */
function readFilters(): Filters {
  if (typeof window === "undefined") return EMPTY;
  const p = new URLSearchParams(window.location.search);
  const robot = p.get("robot") ?? "All";
  const subsystem = p.get("subsystem") ?? "All";
  return {
    robot: (ROBOTS as readonly string[]).includes(robot) ? robot : "All",
    subsystem: (SUBSYSTEMS as readonly string[]).includes(subsystem)
      ? subsystem
      : "All",
    query: p.get("q") ?? "",
  };
}

function writeFilters(next: Filters, pathname: string) {
  const p = new URLSearchParams();
  if (next.robot !== "All") p.set("robot", next.robot);
  if (next.subsystem !== "All") p.set("subsystem", next.subsystem);
  if (next.query) p.set("q", next.query);
  const qs = p.toString();
  window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
}

export function ExperimentExplorer({
  experiments,
  compact = false,
}: {
  experiments: Experiment[];
  compact?: boolean;
}) {
  // Server render and first client render agree on the unfiltered set, so
  // hydration never mismatches. The URL is applied immediately afterwards.
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setFilters(readFilters());
    sync();
    setHydrated(true);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch };
        writeFilters(next, window.location.pathname);
        return next;
      });
    },
    []
  );

  const clear = useCallback(() => {
    setFilters(EMPTY);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const { robot, subsystem, query } = filters;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return experiments.filter((e) => {
      if (robot !== "All" && e.robot !== robot) return false;
      if (subsystem !== "All" && e.subsystem !== subsystem) return false;
      if (
        q &&
        !`${e.title} ${e.question} ${e.code} ${e.robot}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [experiments, robot, subsystem, query]);

  const hasFilters = robot !== "All" || subsystem !== "All" || query !== "";

  return (
    <div>
      {/* filters */}
      <div className="flex flex-col gap-4 border-y border-steel/50 py-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1">
            <span className="meta text-steel-deep">Robot</span>
            <select
              value={robot}
              onChange={(e) => update({ robot: e.target.value })}
              className="ui h-11 min-w-[9rem] border border-steel bg-paper px-2 text-ink"
            >
              {ROBOTS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="meta text-steel-deep">Subsystem</span>
            <select
              value={subsystem}
              onChange={(e) => update({ subsystem: e.target.value })}
              className="ui h-11 min-w-[9rem] border border-steel bg-paper px-2 text-ink"
            >
              {SUBSYSTEMS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="meta text-steel-deep">Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder="Title, question or code"
              className="ui h-11 w-full min-w-[12rem] border border-steel bg-paper px-2 text-ink placeholder:text-steel-mid"
            />
          </label>
        </div>

        {hasFilters && (
          <button type="button" onClick={clear} className="btn btn-tertiary meta">
            Clear filters
          </button>
        )}
      </div>

      <p aria-live="polite" className="meta mt-4 text-steel-deep">
        {visible.length} of {experiments.length} experiments
        {robot !== "All" ? ` · ${robot}` : ""}
        {subsystem !== "All" ? ` · ${subsystem}` : ""}
        {query ? ` · “${query}”` : ""}
      </p>

      {visible.length === 0 ? (
        <div className="plate plate-absent mt-6 p-6 md:p-8">
          <p className="title">No experiments match this filter</p>
          <p className="body mt-2 max-w-prose text-steel-deep">
            {robot !== "All" ? `${robot} · ` : ""}
            {subsystem !== "All" ? `${subsystem} · ` : ""}
            {query ? `“${query}” · ` : ""}
            no records. This is an honest empty result, not a loading state.
          </p>
          <button type="button" onClick={clear} className="btn btn-secondary mt-4">
            Clear filters
          </button>
        </div>
      ) : (
        <ul
          className="mt-6 divide-y divide-steel/50 border-y border-steel/50"
          // The list is a live region so a filter change is announced without
          // moving focus away from the control that caused it.
          aria-live="polite"
          aria-busy={!hydrated}
        >
          {visible.map((e) => (
            <li key={e.slug} className="py-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="meta tabular text-steel-mid">{e.code}</span>
                    <StatusChip status={statusMap[e.status]} label={statusLabel[e.status]} />
                    <span className="meta text-steel-deep">
                      {e.robot} · {e.subsystem}
                    </span>
                  </div>

                  <h2 className="title mt-2">
                    <Link
                      href={`/experiments/${e.slug}`}
                      className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-lime-deep"
                    >
                      {e.title}
                    </Link>
                  </h2>

                  {!compact && (
                    <p className="body mt-2 max-w-prose text-steel-deep">
                      {e.question}
                    </p>
                  )}

                  <p className="meta mt-2 text-steel-mid">
                    {e.measurements
                      ? `${e.measurements.length} validated measurements published`
                      : "No validated measurements published"}
                  </p>
                </div>

                <Link
                  href={`/experiments/${e.slug}`}
                  className="ui shrink-0 text-lime-deep underline decoration-1 underline-offset-4 hover:decoration-2"
                >
                  Full record
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
