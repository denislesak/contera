/**
 * Baseline rental record data for the public Reservation Detail product —
 * the ordinary equipment-rental record, with no FEATURE-001 (predicted
 * scheduling conflict) behavior attached. This is implementation/test data,
 * not product policy. No backend or database is used.
 */

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
