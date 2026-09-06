import { notFound } from "next/navigation";
import { RENTAL_FIXTURE } from "@/lib/fixtures/rental-fixture";
import { ReservationDetailClient } from "@/components/reservation-detail/reservation-detail-client";

export default async function RentalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ feature001?: string }>;
}) {
  const { id } = await params;
  const { feature001 } = await searchParams;
  if (id.toUpperCase() !== RENTAL_FIXTURE.rentalId) {
    notFound();
  }
  // Public default route: baseline only. `?feature001=1` is a manual,
  // temporary activation hook for validating the FEATURE-001-enhanced
  // experience — not the future "Add a feature" demo flow itself.
  return <ReservationDetailClient enableFeature001={feature001 === "1"} />;
}
