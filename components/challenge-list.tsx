/**
 * Scene 02 — the human problem.
 *
 * Four physical constraints of urban search and rescue, each disclosing what it
 * implies for the machine. Native <details> so it works with no JavaScript and
 * is keyboard operable by default.
 */
const challenges = [
  {
    key: "access",
    label: "Access",
    lead: "A gap that a person cannot pass is still a gap a robot might.",
    body: "Collapsed floors leave voids measured in centimetres, not doorways. The platform must be low enough and narrow enough to enter, and must carry its own light into the space.",
    implication: "Low profile, narrow track width, on-board illumination.",
  },
  {
    key: "rubble",
    label: "Rubble",
    lead: "The floor is no longer a floor.",
    body: "Broken slab, brick, furniture and glass form an irregular surface with no reliable flat plane. Wheeled platforms stall on step edges that a tracked platform can articulate over.",
    implication: "Tracks with active flippers rather than fixed wheels.",
  },
  {
    key: "visibility",
    label: "Visibility",
    lead: "The camera sees dust, not the room.",
    body: "Airborne dust and smoke scatter light. A single forward camera returns a bright wall of haze; depth sensing degrades with the same conditions.",
    implication: "Multiple sensing modalities and the expectation of degraded data.",
  },
  {
    key: "communications",
    label: "Communications",
    lead: "Concrete attenuates radio, and the operator is outside.",
    body: "Signal falls away quickly through reinforced concrete and rubble. The link cannot be assumed, so the machine must remain recoverable when the operator loses sight of it.",
    implication: "Teleoperation with a documented recovery procedure.",
  },
] as const;

export function ChallengeList() {
  return (
    <div className="divide-y divide-steel/50 border-y border-steel/50">
      {challenges.map((c) => (
        <details key={c.key} className="group">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <span className="flex items-baseline gap-3">
              <span className="ui font-semibold text-ink">{c.label}</span>
              <span
                className="hidden text-steel-deep sm:inline"
                style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}
              >
                {c.lead}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="meta grid h-6 w-6 shrink-0 place-items-center border border-steel text-steel-deep transition-transform duration-150 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="pb-5 sm:pl-0">
            <p className="body max-w-prose text-steel-deep">{c.body}</p>
            <p className="meta mt-3 text-ink">
              <span className="text-steel-deep">Engineering implication · </span>
              {c.implication}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
