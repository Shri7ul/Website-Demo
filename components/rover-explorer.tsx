"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { SubsystemKey } from "./rover-scene";

const RoverScene = dynamic(
  () => import("./rover-scene").then((m) => m.RoverScene),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center bg-paper-sunk">
        <p className="meta text-steel-deep">Preparing the 3D assembly…</p>
      </div>
    ),
  }
);

type Subsystem = {
  key: string;
  name: string;
  summary: string;
  detail: string;
  anchor: [number, number, number];
};

const ORDER: SubsystemKey[] = ["locomotion", "perception", "manipulation"];

/* -------------------------------------------------------------------------- */

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    // Keep the failure visible in the console for QA, but never blank the page.
    console.error("3D scene failed:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* -------------------------------------------------------------------------- */

export function RoverExplorer({
  subsystems,
  robotName,
  modelLabel,
}: {
  subsystems: Subsystem[];
  robotName: string;
  modelLabel: string;
}) {
  const [active, setActive] = useState<SubsystemKey>("locomotion");
  const [canRender3D, setCanRender3D] = useState<boolean | null>(null);
  const [glLost, setGlLost] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setCanRender3D(webglAvailable());
  }, []);

  const anchors = useMemo(
    () =>
      subsystems.reduce(
        (acc, s) => {
          acc[s.key as SubsystemKey] = s.anchor;
          return acc;
        },
        {} as Record<SubsystemKey, [number, number, number]>
      ),
    [subsystems]
  );

  const current = subsystems.find((s) => s.key === active) ?? subsystems[0];

  const select = (key: SubsystemKey) => {
    setActive(key);
    const s = subsystems.find((x) => x.key === key);
    if (s) setAnnouncement(`${s.name} selected. ${s.summary}.`);
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = ORDER.length - 1;
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;

    e.preventDefault();
    const key = ORDER[next];
    select(key);
    tabRefs.current[key]?.focus();
  };

  const Fallback = (
    <div className="flex h-full w-full flex-col justify-center bg-paper-sunk p-5 md:p-7">
      <p className="meta uppercase tracking-[0.08em] text-steel-deep">
        {glLost ? "3D stopped" : "3D unavailable"}
      </p>
      <p className="title mt-2 text-ink">
        {glLost
          ? "The graphics context was lost"
          : "This browser cannot render the interactive assembly"}
      </p>
      <p className="body mt-2 max-w-prose text-steel-deep">
        {glLost
          ? "The browser dropped the WebGL context, usually to reclaim memory. Reload the page to restore the view."
          : "WebGL is unavailable, so the 3D view is switched off. Every subsystem is still listed and described beside it — nothing is lost."}
      </p>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      {/* ---------------- canvas ---------------- */}
      <div className="lg:col-span-7">
        <figure className="plate">
          <div className="plate-media aspect-[4/3] w-full">
            {canRender3D === null ? (
              <div className="grid h-full w-full place-items-center bg-paper-sunk">
                <p className="meta text-steel-deep">Preparing the 3D assembly…</p>
              </div>
            ) : canRender3D && !glLost ? (
              <SceneBoundary fallback={Fallback}>
                <RoverScene
                  selected={active}
                  onSelect={select}
                  anchors={anchors}
                  resetKey={resetKey}
                  onContextLost={() => setGlLost(true)}
                />
              </SceneBoundary>
            ) : (
              Fallback
            )}
          </div>
          <figcaption className="plate-caption">
            <span className="block">
              {modelLabel} — interactive assembly of {robotName}.
            </span>
            <span className="plate-note">
              Drag to orbit, scroll to zoom. Select a numbered marker or use the
              subsystem list. Dimensions are not to scale.
            </span>
            {canRender3D && !glLost ? (
              <button
                type="button"
                onClick={() => {
                  setResetKey((k) => k + 1);
                  setAnnouncement("Camera returned to the opening view.");
                }}
                className="meta mt-2 underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                Reset view
              </button>
            ) : null}
          </figcaption>
        </figure>
      </div>

      {/* ---------------- tablist + panel ---------------- */}
      <div className="lg:col-span-5">
        <div
          role="tablist"
          aria-label={`${robotName} subsystems`}
          aria-orientation="vertical"
          className="flex flex-col"
        >
          {subsystems.map((s, i) => {
            const isActive = s.key === active;
            return (
              <button
                key={s.key}
                ref={(el) => {
                  tabRefs.current[s.key] = el;
                }}
                role="tab"
                id={`tab-${s.key}`}
                aria-selected={isActive}
                aria-controls={`panel-${s.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(s.key as SubsystemKey)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`group flex items-start gap-3 border-b border-steel/50 py-3 text-left transition-colors ${
                  isActive ? "text-ink" : "text-steel-deep hover:text-ink"
                }`}
              >
                <span
                  className={`meta mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${
                    isActive
                      ? "border-lime-deep bg-lime text-ink"
                      : "border-steel text-steel-deep"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="ui block font-semibold">{s.name}</span>
                  <span className="meta block text-steel-deep">{s.summary}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
          className="mt-5 border-l-2 border-lime pl-4"
        >
          <h3 className="title">{current.name}</h3>
          <p className="body mt-2 text-steel-deep">{current.detail}</p>
        </div>

        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    </div>
  );
}
