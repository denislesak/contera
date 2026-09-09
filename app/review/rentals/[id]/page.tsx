import { notFound } from "next/navigation";
import { RENTAL_FIXTURE } from "@/lib/fixtures/rental-fixture";
import { ReviewHarness } from "@/components/review-harness/review-harness";

/**
 * PRODUCT REVIEW HARNESS route — a Contera review workspace containing the
 * real Equipmate Reservation Detail surface, not a separate Contera page.
 * Additive only: /rentals/[id] is untouched by this route.
 */
export default async function ReviewRentalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id.toUpperCase() !== RENTAL_FIXTURE.rentalId) notFound();
  return <ReviewHarness />;
}
