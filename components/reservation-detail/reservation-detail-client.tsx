import { RENTAL_FIXTURE } from "@/lib/fixtures/rental-fixture";
import { ReservationDetailBaseline } from "./reservation-detail-baseline";
import { Feature001ReservationDetail } from "./feature-001-reservation-detail";

/**
 * Activation boundary between the public baseline Reservation Detail
 * product and the FEATURE-001 (predicted scheduling conflict)-enhanced
 * experience. Defaults to baseline. FEATURE-001 remains fully intact — see
 * feature-001-reservation-detail.tsx — and simply isn't mounted (no state,
 * no ConflictNotice, no Test Controls) when this flag is off, so none of
 * its state initializes on the public default route.
 */
export function ReservationDetailClient({ enableFeature001 = false }: { enableFeature001?: boolean }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {enableFeature001 ? <Feature001ReservationDetail /> : <ReservationDetailBaseline rental={RENTAL_FIXTURE} />}
    </div>
  );
}
