/**
 * Local fixture data for Reservation Detail / FEATURE-001, modeled on
 * context/product.md §8 Scenario 001 ("Predicted inventory collision") and
 * context/data/evaluation-scenarios.json's EVAL-001 record.
 *
 * This is implementation/test data, not product policy (per the task
 * instructions this file responds to). No backend or database is used.
 * Two fields are UNRESOLVED product policy and are represented with the
 * FixtureValue<T> convention (context/components.md) rather than as
 * resolved values: Required Turnaround Time's production calculation
 * (product.md §2.2) and the customer communication channel (product.md
 * §7.2).
 */
import type { FixtureValue } from "@/lib/contera/fixture-value";

export interface RentalFixture {
  rentalId: string;
  reservationId: string;
  equipmentName: string;
  unitId: string;
  category: string;
  status: string;
  customerName: string;
  branchName: string;
  rentalStartIso: string;
  scheduledReturnIso: string;
  dailyRate: number;
  jobSite: string;
  meterReadingHours: number;
  fuelLevel: string;
  attachmentsIncluded: string;
  conditionAtCheckout: string;
  pickupBranch: string;
  returnBranch: string;
  pickupTimeIso: string;
  deliveryMethod: string;
  poReference: string;
  damageWaiver: string;
  customer: {
    name: string;
    segment: string;
    customerSince: number;
    standing: string;
    contactName: string;
    phone: string;
    email: string;
    billingAddress: string;
  };
  payment: {
    depositAmount: number;
    depositMethod: string;
    estimatedTotal: number;
    estimatedRentalDays: number;
    paidToDate: number;
    invoiceStatus: string;
  };
  activity: Array<{
    actor: string;
    atIso: string;
    note: string;
  }>;
}

export const RENTAL_FIXTURE: RentalFixture = {
  rentalId: "RNT-104421",
  reservationId: "RES-100822",
  equipmentName: "Bobcat T66",
  unitId: "T66-4421",
  category: "Compact Track Loaders",
  status: "Checked Out",
  customerName: "Bob's Construction",
  branchName: "Eastside Branch",
  rentalStartIso: "2026-09-01T07:50:00-05:00",
  scheduledReturnIso: "2026-09-04T09:00:00-05:00",
  dailyRate: 410,
  jobSite: "Harbor View Apartments — Phase 2",
  meterReadingHours: 886.2,
  fuelLevel: "Full (at checkout)",
  attachmentsIncluded: "Standard bucket",
  conditionAtCheckout: "Good — no visible damage noted",
  pickupBranch: "Eastside Branch",
  returnBranch: "Eastside Branch",
  pickupTimeIso: "2026-09-01T07:50:00-05:00",
  deliveryMethod: "Counter pickup",
  poReference: "PO# 48810",
  damageWaiver: "Rental Protection Plan — accepted",
  customer: {
    name: "Bob's Construction",
    segment: "Commercial — Net 30",
    customerSince: 2019,
    standing: "Good standing",
    contactName: "Bob Whitaker",
    phone: "(555) 340-2261",
    email: "bob@bobsconstructionllc.com",
    billingAddress: "1180 Foundry St, Springfield, IL 62703",
  },
  payment: {
    depositAmount: 400,
    depositMethod: "Mastercard ending 7723",
    estimatedTotal: 1640,
    estimatedRentalDays: 4,
    paidToDate: 400,
    invoiceStatus: "Not yet invoiced — generated at check-in",
  },
  activity: [
    {
      actor: "System",
      atIso: "2026-09-03T16:05:00-05:00",
      note: "Reminder sent: return scheduled for tomorrow morning.",
    },
    {
      actor: "J. Whitfield (Counter)",
      atIso: "2026-09-01T07:50:00-05:00",
      note: "Equipment checked out. Checkout inspection completed — condition: Good.",
    },
    {
      actor: "Bob Whitaker (Phone)",
      atIso: "2026-08-28T11:20:00-05:00",
      note: "Reservation RES-100822 created for Bobcat T66, pickup Sep 1.",
    },
  ],
};

/**
 * Feature 001 scenario state — the mutable facts a predicted-conflict
 * outreach depends on. Mirrors product.md §8 Scenario 001 and the five
 * Rule 009 dependencies scoped in product.md §7.1 / feature-001-predicted-
 * conflict.md.
 *
 * "Expected Return Time" here is the agent's inference (scheduled return
 * plus this renter's historical average lateness), not the scheduled
 * return time itself — see product.md §2.2's Estimated Ready Time formula
 * and Scenario 001's own illustrative 10:47 AM + 30 min = 11:17 AM example,
 * which this fixture reproduces directly rather than inventing new numbers.
 */
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
