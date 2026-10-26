import type { ClaimStatus } from "@/content/types";

const labels: Record<ClaimStatus, string> = {
  verified: "Verified",
  "needs-review": "Needs review",
  planned: "Planned",
  unsupported: "Unsupported",
};

/**
 * Status chip — DESIGN.md §6.
 * The square carries the state by shape, so the chip is legible without colour:
 *   verified     filled square
 *   needs-review half-filled square
 *   unsupported  hollow square
 *   planned      dashed square
 */
export function StatusChip({
  status,
  label,
  className = "",
}: {
  status: ClaimStatus;
  label?: string;
  className?: string;
}) {
  const colorVar =
    status === "verified"
      ? "var(--color-verified)"
      : status === "needs-review"
        ? "var(--color-needs-review)"
        : status === "planned"
          ? "var(--color-draft)"
          : "var(--color-unverified)";

  return (
    <span
      className={`meta inline-flex items-center gap-1.5 border border-steel px-1.5 py-0.5 ${className}`}
      style={{ color: colorVar }}
    >
      <Mark status={status} />
      {label ?? labels[status]}
    </span>
  );
}

function Mark({ status }: { status: ClaimStatus }) {
  const c = "currentColor";
  if (status === "verified") {
    return (
      <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
        <rect x="0.5" y="0.5" width="10" height="10" fill={c} />
      </svg>
    );
  }
  if (status === "needs-review") {
    return (
      <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
        <rect x="0.5" y="0.5" width="10" height="10" fill="none" stroke={c} />
        <path d="M0.5 10.5 L10.5 0.5 L10.5 10.5 Z" fill={c} />
      </svg>
    );
  }
  if (status === "planned") {
    return (
      <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
        <rect
          x="0.5"
          y="0.5"
          width="10"
          height="10"
          fill="none"
          stroke={c}
          strokeDasharray="2 2"
        />
      </svg>
    );
  }
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true">
      <rect x="0.5" y="0.5" width="10" height="10" fill="none" stroke={c} />
    </svg>
  );
}
