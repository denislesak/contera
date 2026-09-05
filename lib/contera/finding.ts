/**
 * Finding — transcribed from context/components.md §1 (COMPONENT-FINDING).
 * Represents Observe-tier content (behaviors.md primitive 1 / PRIMITIVE-001).
 * Keeps observation, comparison, and inference distinguishable per Rule 005;
 * never asserts an inference with more certainty than the evidence supports.
 */
import type { EvidentiaryUncertainty, Id, ISODateTime } from "./shared-types";

export type EpistemicStage = "observation" | "comparison" | "inference";
export type EvidenceAvailability = "unavailable" | "available" | "insufficient" | "conflicting";

/**
 * [TYPE] Compiler-enforced: a Finding cannot claim evidence is "available"
 * with zero evidenceRefs, nor "unavailable" while smuggling in references.
 */
export type EvidenceState =
  | { evidenceAvailability: "unavailable"; evidenceRefs: [] }
  | { evidenceAvailability: "available" | "insufficient" | "conflicting"; evidenceRefs: [Id, ...Id[]] };

export interface StatusHistoryEntry {
  status: "superseded" | "dismissed";
  actorId?: Id; // absent if the agent itself superseded it
  at: ISODateTime;
  reason?: string;
}

/**
 * [TYPE] statusHistory is required (non-empty) whenever status is not
 * "active", and disallowed while status is "active".
 */
export type FindingLifecycle =
  | { status: "active" }
  | { status: "superseded" | "dismissed"; statusHistory: [StatusHistoryEntry, ...StatusHistoryEntry[]] };

export type Finding = {
  findingId: Id;
  epistemicStage: EpistemicStage;
  statement: string; // [DOC] hedged language expected when epistemicStage === "inference"
  evidentiaryUncertainty: EvidentiaryUncertainty;
  sourceAgentActionId: Id;
  createdAt: ISODateTime;
  comparisonRefs?: { beforeEvidenceId: Id; afterEvidenceId: Id };
  limitations?: string[];
  supersedesFindingId?: Id;
  relatedFindingIds?: Id[];
} & EvidenceState & FindingLifecycle;

/**
 * [GUARD] Valid status transitions — plain data, only has effect if the
 * code mutating a Finding's status actually consults it first.
 */
export const FINDING_TRANSITIONS: Record<FindingLifecycle["status"], FindingLifecycle["status"][]> = {
  active: ["superseded", "dismissed"],
  superseded: [],
  dismissed: [],
};
