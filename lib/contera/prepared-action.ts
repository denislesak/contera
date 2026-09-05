/**
 * Prepared Action — transcribed from context/components.md §2
 * (COMPONENT-PREPARED-ACTION). An agent-created artifact ready for human
 * inspection, editing, routing, authorization, handoff, or execution
 * (behaviors.md primitive 4 / PRIMITIVE-004) — deliberately separate from
 * Approval, which is the governance interaction over it, not the artifact
 * itself.
 */
import type { GovernanceOutcome, Id, ISODateTime } from "./shared-types";

export type PreparedActionStatus =
  | "draft"
  | "edited"
  | "stale"
  | "blockedByUnresolvedPolicy"
  | "awaitingGovernance"
  | "withdrawn"
  | "handedOff"
  | "executed"
  | "failed";

/**
 * [TYPE] It is a compile error to omit both sourceFindingId and
 * sourceRecommendationId — at least one is always required.
 */
export type PreparedActionSource =
  | { sourceFindingId: Id; sourceRecommendationId?: Id }
  | { sourceRecommendationId: Id; sourceFindingId?: Id };

export interface PreparedActionCore {
  preparedActionId: Id;
  actionType: string; // free-form, feature-defined; not enumerated here
  content: unknown; // shape depends on actionType, deliberately unconstrained

  editableFields: string[];

  /** [TYPE] present as a required field. [DOC] that the value assigned
   *  is actually correct per current policy — the type only constrains
   *  it to one of five literals. */
  requiredGovernanceOutcome: GovernanceOutcome;

  /** [TYPE] required array (may be empty). [GUARD] that its CONTENTS are
   *  accurate — the type system cannot verify real-world completeness. */
  mutableStateDependencies: string[];

  createdAt: ISODateTime;

  /** [TYPE] required, present. [GUARD] that it is actually rechecked
   *  immediately before execution — see mustRecheckBeforeExecution. */
  lastRevalidatedAt: ISODateTime;

  status: PreparedActionStatus;
  evidenceRefs?: Id[];
  handoffTargetActorId?: Id;

  /** [DOC] Whether/when a Prepared Action expires if undecided is
   *  UNRESOLVED policy (product.md has no timeout rule). Placeholder only —
   *  no expiry logic is implemented against this field. */
  expiresAt?: ISODateTime;
}

export type PreparedAction = PreparedActionCore & PreparedActionSource;

/**
 * [GUARD] Baseline transitions, ignoring the governance condition — plain
 * data, not compiler-enforced. See canAdvancePastPreparation for the
 * governance-sensitive check this table alone cannot express.
 */
export const PREPARED_ACTION_TRANSITIONS: Record<PreparedActionStatus, PreparedActionStatus[]> = {
  draft: ["edited", "stale", "awaitingGovernance", "blockedByUnresolvedPolicy", "executed", "withdrawn", "handedOff"],
  edited: ["stale", "awaitingGovernance", "blockedByUnresolvedPolicy", "executed", "withdrawn", "handedOff"],
  stale: ["draft", "edited", "withdrawn"],
  blockedByUnresolvedPolicy: ["withdrawn"],
  awaitingGovernance: ["executed", "withdrawn"],
  withdrawn: [],
  handedOff: [],
  executed: [],
  failed: [],
};

/**
 * [GUARD] Must be called before ever moving a PreparedAction to
 * "awaitingGovernance" or "executed". "UNRESOLVED" governance routes to
 * blockedByUnresolvedPolicy instead of being defaulted to ApprovalRequired
 * — treating UNRESOLVED as ApprovalRequired would itself be a fabricated
 * policy (Rule 008).
 */
export function canAdvancePastPreparation(a: PreparedActionCore): boolean {
  return a.requiredGovernanceOutcome !== "UNRESOLVED" && a.requiredGovernanceOutcome !== "Prohibited";
}

/**
 * [GUARD] Rule 009's actual conditional, not an unconditional "always true".
 */
export function revalidationRequired(a: Pick<PreparedActionCore, "mutableStateDependencies">): boolean {
  return a.mutableStateDependencies.length > 0;
}

/**
 * [GUARD] Must be invoked before any execution attempt when
 * revalidationRequired(a) is true.
 */
export function mustRecheckBeforeExecution(a: PreparedActionCore, nowCheck: () => boolean): boolean {
  if (!revalidationRequired(a)) return true; // Rule 009 not triggered
  return nowCheck();
}

/**
 * Feature 001 illustrative population of mutableStateDependencies
 * (context/components.md, "Feature 001 illustrative notes"; product.md
 * §7.1). Scoped to this one actionType — not a default for others.
 */
export const FEATURE_001_MUTABLE_STATE_DEPENDENCIES: string[] = [
  "rental.expectedReturnTime",
  "reservation.pickupTime",
  "equipment.assignment",
  "equipment.availabilityStatus",
  "turnaround.requiredTurnaroundTime",
];
