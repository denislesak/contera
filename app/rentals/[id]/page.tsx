import { notFound } from "next/navigation";
import { RENTAL_FIXTURE } from "@/lib/fixtures/feature-001-scenario";
import { ReservationDetailClient } from "@/components/reservation-detail/reservation-detail-client";

export default async function RentalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id.toUpperCase() !== RENTAL_FIXTURE.rentalId) {
    notFound();
  }
  return <ReservationDetailClient />;
}
