import { redirect } from "next/navigation";
import { RENTAL_FIXTURE } from "@/lib/fixtures/rental-fixture";

/** Public entry point: send visitors straight into the Contera review harness. */
export default function Home() {
  redirect(`/review/rentals/${RENTAL_FIXTURE.rentalId}`);
}
