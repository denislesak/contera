import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "./field";
import type { RentalFixture } from "@/lib/fixtures/rental-fixture";
import { displayClass, eyebrowClass, systematicClass } from "./governance-surface";
import { formatTime, FIXTURE_TIME_ZONE } from "@/lib/format";

/**
 * "Extend Rental" / "Add Note" and the rest of this header's CRUD affordances
 * carry no ContextBinding and are inert: no Context System behavior/rule
 * governs them, they are ordinary enterprise-surface chrome kept for
 * realism per the task's requested core areas, not FEATURE-001 behavior.
 */
export function RentalHeader({
  rental,
  scheduledReturnIso,
}: {
  rental: RentalFixture;
  scheduledReturnIso: string;
}) {
  return (
    <div className="rounded-lg border border-threshold-gray-100 bg-threshold-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className={eyebrowClass}>
            Rental <span className={systematicClass}>{rental.rentalId}</span> · from Reservation{" "}
            <span className={systematicClass}>{rental.reservationId}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <h1 className={displayClass}>{rental.equipmentName}</h1>
            <span className="rounded-full bg-threshold-gray-100 px-2 py-0.5 text-xs font-medium text-threshold-gray-700">
              {rental.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-threshold-gray-600">
            {rental.customerName} · {rental.branchName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Undo2 />
            Record Return
          </Button>
          <Button variant="outline" size="sm">
            Extend Rental
          </Button>
          <Button variant="outline" size="sm">
            Add Note
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-threshold-gray-100 pt-4 sm:grid-cols-4">
        <Field
          label="Rental start"
          systematic={false}
          value={new Date(rental.rentalStartIso).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: FIXTURE_TIME_ZONE,
          })}
        />
        {/* Hero Stat pattern (design-system.md §5) — this header's one validated usage. */}
        <div>
          <div className={eyebrowClass}>Scheduled return</div>
          <div className={`${systematicClass} mt-0.5 text-xl font-semibold`}>{formatTime(scheduledReturnIso)}</div>
        </div>
        <Field label="Rate" systematic={false} value={`$${rental.dailyRate.toFixed(2)} / day`} />
        <Field label="Job site" systematic={false} value={rental.jobSite} />
      </div>
    </div>
  );
}
