"use client";

import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { metadataClass, systematicClass } from "@/components/reservation-detail/governance-surface";
import type { AnalysisStage, HarnessDecision, ProductView } from "./review-harness";

const DECISION_LABEL: Record<Exclude<HarnessDecision, "none">, string> = {
  approved: "Approved for development",
  "changes-requested": "Changes requested",
  deferred: "Deferred",
};

/**
 * Restrained chrome for the Product Review Harness — not Equipmate's
 * production UI (see review-harness.tsx). Provides the primary
 * CURRENT VERSION | PROPOSED CHANGE control and the entry point into the
 * Contera panel. Deliberately does not reuse or extend LeftNav — Contera
 * is a review-time layer, not an end-user Equipmate feature.
 */
export function HarnessToolbar({
  rentalId,
  productView,
  onProductViewChange,
  analysisStage,
  decision,
  onOpenPanel,
}: {
  rentalId: string;
  productView: ProductView;
  onProductViewChange: (view: ProductView) => void;
  analysisStage: AnalysisStage;
  decision: HarnessDecision;
  onOpenPanel: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 border-b border-threshold-gray-100 bg-threshold-surface/95 backdrop-blur-sm">
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <Layers className="size-3.5 shrink-0 text-threshold-gray-400" />
          <span className={cn(metadataClass, "truncate")}>
            Reviewing Reservation Detail — <span className={systematicClass}>{rentalId}</span>
          </span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {decision !== "none" ? (
            <span className="text-xs font-medium text-threshold-gray-600">{DECISION_LABEL[decision]}</span>
          ) : null}

          <div className="inline-flex overflow-hidden rounded-md border border-threshold-gray-200" role="group" aria-label="Product version">
            <button
              type="button"
              aria-pressed={productView === "current"}
              onClick={() => onProductViewChange("current")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors",
                productView === "current"
                  ? "bg-threshold-gray-900 text-white"
                  : "bg-threshold-surface text-threshold-gray-500 hover:text-threshold-gray-800"
              )}
            >
              Current version
            </button>
            <button
              type="button"
              aria-pressed={productView === "proposed"}
              disabled={decision !== "approved"}
              title={decision !== "approved" ? "Available once the direction is approved in Contera" : undefined}
              onClick={() => onProductViewChange("proposed")}
              className={cn(
                "border-l border-threshold-gray-200 px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors",
                decision !== "approved"
                  ? "cursor-not-allowed bg-threshold-surface text-threshold-gray-300"
                  : productView === "proposed"
                    ? "bg-threshold-gray-900 text-white"
                    : "bg-threshold-surface text-threshold-gray-500 hover:text-threshold-gray-800"
              )}
            >
              Proposed change
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenPanel}
            className="rounded-md bg-threshold-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-threshold-gray-900/90"
          >
            {analysisStage === "idle" ? "Evaluate New Feature" : "View Contera analysis"}
          </button>
        </div>
      </div>
    </div>
  );
}
