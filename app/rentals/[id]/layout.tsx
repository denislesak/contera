import { LeftNav } from "@/components/app-shell/left-nav";
import { metadataClass } from "@/components/reservation-detail/governance-surface";
import { cn } from "@/lib/utils";

export default async function RentalsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen">
      <LeftNav />
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <p className={cn(metadataClass, "flex items-center gap-1.5")}>
            <span>Rentals</span>
            <span className="text-threshold-gray-300">/</span>
            <span className="font-systematic tabular-nums text-threshold-gray-700">{id.toUpperCase()}</span>
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
