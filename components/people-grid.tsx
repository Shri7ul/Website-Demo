"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Member } from "@/content/types";

const DISCIPLINES = ["All", "Mechanical", "Electrical", "Software & Autonomous"] as const;

export function PeopleGrid({ members }: { members: Member[] }) {
  const [filter, setFilter] = useState<string>("All");

  const visible = useMemo(
    () => (filter === "All" ? members : members.filter((m) => m.discipline === filter)),
    [filter, members]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2" role="group" aria-label="Filter by discipline">
        {DISCIPLINES.map((d) => {
          const count =
            d === "All" ? members.length : members.filter((m) => m.discipline === d).length;
          const pressed = filter === d;
          return (
            <button
              key={d}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(d)}
              className={`ui inline-flex min-h-[44px] items-center gap-2 border px-3 transition-colors ${
                pressed
                  ? "border-ink bg-ink text-paper"
                  : "border-steel text-ink hover:border-ink"
              }`}
            >
              {d}
              <span className={`meta tabular ${pressed ? "text-lime" : "text-steel-deep"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="meta mt-4 text-steel-deep">
        Showing {visible.length} of {members.length} members
        {filter !== "All" ? ` — ${filter}` : ""}.
      </p>

      {visible.length === 0 ? (
        <div className="plate plate-absent mt-6 p-6">
          <p className="title">No members in this discipline</p>
          <p className="body mt-2 text-steel-deep">
            Nothing is listed under {filter}. Clear the filter to see the whole roster.
          </p>
          <button
            type="button"
            onClick={() => setFilter("All")}
            className="btn btn-secondary mt-4"
          >
            Clear filter
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {visible.map((m) => (
            <li key={m.id}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden border border-steel bg-paper-sunk">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={`Portrait photograph of ${m.name}.`}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center p-3">
                      <p className="meta text-center text-steel-deep">
                        No photograph published
                      </p>
                    </div>
                  )}
                </div>
                <figcaption className="mt-2">
                  <p className="ui font-semibold leading-snug">{m.name}</p>
                  <p className="meta text-steel-deep">{m.role}</p>
                  <p className="meta mt-0.5 text-steel-mid">{m.id}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
