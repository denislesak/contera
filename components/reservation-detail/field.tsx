import { fieldLabelClass, systematicClass, bodyClass } from "./governance-surface";
import { cn } from "@/lib/utils";

/**
 * Eyebrow label + value pair. `systematic` (default true) renders the
 * value in the Systematic (mono, tabular) voice — reserved for values that
 * genuinely benefit from machine/data readability (IDs, meter readings,
 * phone numbers, compact timestamps), not merely because a value is
 * technically "data." Prose-adjacent values (addresses, compound
 * descriptive strings, dates written as phrases) should pass
 * `systematic={false}`. `emphasis` bumps the (non-systematic) value's
 * weight/color for figures that still deserve visual prominence without
 * mono treatment, e.g. currency summaries.
 */
export function Field({
  label,
  value,
  systematic = true,
  emphasis = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  systematic?: boolean;
  emphasis?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className={fieldLabelClass}>{label}</div>
      <div
        className={cn(
          systematic ? systematicClass : bodyClass,
          // Secondary/supporting content (design-system.md §2 point-size scale,
          // 14px) — the size ordinary field values play here. Set locally
          // (not on the shared systematicClass) since this component is
          // baseline-only and systematicClass is also reused where a
          // different role/size may apply (e.g. the header's Hero Stat).
          systematic && "text-sm",
          !systematic && emphasis && "font-medium text-threshold-gray-900",
          "mt-0.5"
        )}
      >
        {value}
      </div>
    </div>
  );
}
