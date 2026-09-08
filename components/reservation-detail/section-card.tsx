import { sectionLabelClass } from "./governance-surface";
import { cn } from "@/lib/utils";

/**
 * Finding/Recommendation-tier neutral surface (design-system.md §3):
 * white, 1px gray-100 border, no shadow, no color. Used for the ordinary
 * record cards (Equipment, Customer, Pickup & Return, Payment & Deposit,
 * Activity) — none of these are governance-tier surfaces themselves.
 */
export function SectionCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-threshold-gray-100 bg-threshold-surface pt-6 pb-6 px-5", className)}>
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className={sectionLabelClass}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
