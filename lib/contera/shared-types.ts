/**
 * Shared types from context/components.md, "Shared types". Transcribed
 * verbatim from the canonical schema — this file does not define new
 * product meaning, only the TypeScript shapes components.md already
 * specifies.
 */

/** [TYPE] as an enum of values; the requirement to be *present* is per-field. */
export type EvidentiaryUncertainty = "Low" | "Moderate" | "High";

/** "UNRESOLVED" is legitimate — see prepared-action.ts for how it must be handled. */
export type GovernanceOutcome =
  | "Permitted"
  | "ApprovalRequired"
  | "EscalationRequired"
  | "Prohibited"
  | "UNRESOLVED";

export type ISODateTime = string;
export type Id = string;
