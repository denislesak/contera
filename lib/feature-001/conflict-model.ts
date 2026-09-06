/**
 * FEATURE-001 domain logic (predicted rental conflict outreach).
 * Ties context/data fixture state to the Finding / Prepared Action /
 * Approval component contracts (lib/contera/*) per
 * context/features/feature-001-predicted-conflict.md and product.md §7.1,
 * §8 (Scenario 001).
 *
 * Scope boundary (Rule 007 / PRIMITIVE-009, accepted in Context Analysis):
 * this module stops at preparing and — once approved — sending a
 * confirmation-request communication to the CURRENT renter. It does not,
 * and must not, propose substitute equipment, transfers, downstream-
 * customer contact, or schedule alternatives. context/behaviors.md's own
 * coverage matrix and context/evaluation/evaluation-system.md §4.9 record
 * this as a known, already-accepted gap against Rule 007 — it is not
 * resolved here, and no Resolution Alternatives primitive is implemented
 * by this module. Do not add one without a Product Context change.
 */
import type { Feature001ScenarioState } from "@/lib/feature-001/scenario-state";
import type { RentalFixture } from "@/lib/fixtures/rental-fixture";
import type { Finding } from "@/lib/contera/finding";
import {
  FEATURE_001_MUTABLE_STATE_DEPENDENCIES,
  type PreparedAction,
} from "@/lib/contera/prepared-action";
import { canAdvancePastPreparation, revalidationRequired } from "@/lib/contera/prepared-action";
import type { Approval } from "@/lib/contera/approval";
import { computeApprovalRevalidationRequired } from "@/lib/contera/approval";
import { formatTime } from "@/lib/format";

export interface Recommendation {
  recommendationId: string;
  statement: string;
  basedOnFindingId: string;
  rationale: string;
}

export interface ConflictAssessment {
  estimatedReadyTimeIso: string;
  conflictDetected: boolean;
  shortfallMinutes: number; // minutes the estimated ready time exceeds the downstream pickup time (<=0 means no shortfall)
}

/** product.md §2.2: Estimated Ready Time = Expected Return Time + Required Turnaround Time. */
export function computeEstimatedReadyTime(state: Feature001ScenarioState): string {
  const expected = new Date(state.expectedReturnTimeIso).getTime();
  const withTurnaround = expected + state.requiredTurnaroundMinutes.value * 60_000;
  return new Date(withTurnaround).toISOString();
}

/**
 * Feature 001's trigger condition (product.md §7.1): Estimated Ready Time
 * falls after the downstream reservation's pickup time for the same
 * Equipment/type, AND no equivalent equipment is currently available.
 */
export function assessConflict(state: Feature001ScenarioState): ConflictAssessment {
  const estimatedReadyTimeIso = computeEstimatedReadyTime(state);
  const readyMs = new Date(estimatedReadyTimeIso).getTime();
  const pickupMs = new Date(state.downstreamPickupTimeIso).getTime();
  const shortfallMinutes = Math.round((readyMs - pickupMs) / 60_000);
  const conflictDetected =
    state.equipmentAssignmentMatches && !state.equivalentEquipmentAvailable && readyMs > pickupMs;
  return { estimatedReadyTimeIso, conflictDetected, shortfallMinutes };
}

/**
 * Two Findings, matching Scenario 001's own "Important epistemic
 * distinctions" (product.md §8): known facts (observation) kept separate
 * from the historical-lateness-based prediction (inference), per Rule 005.
 */
export function buildFindings(
  rental: RentalFixture,
  state: Feature001ScenarioState,
  assessment: ConflictAssessment,
  nowIso: string
): { observation: Finding; inference: Finding } {
  const observation: Finding = {
    findingId: "finding-001-observation",
    epistemicStage: "observation",
    statement:
      `${rental.equipmentName} #${rental.unitId} is scheduled to return at ` +
      `${formatTime(state.scheduledReturnIso)}. A downstream reservation for the same ` +
      `equipment type is scheduled to begin at ${formatTime(state.downstreamPickupTimeIso)}. ` +
      `No equivalent unit is currently available.`,
    evidentiaryUncertainty: "Low",
    evidenceAvailability: "available",
    evidenceRefs: ["rental.scheduledReturn", "reservation.pickupTime", "equipment.availability"],
    sourceAgentActionId: "agent-action-feature-001",
    createdAt: nowIso,
    status: "active",
  };

  const inference: Finding = {
    findingId: "finding-001-inference",
    epistemicStage: "inference",
    statement:
      `This renter's average return has historically run ${state.historicalAverageLatenessMinutes} ` +
      `minutes late. Based on that pattern, the equipment may not be ready ` +
      `(estimated ${formatTime(assessment.estimatedReadyTimeIso)}) before the downstream ` +
      `reservation's ${formatTime(state.downstreamPickupTimeIso)} pickup. This is a prediction, ` +
      `not a confirmed outcome.`,
    evidentiaryUncertainty: "Moderate",
    evidenceAvailability: "available",
    evidenceRefs: ["customer.historicalLateness"],
    sourceAgentActionId: "agent-action-feature-001",
    createdAt: nowIso,
    status: "active",
    relatedFindingIds: [observation.findingId],
  };

  return { observation, inference };
}

export function buildRecommendation(inference: Finding, renterName: string): Recommendation {
  return {
    recommendationId: "recommendation-001",
    statement: `Contact ${renterName} to confirm the expected return time.`,
    basedOnFindingId: inference.findingId,
    rationale:
      "Confirming actual return intent resolves the material uncertainty before any consequential " +
      "step is taken, and does so without involving the downstream customer while the situation " +
      "remains a prediction rather than a confirmed conflict.",
  };
}

