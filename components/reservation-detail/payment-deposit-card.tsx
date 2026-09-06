import { CreditCard } from "lucide-react";
import { SectionCard } from "./section-card";
import { Field } from "./field";
import type { RentalFixture } from "@/lib/fixtures/rental-fixture";

export function PaymentDepositCard({ rental }: { rental: RentalFixture }) {
  const p = rental.payment;
  return (
    <SectionCard title="Payment & Deposit" icon={<CreditCard />}>
      <div className="space-y-4">
        <Field label="Deposit" systematic={false} emphasis value={`$${p.depositAmount.toFixed(2)}`} />
        <p className="-mt-2 text-xs text-threshold-gray-500">Held on file — {p.depositMethod}</p>
        <div className="grid grid-cols-2 gap-4 border-t border-threshold-gray-100 pt-4">
          <Field label="Estimated total" systematic={false} emphasis value={`$${p.estimatedTotal.toFixed(2)} + tax`} />
          <Field label="Paid to date" systematic={false} emphasis value={`$${p.paidToDate.toFixed(2)} (deposit only)`} />
        </div>
        <p className="-mt-2 text-xs text-threshold-gray-500">({p.estimatedRentalDays}-day rental)</p>
        <div className="border-t border-threshold-gray-100 pt-4">
          <Field
            label="Balance due"
            systematic={false}
            emphasis
            value={`$${(p.estimatedTotal - p.paidToDate).toFixed(2)} + tax, due at return`}
          />
        </div>
        <div className="border-t border-threshold-gray-100 pt-4">
          <Field label="Invoice status" value={p.invoiceStatus} systematic={false} />
        </div>
      </div>
    </SectionCard>
  );
}
