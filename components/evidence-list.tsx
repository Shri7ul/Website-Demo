"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Experiment } from "@/content/types";

/**
 * Scene 06 — the evidence climax, on ink.
 * Compact counterpart to the full explorer on /experiments, which carries
 * URL-persisted state. This one keeps state local so the homepage stays cheap.
 */
export function EvidenceList({ experiments }: { experiments: Experiment[] }) {
  const [robot, setRobot] = useState("All");
  const [subsystem, setSubsystem] = useState("All");

  const visible = useMemo(
    () =>
      experiments.filter(
        (e) =>
          (robot === "All" || e.robot === robot) &&
          (subsystem === "All" || e.subsystem === subsystem)
      ),
    [experiments, robot, subsystem]
  );

  const measured = experiments.filter((e) => e.measurements).length;

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-steel py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-col gap-1">
            <span className="meta text-steel-light">Robot</span>
            <select
              value={robot}
              onChange={(e) => setRobot(e.target.value)}
              className="ui h-11 min-w-[9rem] border border-steel-light bg-ink px-2 text-paper"
            >
              {["All", "AEGIS", "Zugbee X1"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="meta text-steel-light">Subsystem</span>
            <select
              value={subsystem}
              onChange={(e) => setSubsystem(e.target.value)}
              className="ui h-11 min-w-[9rem] border border-steel-light bg-ink px-2 text-paper"
            >
              {["All", "Locomotion", "Perception", "Manipulation"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p aria-live="polite" className="meta text-steel-light">
          {visible.length} of {experiments.length} records ·{" "}
          {measured === 0 ? "no validated measurements yet" : `${measured} with data`}
        </p>
      </div>

      <ul className="divide-y divide-steel border-b border-steel">
        {visible.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/experiments/${e.slug}`}
              className="group grid gap-3 py-5 md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <span className="meta tabular text-steel-light md:col-span-1">
                {e.code}
              </span>
              <span className="md:col-span-5">
                <span className="title block text-paper underline decoration-transparent underline-offset-4 group-hover:decoration-lime">
                  {e.title}
                </span>
                <span className="meta mt-1 block text-steel-light">
                  {e.robot} · {e.subsystem}
                </span>
              </span>
              <span className="meta text-steel-light md:col-span-3">
                {e.measurements ? "Measurements published" : "No validated data"}
              </span>
              <span className="meta text-lime md:col-span-3 md:text-right">
                Full record →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <div className="border border-dashed border-steel-light p-6">
          <p className="title text-paper">No records match</p>
          <p className="body mt-2 text-steel-light">
            Nothing is filed under {robot} · {subsystem}.{" "}
            <button
              type="button"
              onClick={() => {
                setRobot("All");
                setSubsystem("All");
              }}
              className="text-lime underline underline-offset-4"
            >
              Clear both filters
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}
