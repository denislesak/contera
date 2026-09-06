import Link from "next/link";
import { RENTAL_FIXTURE } from "@/lib/fixtures/rental-fixture";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Contera</h1>
      <p className="text-muted-foreground text-sm">
        Application shell initialized.
      </p>
      <Link
        href={`/rentals/${RENTAL_FIXTURE.rentalId}`}
        className="text-sm font-medium text-threshold-accent-500 underline underline-offset-4"
      >
        Open Rental {RENTAL_FIXTURE.rentalId}
      </Link>
    </main>
  );
}
