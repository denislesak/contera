import { LeftNav } from "@/components/app-shell/left-nav";

/**
 * Wraps the Product Review Harness with the same LeftNav shell as the
 * production /rentals/[id] route, so Equipmate looks identical whether
 * viewed there or inside this harness — the harness adds a toolbar and a
 * Contera panel on top of the real product, it does not present a
 * different product shell. No breadcrumb here: HarnessToolbar already
 * identifies the record being reviewed.
 */
export default function ReviewRentalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <LeftNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
