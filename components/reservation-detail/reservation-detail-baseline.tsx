import type { RentalFixture } from "@/lib/fixtures/rental-fixture";
import { RentalHeader } from "./rental-header";
import { EquipmentCard } from "./equipment-card";
import { CustomerCard } from "./customer-card";
import { PickupReturnCard } from "./pickup-return-card";
import { PaymentDepositCard } from "./payment-deposit-card";
import { ActivityCard } from "./activity-card";

/**
 * The public/default Reservation Detail experience — the ordinary
 * equipment-rental record, with no FEATURE-001 (predicted scheduling
 * conflict) behavior. See reservation-detail-client.tsx for the activation
 * boundary that switches between this and the FEATURE-001-enhanced view.
 */
export function ReservationDetailBaseline({ rental }: { rental: RentalFixture }) {
  return (
    <div className="space-y-6">
      <RentalHeader rental={rental} scheduledReturnIso={rental.scheduledReturnIso} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <EquipmentCard rental={rental} />
          <PickupReturnCard rental={rental} />
          <ActivityCard rental={rental} />
        </div>
        <div className="space-y-6">
          <CustomerCard rental={rental} />
          <PaymentDepositCard rental={rental} />
        </div>
      </div>
    </div>
  );
}
