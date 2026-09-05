/**
 * Governance-tier visual language — context/design-system.md §3 and §4.
 * Centralizes the tier -> class mapping so every consumer pulls from the
 * same source, per design-system.md's own version notes ("centralized in
 * GovernanceSurface's governanceIconClass/governanceLabelClass maps").
 *
 * Tiers: Finding/Recommendation (neutral), Prepared Action (accent-200
 * thread/icon/label, white surface, never a fill), Approval (accent-500
 * reserved to exactly the label and the Approve/Send action fill),
 * Resolved (neutral, ok/err glyph only, never a fill).
 */
export type GovernanceTier = "finding" | "prepared" | "approval" | "resolved";

export const governanceCardClass: Record<GovernanceTier, string> = {
  finding: "bg-threshold-surface border border-threshold-gray-100",
  prepared: "bg-threshold-surface border border-threshold-gray-100 border-l-[3px] border-l-threshold-accent-200",
  approval: "bg-threshold-surface border border-threshold-gray-100",
  resolved: "bg-threshold-gray-50 border border-threshold-gray-100",
};

export const governanceIconClass: Record<GovernanceTier, string> = {
  finding: "text-threshold-gray-500",
  prepared: "text-threshold-accent-200",
  approval: "text-threshold-accent-on-dark",
  resolved: "text-threshold-gray-500",
};

export const governanceLabelClass: Record<GovernanceTier, string> = {
  finding: "text-threshold-gray-500",
  prepared: "text-threshold-accent-200",
  approval: "text-threshold-accent-500",
  resolved: "text-threshold-gray-500",
};

/** Structural icons (chrome/orientation only) are always this treatment — never tier-colored. */
export const structuralIconClass = "size-4 text-threshold-gray-500";

/** Tier-signal icons carry the tier's color at size-5, per §4. */
export const tierSignalIconSize = "size-5";

/** Resolved-state glyphs — icon/text color only, never a background fill (§1). */
export const resolvedGlyphClass = {
  ok: "text-threshold-ok",
  err: "text-threshold-err",
};

/** Eyebrow / field-label voice — structural labels, never the value itself (design-system.md §2). */
export const eyebrowClass = "text-[11px] font-medium uppercase tracking-wide text-threshold-gray-500";

/**
 * Same Eyebrow voice, tuned quieter for dense repeated field grids (Equipment,
 * Customer, Pickup & Return, Payment & Deposit) so labels recede rather than
 * compete — design-system.md defines Eyebrow's role and case/tracking, not an
 * exact size/color, so this is a weight variant of the same voice, not a new
 * one. Reserve the stronger `eyebrowClass` for the header's hero region.
 */
export const fieldLabelClass = "text-[10px] font-medium uppercase tracking-wide text-threshold-gray-400";

/** Systematic voice — every value that is data rather than prose (design-system.md §2). */
export const systematicClass = "font-systematic tabular-nums text-threshold-gray-900";

/** Section label voice — card/section titles. */
export const sectionLabelClass = "font-display text-sm font-medium text-threshold-gray-900";

/** Display voice — the one hero title per screen. */
export const displayClass = "font-display text-2xl font-semibold tracking-tight text-threshold-gray-950";

/** Body voice — prose a human wrote as a sentence. */
export const bodyClass = "font-body text-sm text-threshold-gray-700";
