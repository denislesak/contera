import { CalendarClock } from "lucide-react";
import { SectionCard } from "./section-card";
import { Field } from "./field";
import type { RentalFixture } from "@/lib/fixtures/feature-001-scenario";
import { formatTime } from "@/lib/feature-001/conflict-model";

export function PickupReturnCard({ rental }: { rental: RentalFixture }) {
  return (
    <SectionCard title="Pickup & Return" icon={<CalendarClock />}>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Pickup branch" value={rental.pickupBranch} systematic={false} />
        <Field label="Return branch" value={rental.returnBranch} systematic={false} />
        <Field label="Pickup time" value={formatTime(rental.pickupTimeIso)} systematic={false} />
        <Field label="Delivery method" value={rental.deliveryMethod} systematic={false} />
        <Field label="Rate" value={`Daily rate — $${rental.dailyRate.toFixed(2)} / day`} systematic={false} />
        <Field label="Damage waiver" value={rental.damageWaiver} systematic={false} />
        <Field label="PO / reference" value={rental.poReference} />
        <Field label="Job site" value={rental.jobSite} systematic={false} />
      </div>
    </SectionCard>
  );
}
