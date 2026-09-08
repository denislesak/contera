import { User } from "lucide-react";
import { SectionCard } from "./section-card";
import { Field } from "./field";
import { structuralIconClass } from "./governance-surface";
import type { RentalFixture } from "@/lib/fixtures/rental-fixture";

export function CustomerCard({ rental }: { rental: RentalFixture }) {
  const c = rental.customer;
  return (
    <SectionCard title="Customer" icon={<User className={structuralIconClass} />}>
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-threshold-gray-100 text-xs font-medium text-threshold-gray-700">
          {c.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        {/* Related Stack (design-system.md §6, 4px) — name, tenure, and
            standing together form one identity unit. */}
        <div className="space-y-1">
          <p className="text-base font-medium text-threshold-gray-900">{c.name}</p>
          <p className="text-sm text-threshold-gray-600">
            {c.segment} · Customer since <span className="font-systematic tabular-nums">{c.customerSince}</span>
          </p>
          {/* Resolved-state glyph is icon/text color only, never a fill
              (design-system.md §1) — neutral pill background, ok-colored text. */}
          <span className="inline-block rounded-full bg-threshold-gray-100 px-2 py-0.5 text-xs font-medium text-threshold-ok">
            {c.standing}
          </span>
        </div>
      </div>
      <div className="mt-6 space-y-3 border-t border-threshold-gray-100 pt-4">
        <Field label="Primary contact" value={c.contactName} systematic={false} />
        <Field label="Phone" value={c.phone} />
        <Field label="Email" value={c.email} systematic={false} />
      </div>
      <div className="mt-6 border-t border-threshold-gray-100 pt-4">
        <Field label="Billing address" value={c.billingAddress} systematic={false} />
      </div>
    </SectionCard>
  );
}
