"use client";

import { useEffect, useRef, useState } from "react";
import { RENTAL_FIXTURE } from "@/lib/fixtures/rental-fixture";
import { ReservationDetailBaseline } from "@/components/reservation-detail/reservation-detail-baseline";
import { Feature001ReservationDetail } from "@/components/reservation-detail/feature-001-reservation-detail";
import { buildFeatureReviewAnalysis } from "@/lib/contera/feature-review-analysis";
import { HarnessToolbar } from "./harness-toolbar";
import { ContereaPanel } from "./contera-panel";

export type ProductView = "current" | "proposed";
export type AnalysisStage = "idle" | "analyzing" | "complete";
export type HarnessDecision = "none" | "changes-requested" | "deferred" | "approved";

const PANEL_WIDTH = 460;
const REVEAL_INTERVAL_MS = 450;

/**
 * PRODUCT REVIEW HARNESS — the coded FEATURE REVIEW v1 demo. Not a
 * separate Contera application: it wraps the real, unmodified Equipmate
 * Reservation Detail artifact (ReservationDetailBaseline /
 * Feature001ReservationDetail) with a restrained toolbar and a Contera
 * side panel that compresses, rather than covers, the product while open.
 *
 * Owns all review-time state (which is a materially different concern
 * from FEATURE-001's own Approve & Send decision, which lives entirely
 * inside Feature001ReservationDetail/ConflictNotice and is untouched by
 * anything here — see the Boundary 1 / Boundary 2 distinction this harness
 * exists to preserve).
 */
export function ReviewHarness() {
  const [productView, setProductView] = useState<ProductView>("current");
  const [panelOpen, setPanelOpen] = useState(false);
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [revealedCount, setRevealedCount] = useState(0);
  const [decision, setDecision] = useState<HarnessDecision>("none");
  const [analysis] = useState(buildFeatureReviewAnalysis);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  function evaluateFeature() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage("analyzing");
    setRevealedCount(0);
    analysis.domains.forEach((_, i) => {
      const timer = setTimeout(
        () => {
          setRevealedCount(i + 1);
          if (i === analysis.domains.length - 1) setStage("complete");
        },
        REVEAL_INTERVAL_MS * (i + 1)
      );
      timers.current.push(timer);
    });
  }

  function reviewProposedChange() {
    setProductView("proposed");
    setPanelOpen(false);
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="transition-[margin-right] duration-300 ease-out"
        style={{ marginRight: panelOpen ? PANEL_WIDTH : 0 }}
      >
        <HarnessToolbar
          rentalId={RENTAL_FIXTURE.rentalId}
          productView={productView}
          onProductViewChange={setProductView}
          analysisStage={stage}
          decision={decision}
          onOpenPanel={() => setPanelOpen(true)}
        />

        <div className="mx-auto max-w-7xl px-6 py-8">
          {productView === "current" ? (
            <ReservationDetailBaseline rental={RENTAL_FIXTURE} />
          ) : (
            <Feature001ReservationDetail />
          )}
        </div>
      </div>

      <ContereaPanel
        open={panelOpen}
        width={PANEL_WIDTH}
        stage={stage}
        revealedCount={revealedCount}
        analysis={analysis}
        decision={decision}
        onEvaluate={evaluateFeature}
        onReviewProposedChange={reviewProposedChange}
        onDecision={setDecision}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  );
}