/**
 * The Prepared Action is constructed already carrying requiredGovernanceOutcome
 * = "ApprovalRequired" — Feature 001's Execute phase is resolved to Approval
 * Required (product.md §7.1); it is not left "UNRESOLVED" for this action.
 */
export function buildPreparedAction(
  rental: RentalFixture,
  state: Feature001ScenarioState,
  inference: Finding,
  recommendation: Recommendation,
  nowIso: string
): PreparedAction {
  const core = {
    preparedActionId: "prepared-action-001",
    actionType: "feature-001.predicted-conflict-outreach",
    content: {
      to: rental.customer.contactName,
      channel: state.communicationChannel,
      message:
        `Hi ${rental.customer.contactName.split(" ")[0]}, this is ${rental.branchName} confirming ` +
        `your ${rental.equipmentName} rental — could you confirm you're still on track to return by ` +
        `${formatTime(state.scheduledReturnIso)}? We have another reservation starting shortly after.`,
    },
    editableFields: ["message"],
    requiredGovernanceOutcome: "ApprovalRequired" as const,
    mutableStateDependencies: FEATURE_001_MUTABLE_STATE_DEPENDENCIES,
    createdAt: nowIso,
    lastRevalidatedAt: nowIso,
    status: "draft" as const,
    evidenceRefs: [inference.findingId],
  };

  const status = canAdvancePastPreparation(core) ? ("awaitingGovernance" as const) : ("blockedByUnresolvedPolicy" as const);

  return {
    ...core,
    status,
    sourceFindingId: inference.findingId,
    sourceRecommendationId: recommendation.recommendationId,
  };
}

export function buildApproval(preparedAction: PreparedAction, nowIso: string): Approval {
  return {
    approvalId: "approval-001",
    preparedActionId: preparedAction.preparedActionId,
    governanceBasis:
      "product.md §7.1 — Feature 001's Execute phase is Approval Required; an authorized human " +
      "must review and explicitly approve before the communication is sent.",
    status: "pending",
    createdAt: nowIso,
    revalidationRequired: computeApprovalRevalidationRequired(preparedAction),
  };
}

/** Snapshot of exactly the five Rule 009 dependencies, for later diffing. */
export interface DependencySnapshot {
  expectedReturnTimeIso: string;
  downstreamPickupTimeIso: string;
  equipmentAssignmentMatches: boolean;
  equivalentEquipmentAvailable: boolean;
  requiredTurnaroundMinutes: number;
}

export function snapshotDependencies(state: Feature001ScenarioState): DependencySnapshot {
  return {
    expectedReturnTimeIso: state.expectedReturnTimeIso,
    downstreamPickupTimeIso: state.downstreamPickupTimeIso,
    equipmentAssignmentMatches: state.equipmentAssignmentMatches,
    equivalentEquipmentAvailable: state.equivalentEquipmentAvailable,
    requiredTurnaroundMinutes: state.requiredTurnaroundMinutes.value,
  };
}

export interface RevalidationOutcome {
  changedFields: string[]; // names from FEATURE_001_MUTABLE_STATE_DEPENDENCIES
  conflictStillPresent: boolean;
}

/**
 * [GUARD] Rule 009: revalidate the five named dependencies immediately
 * before execution / whenever they may have changed since preparation.
 * Not called unless revalidationRequired(preparedAction) is true.
 */
export function checkRevalidation(
  snapshot: DependencySnapshot,
  current: Feature001ScenarioState
): RevalidationOutcome {
  const now = snapshotDependencies(current);
  const changedFields: string[] = [];
  if (now.expectedReturnTimeIso !== snapshot.expectedReturnTimeIso) {
    changedFields.push("rental.expectedReturnTime");
  }
  if (now.downstreamPickupTimeIso !== snapshot.downstreamPickupTimeIso) {
    changedFields.push("reservation.pickupTime");
  }
  if (now.equipmentAssignmentMatches !== snapshot.equipmentAssignmentMatches) {
    changedFields.push("equipment.assignment");
  }
  if (now.equivalentEquipmentAvailable !== snapshot.equivalentEquipmentAvailable) {
    changedFields.push("equipment.availabilityStatus");
  }
  if (now.requiredTurnaroundMinutes !== snapshot.requiredTurnaroundMinutes) {
    changedFields.push("turnaround.requiredTurnaroundTime");
  }
  return { changedFields, conflictStillPresent: assessConflict(current).conflictDetected };
}

/** The full set of records for one FEATURE-001 outreach episode. */
export interface AgentActionState {
  observation: Finding;
  inference: Finding;
  recommendation: Recommendation;
  preparedAction: PreparedAction;
  approval: Approval;
  snapshot: DependencySnapshot;
}

export function buildInitialAgentAction(
  rental: RentalFixture,
  state: Feature001ScenarioState,
  nowIso: string
): AgentActionState {
  const assessment = assessConflict(state);
  const { observation, inference } = buildFindings(rental, state, assessment, nowIso);
  const recommendation = buildRecommendation(inference, rental.customer.contactName);
  const preparedAction = buildPreparedAction(rental, state, inference, recommendation, nowIso);
  const approval = buildApproval(preparedAction, nowIso);
  return { observation, inference, recommendation, preparedAction, approval, snapshot: snapshotDependencies(state) };
}

export { revalidationRequired };
