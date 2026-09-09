import { LayoutDashboard, ClipboardList, Truck, Users, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "rentals", label: "Rentals", icon: ClipboardList },
  { key: "fleet", label: "Fleet", icon: Truck },
  { key: "customers", label: "Customers", icon: Users },
  { key: "operations", label: "Operations", icon: Settings2 },
] as const;

/**
 * Minimal presentation-shell chrome around the Reservation Detail baseline —
 * not a real navigation system. Inert (no routing, no active-route
 * detection): "Rentals" is hardcoded active since this shell currently only
 * wraps that route. Active state uses neutral-ramp contrast only —
 * design-system.md §1 reserves accent-500/accent-200 to specific
 * governance-tier uses, not general nav selection.
 */
export function LeftNav() {
  return (
    <nav
      aria-label="Primary"
      className="flex w-16 shrink-0 flex-col items-center border-r border-threshold-gray-100 bg-threshold-surface py-4"
    >
      <div
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-md bg-threshold-gray-950 text-sm font-semibold text-white"
      >
        E
      </div>

      <div className="mt-8 flex flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === "rentals";
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex size-10 items-center justify-center rounded-md transition-colors",
                isActive
                  ? "bg-threshold-gray-100 text-threshold-gray-900"
                  : "text-threshold-gray-500 hover:text-threshold-gray-700"
              )}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>

      <div
        aria-label="Denis Lesak"
        className="mt-auto flex size-8 items-center justify-center rounded-full bg-threshold-gray-100 text-xs font-medium text-threshold-gray-700"
      >
        DL
      </div>
    </nav>
  );
}
