import { Truck } from "lucide-react";
import { SectionCard } from "./section-card";
import { Field } from "./field";
import type { RentalFixture } from "@/lib/fixtures/feature-001-scenario";

export function EquipmentCard({ rental }: { rental: RentalFixture }) {
  return (
    <SectionCard title="Equipment" icon={<Truck />}>
      <p className="mb-4 text-sm text-threshold-gray-700">
        {rental.equipmentName} · Unit {rental.unitId}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" value={rental.category} systematic={false} />
        <Field label="Meter reading" value={`${rental.meterReadingHours.toFixed(1)} hrs (at checkout)`} />
        <Field label="Fuel level" value={rental.fuelLevel} systematic={false} />
        <Field label="Attachments included" value={rental.attachmentsIncluded} systematic={false} />
      </div>
      <div className="mt-4 border-t border-threshold-gray-100 pt-4">
        <Field label="Condition at checkout" value={rental.conditionAtCheckout} systematic={false} />
      </div>
    </SectionCard>
  );
}
