import { FlaskConical, RotateCcw } from "lucide-react";
import type { ScenarioControlKey } from "./feature-001-reservation-detail";

const CONTROLS: Array<{ key: ScenarioControlKey; label: string }> = [
  { key: "downstream-pickup-earlier", label: "Downstream reservation moves pickup earlier, to 10:30 AM" },
  { key: "turnaround-revised", label: "Branch revises the estimated preparation time to 75 minutes" },
  { key: "renter-early-return", label: "Renter calls in: dropping off early, by 8:20 AM" },
  { key: "equipment-reassigned", label: "Equipment assignment confirmed via internal transfer note" },
  { key: "equivalent-available", label: "An equivalent unit becomes available at the branch" },
];

/**
 * Prototype/evaluation affordance only — not part of the rental-product
 * experience. Deliberately styled to read as harness infrastructure (dashed
 * border, muted surface, plain-text rows) rather than product chrome, so it
 * doesn't compete visually with the real record. Mutates the underlying
 * FEATURE-001 scenario state (see reservation-detail-client.tsx) so the five
 * Rule 009 mutable-state dependencies can be exercised and their effect on
 * the intelligent experience observed directly.
 */
export function TestControlsPanel({
  onApply,
  onReset,
}: {
  onApply: (key: ScenarioControlKey) => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-threshold-gray-300 bg-threshold-surface-sunken p-5">
      <div className="mb-2 flex items-center gap-2">
        <FlaskConical className="size-3.5 text-threshold-gray-400" />
        <h2 className="text-xs font-medium uppercase tracking-wide text-threshold-gray-500">Test controls</h2>
      </div>
      <p className="mb-4 text-xs text-threshold-gray-500">
        Change the underlying facts to see how this approach responds to something changing before or during a
        decision. Not part of the experience being tested.
      </p>
      <div className="divide-y divide-threshold-gray-200">
        {CONTROLS.map((c) => (
          <button
            key={c.key}
            onClick={() => onApply(c.key)}
            className="block w-full py-2.5 text-left text-sm text-threshold-gray-600 hover:text-threshold-gray-900"
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-3 border-t border-threshold-gray-200 pt-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-threshold-gray-500 hover:text-threshold-gray-800"
        >
          <RotateCcw className="size-3.5" />
          Reset this scenario
        </button>
      </div>
    </div>
  );
}
