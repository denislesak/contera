import { User } from "lucide-react";
import { SectionCard } from "./section-card";
import { Field } from "./field";
import type { RentalFixture } from "@/lib/fixtures/rental-fixture";

export function CustomerCard({ rental }: { rental: RentalFixture }) {
  const c = rental.customer;
  return (
    <SectionCard title="Customer" icon={<User />}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-threshold-gray-100 text-xs font-medium text-threshold-gray-700">
          {c.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <p className="text-sm font-medium text-threshold-gray-900">{c.name}</p>
          <p className="text-sm text-threshold-gray-600">
            {c.segment} · Customer since <span className="font-systematic tabular-nums">{c.customerSince}</span>
          </p>
          <span className="mt-1 inline-block rounded-full bg-threshold-ok/10 px-2 py-0.5 text-xs font-medium text-threshold-ok">
            {c.standing}
          </span>
        </div>
      </div>
      <div className="space-y-3 border-t border-threshold-gray-100 pt-4">
        <Field label="Primary contact" value={c.contactName} systematic={false} />
        <Field label="Phone" value={c.phone} />
        <Field label="Email" value={c.email} systematic={false} />
      </div>
      <div className="mt-4 border-t border-threshold-gray-100 pt-4">
        <Field label="Billing address" value={c.billingAddress} systematic={false} />
      </div>
    </SectionCard>
  );
}
