/**
 * Section through a collapsed floor — the hero plate.
 *
 * Per DESIGN.md §10: a collapsed slab, rubble, a smoke layer, and the clearance
 * a person cannot pass through. This shows the problem the team designs for, not
 * a machine the team did not build.
 *
 * Drawing conventions (DESIGN.md §10):
 *  - cut material hatched at 45°
 *  - voids left open
 *  - smoke is horizontal dashed haze, not a second hatch
 *  - the route is the only lime element
 *  - no dimension figures, because no measurement of the team's envelope is verified
 */
export function MissionSection({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-labelledby="mission-section-title mission-section-desc"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="mission-section-title">
        Section drawing through a collapsed floor
      </title>
      <desc id="mission-section-desc">
        A tilted concrete slab has fallen across a room, leaving a low void above
        a rubble pile. Smoke collects in the upper part of the void. A dashed
        route enters from the right, passes under the slab, and reaches the void.
        The gap between rubble and slab is too low for a person to pass.
      </desc>

      <defs>
        {/* Cut material: 45° hatch */}
        <pattern
          id="hatch45"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="var(--color-steel)"
            strokeWidth="1"
          />
        </pattern>

        <marker
          id="route-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--color-lime-deep)" />
        </marker>
      </defs>

      <rect width="800" height="500" fill="var(--color-paper)" />

      {/* ---- intact structure: two piers and the surviving floor edge ---- */}
      <g stroke="var(--color-ink)" strokeWidth="1.4" fill="none">
        {/* left pier */}
        <path d="M40 470 L40 150 L96 150 L96 470" fill="url(#hatch45)" />
        {/* right pier */}
        <path d="M704 470 L704 190 L760 190 L760 470" fill="url(#hatch45)" />
        {/* surviving upper floor on the right */}
        <path d="M560 190 L760 190 L760 214 L560 214 Z" fill="url(#hatch45)" />
      </g>

      {/* ---- collapsed slab, tilted ---- */}
      <g stroke="var(--color-ink)" strokeWidth="1.4">
        <path
          d="M96 236 L560 300 L560 330 L96 268 Z"
          fill="url(#hatch45)"
        />
      </g>

      {/* ---- rubble pile: irregular polygons, voids left open ---- */}
      <g
        stroke="var(--color-ink)"
        strokeWidth="1.4"
        fill="var(--color-paper-sunk)"
      >
        <path d="M96 470 L96 372 L150 340 L206 366 L232 340 L286 386 L286 470 Z" />
        <path d="M286 470 L286 398 L332 372 L386 404 L430 380 L470 420 L470 470 Z" />
        <path d="M470 470 L470 410 L520 388 L566 420 L612 396 L664 434 L664 470 Z" />
        <path d="M664 470 L664 432 L704 414 L704 470 Z" />
      </g>

      {/* ---- ground line ---- */}
      <line
        x1="24"
        y1="470"
        x2="776"
        y2="470"
        stroke="var(--color-ink)"
        strokeWidth="1.4"
      />

      {/* ---- smoke: horizontal dashed haze in the void ---- */}
      <g
        stroke="var(--color-steel)"
        strokeWidth="1"
        strokeDasharray="3 7"
        opacity="0.9"
      >
        <line x1="300" y1="352" x2="520" y2="352" />
        <line x1="288" y1="366" x2="540" y2="366" />
        <line x1="300" y1="380" x2="528" y2="380" />
        <line x1="316" y1="394" x2="508" y2="394" />
      </g>

      {/* ---- the route: the only lime element ---- */}
      <path
        d="M776 452 L700 452 L672 440 L640 452 L600 446 L560 452 L520 448 L486 440 L452 448"
        fill="none"
        stroke="var(--color-lime-deep)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="10 6"
        markerEnd="url(#route-arrow)"
      />

      {/* ---- the void: a pocket a person cannot reach ---- */}
      <g>
        <rect
          x="470"
          y="404"
          width="66"
          height="44"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
      </g>

      {/* ---- clearance bracket: labelled, never dimensioned ---- */}
      <g stroke="var(--color-ink)" strokeWidth="1.2" fill="none">
        <path d="M244 300 L244 344" />
        <path d="M238 306 L244 300 L250 306" />
        <path d="M238 338 L244 344 L250 338" />
      </g>

      {/* ---- labels ---- */}
      <g
        fill="var(--color-ink)"
        fontFamily="var(--font-archivo)"
        fontSize="12.5"
        fontWeight="500"
      >
        <text x="110" y="216">Collapsed slab</text>
        <text x="500" y="404">Void</text>
        <text x="300" y="330">Clearance</text>
        <text x="150" y="488">Rubble</text>
        <text x="392" y="374" textAnchor="middle" fill="var(--color-steel-deep)">
          Smoke layer
        </text>
        <text
          x="700"
          y="440"
          textAnchor="end"
          fill="var(--color-lime-deep)"
          fontWeight="600"
        >
          Route
        </text>
      </g>

      {/* ---- scale note, not a dimension figure ---- */}
      <text
        x="24"
        y="34"
        fill="var(--color-steel-deep)"
        fontFamily="var(--font-archivo)"
        fontSize="11.5"
        letterSpacing="0.06em"
      >
        SECTION A–A · NOT TO SCALE
      </text>
    </svg>
  );
}
