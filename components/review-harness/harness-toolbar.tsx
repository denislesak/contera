"use client";

import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { metadataClass, systematicClass } from "@/components/reservation-detail/governance-surface";
import type { AnalysisStage, HarnessDecision, ProductView } from "./review-harness";

const DECISION_LABEL: Record<Exclude<HarnessDecision, "none">, string> = {
  approved: "Direction approved",
  "changes-requested": "Changes requested",
  deferred: "Deferred",
};

/**
 * Restrained chrome for the Product Review Harness — not Equipmate's
 * production UI (see review-harness.tsx). Provides the primary
 * CURRENT VERSION | PROPOSED CHANGE control and the entry point into the
 * Contera panel. Deliberately does not reuse or extend LeftNav — Contera
 * is a review-time layer, not an end-user Equipmate feature.
 *
 * Public-demo orientation (state-dependent hierarchy): before the visitor
 * has opened the Contera panel (`analysisStage === "idle"`), a single
 * restrained line explains what Contera is about to do (with a "More info"
 * link out to the Figma design system) and a "Start here →" cue — the one
 * deliberate, looping animation on this page, per explicit design
 * direction — sits beside the primary CTA. Both disappear the moment the
 * visitor engages, since the button's own label ("View Contera analysis")
 * then carries that signal instead, and an unmounted looping animation
 * stops costing anything. Before a proposal is approved, no Current/
 * Proposed control renders at all — there is nothing to compare against
 * yet, so even a plain label would claim attention it hasn't earned; the
 * interactive two-segment toggle appears only once `decision === "approved"`.
 * The toggle itself, and everything it does, is unchanged; only when it
 * appears changes.
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
  const isIdle = analysisStage === "idle";
  const comparisonAvailable = decision === "approved";

  return (
    <div className="sticky top-0 z-10 border-b border-threshold-gray-100 bg-threshold-surface/95 backdrop-blur-sm">
      <div className="px-6 py-3">
        {isIdle ? (
          <p className="mb-2 text-xs text-threshold-gray-500">
            <span className="font-medium text-threshold-gray-700">Contera</span> — see how it evaluates a proposed
            product change against structured Context.{" "}
            <a
              href="https://www.figma.com/design/zyQrKCOyCFndnnzUn47VPp/Contera-design-system?node-id=9136-2275"
              target="_blank"
              rel="noopener noreferrer"
              className="text-threshold-gray-600 underline underline-offset-2 hover:text-threshold-gray-900"
            >
              More info
            </a>
          </p>
        ) : null}

        <div className="flex items-center gap-4">
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

            {comparisonAvailable ? (
              <div
                className="inline-flex overflow-hidden rounded-md border border-threshold-gray-200"
                role="group"
                aria-label="Product version"
              >
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
                  onClick={() => onProductViewChange("proposed")}
                  className={cn(
                    "border-l border-threshold-gray-200 px-3 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors",
                    productView === "proposed"
                      ? "bg-threshold-gray-900 text-white"
                      : "bg-threshold-surface text-threshold-gray-500 hover:text-threshold-gray-800"
                  )}
                >
                  Proposed change
                </button>
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              {isIdle ? (
                <span className="animate-in fade-in-80 slide-in-from-left-1 repeat-infinite text-xs font-semibold text-threshold-gray-900 duration-2000">
                  Start here →
                </span>
              ) : null}
              <button
                type="button"
                onClick={onOpenPanel}
                className="rounded-md bg-threshold-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-threshold-gray-900/90"
              >
                {isIdle ? "Evaluate New Feature" : "View Contera analysis"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
