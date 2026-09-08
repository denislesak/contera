import { CreditCard } from "lucide-react";
import { SectionCard } from "./section-card";
import { Field } from "./field";
import type { RentalFixture } from "@/lib/fixtures/rental-fixture";
import { metadataClass } from "./governance-surface";

export function PaymentDepositCard({ rental }: { rental: RentalFixture }) {
  const p = rental.payment;
  return (
    <SectionCard title="Payment & Deposit" icon={<CreditCard />}>
      {/* Each Field + its caption is an independent Related Stack (4px) —
          built as its own nested container, not a shared spacing value plus
          a compensating adjustment (design-system.md §6). */}
      <div className="space-y-1">
        <Field label="Deposit" systematic={false} emphasis value={`$${p.depositAmount.toFixed(2)}`} />
        <p className={metadataClass}>Held on file — {p.depositMethod}</p>
      </div>
      <div className="mt-3 space-y-1">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Estimated total" systematic={false} emphasis value={`$${p.estimatedTotal.toFixed(2)} + tax`} />
          <Field label="Paid to date" systematic={false} emphasis value={`$${p.paidToDate.toFixed(2)} (deposit only)`} />
        </div>
        <p className={metadataClass}>({p.estimatedRentalDays}-day rental)</p>
      </div>
      <div className="mt-6 border-t border-threshold-gray-100 pt-4">
        <Field
          label="Balance due"
          systematic={false}
          emphasis
          value={`$${(p.estimatedTotal - p.paidToDate).toFixed(2)} + tax, due at return`}
        />
      </div>
      <div className="mt-6 border-t border-threshold-gray-100 pt-4">
        <Field label="Invoice status" value={p.invoiceStatus} systematic={false} />
      </div>
    </SectionCard>
  );
}
