import { History } from "lucide-react";
import { SectionCard } from "./section-card";
import type { RentalFixture } from "@/lib/fixtures/feature-001-scenario";
import { fieldLabelClass } from "./governance-surface";
import { FIXTURE_TIME_ZONE } from "@/lib/feature-001/conflict-model";

export function ActivityCard({
  rental,
  extraEntries = [],
}: {
  rental: RentalFixture;
  extraEntries?: Array<{ actor: string; atIso: string; note: string }>;
}) {
  const entries = [...extraEntries, ...rental.activity];
  return (
    <SectionCard title="Activity" icon={<History />}>
      <p className="mb-4 text-sm text-threshold-gray-600">Notes and events logged against this rental, most recent first.</p>
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className={i > 0 ? "border-t border-threshold-gray-100 pt-4" : ""}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-threshold-gray-900">{entry.actor}</span>
              <span className={`${fieldLabelClass} shrink-0 normal-case tracking-normal`}>
                {new Date(entry.atIso).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: FIXTURE_TIME_ZONE,
                })}
              </span>
            </div>
            <p className="mt-1 text-sm text-threshold-gray-700">{entry.note}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
