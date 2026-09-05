/**
 * Approval — transcribed from context/components.md §3 (COMPONENT-APPROVAL).
 * The governance interaction through which an authorized human permits or
 * rejects execution of a linked Prepared Action (behaviors.md primitive 5 /
 * PRIMITIVE-005) — distinguished from the Prepared Action itself.
 */
import type { Id, ISODateTime } from "./shared-types";
import type { Finding, EvidenceAvailability } from "./finding";
import type { PreparedActionCore } from "./prepared-action";

export type ApprovalStatus =
  | "pending"
  | "revalidating"
  | "stale"
  | "approved"
  | "rejected"
  | "expired";

export interface Approval {
  approvalId: Id;
  preparedActionId: Id;
  governanceBasis: string; // [DOC] that the cited basis is accurate
  status: ApprovalStatus;
  createdAt: ISODateTime;

  /** [GUARD], not [TYPE]. Computed via revalidationRequired() from the
   *  linked PreparedAction's mutableStateDependencies — nothing keeps this
   *  boolean in sync automatically. */
  revalidationRequired: boolean;

  /** [DOC] only. Authorization criteria for who may hold this field are
   *  UNRESOLVED at the general-policy level (product.md §9, full RBAC
   *  gap). Deliberately left undefined in this implementation — asserting
   *  a value here would invent the missing RBAC policy. */
  approverIdentity?: Id;

  decidedAt?: ISODateTime;
  revalidationResult?: { checkedAt: ISODateTime; stillValid: boolean; changedFields?: string[] };

  /** [DOC] — same unresolved-expiry caveat as PreparedAction.expiresAt. */
  expiresAt?: ISODateTime;
}

/**
 * [GUARD] Plain data; not compiler-enforced. "revalidating"/"stale" are
 * only reachable when revalidationRequired is true.
 */
export const APPROVAL_TRANSITIONS: Record<ApprovalStatus, ApprovalStatus[]> = {
  pending: ["revalidating", "approved", "rejected"],
  revalidating: ["pending", "stale"],
  stale: ["pending", "rejected", "expired"],
  approved: [],
  rejected: [],
  expired: [],
};

/**
 * [GUARD] Mirrors PreparedAction.revalidationRequired — conditional, not
 * universal.
 */
export function computeApprovalRevalidationRequired(
  preparedAction: Pick<PreparedActionCore, "mutableStateDependencies">
): boolean {
  return preparedAction.mutableStateDependencies.length > 0;
}

/**
 * [GUARD] Checks presence/absence, not sufficiency — sufficiency is a
 * human judgment, not a type-checkable one.
 */
export function describeEvidenceState(finding: Finding): EvidenceAvailability {
  return finding.evidenceAvailability;
}
