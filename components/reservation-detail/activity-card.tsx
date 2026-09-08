import { History } from "lucide-react";
import { SectionCard } from "./section-card";
import type { RentalFixture } from "@/lib/fixtures/rental-fixture";
import { metadataClass } from "./governance-surface";
import { FIXTURE_TIME_ZONE } from "@/lib/format";
import { cn } from "@/lib/utils";

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
      <p className="mb-3 text-sm text-threshold-gray-600">Notes and events logged against this rental, most recent first.</p>
      {/* Distinct peers (16px) between entries — the sibling gap alone
          governs entry-to-entry separation; a divider must not also carry
          its own top padding, which previously doubled the gap to 32px. */}
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className={cn("space-y-1", i > 0 && "border-t border-threshold-gray-100 pt-1")}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-threshold-gray-900">{entry.actor}</span>
              {/* Systematic (design-system.md §2 v0.3): an audit/evidentiary
                  value where precise sequencing matters. Same 12px/gray-500
                  metadata size and color as before — Systematic inherits the
                  size of the role it plays, so this stays secondary. */}
              <span className={cn(metadataClass, "font-systematic tabular-nums shrink-0")}>
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
            <p className="text-sm text-threshold-gray-700">{entry.note}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
