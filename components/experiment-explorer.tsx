"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
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

export function ExperimentExplorer({
  experiments,
  compact = false,
}: {
  experiments: Experiment[];
  compact?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const robot = params.get("robot") ?? "All";
  const subsystem = params.get("subsystem") ?? "All";
  const query = params.get("q") ?? "";

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === "All") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

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

  const clear = () => router.replace(pathname, { scroll: false });

  return (
    <div>
      {/* filters */}
      <div className="flex flex-col gap-4 border-y border-steel/50 py-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1">
            <span className="meta text-steel-deep">Robot</span>
            <select
              value={robot}
              onChange={(e) => setParam("robot", e.target.value)}
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
              onChange={(e) => setParam("subsystem", e.target.value)}
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
              onChange={(e) => setParam("q", e.target.value)}
              placeholder="Title, question or code"
              className="ui h-11 w-full min-w-[12rem] border border-steel bg-paper px-2 text-ink placeholder:text-steel"
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
        <ul className="mt-6 divide-y divide-steel/50 border-y border-steel/50">
          {visible.map((e) => (
            <li key={e.slug} className="py-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="meta tabular text-steel">{e.code}</span>
                    <StatusChip status={statusMap[e.status]} label={statusLabel[e.status]} />
                    <span className="meta text-steel-deep">
                      {e.robot} · {e.subsystem}
                    </span>
                  </div>

                  <h3 className="title mt-2">
                    <Link
                      href={`/experiments/${e.slug}`}
                      className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-lime-deep"
                    >
                      {e.title}
                    </Link>
                  </h3>

                  {!compact && (
                    <p className="body mt-2 max-w-prose text-steel-deep">
                      {e.question}
                    </p>
                  )}

                  <p className="meta mt-2 text-steel">
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
