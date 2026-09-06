/**
 * FEATURE-001 scenario state — the mutable facts a predicted-conflict
 * outreach depends on. Mirrors product.md §8 Scenario 001 and the five
 * Rule 009 dependencies scoped in product.md §7.1 / feature-001-predicted-
 * conflict.md. This is implementation/test data, not product policy.
 *
 * "Expected Return Time" here is the agent's inference (scheduled return
 * plus this renter's historical average lateness), not the scheduled
 * return time itself — see product.md §2.2's Estimated Ready Time formula
 * and Scenario 001's own illustrative 10:47 AM + 30 min = 11:17 AM example,
 * which this fixture reproduces directly rather than inventing new numbers.
 */
import type { FixtureValue } from "@/lib/contera/fixture-value";

export interface Feature001ScenarioState {
  scheduledReturnIso: string; // known fact
  historicalAverageLatenessMinutes: number; // predictive evidence
  expectedReturnTimeIso: string; // inference: scheduledReturn + historical lateness
  downstreamReservationId: string;
  downstreamCustomerName: string;
  downstreamPickupTimeIso: string; // known fact
  equipmentAssignmentMatches: boolean; // whether Rental and downstream Reservation still resolve to the same Equipment/type
  equivalentEquipmentAvailable: boolean; // known fact
  requiredTurnaroundMinutes: FixtureValue<number>; // UNRESOLVED production calculation (product.md §2.2)
  communicationChannel: FixtureValue<"sms" | "email" | "call">; // UNRESOLVED general channel policy (product.md §7.2)
}

export const INITIAL_FEATURE_001_STATE: Feature001ScenarioState = {
  scheduledReturnIso: "2026-09-04T09:00:00-05:00",
  historicalAverageLatenessMinutes: 107, // 1 hour 47 minutes, per Scenario 001
  expectedReturnTimeIso: "2026-09-04T10:47:00-05:00",
  downstreamReservationId: "RES-100901",
  downstreamCustomerName: "Meridian Grading Co.",
  downstreamPickupTimeIso: "2026-09-04T11:00:00-05:00",
  equipmentAssignmentMatches: true,
  equivalentEquipmentAvailable: false,
  requiredTurnaroundMinutes: {
    value: 30,
    source: "fixture",
    policyStatus: "UNRESOLVED",
    note:
      "Required Turnaround Time's production calculation method (fixed value / varies by equipment type or condition / computed estimate) is UNRESOLVED (product.md §2.2). This 30-minute value reproduces Scenario 001's own illustrative example and is not a resolved policy value.",
  },
  communicationChannel: {
    value: "sms",
    source: "fixture",
    policyStatus: "UNRESOLVED",
    note:
      "Customer communication channel selection is UNRESOLVED general policy (product.md §7.2), unaffected by Feature 001's scoped Approval-Required decision. This value is a labeled prototype fixture, not a resolved channel policy.",
  },
};
