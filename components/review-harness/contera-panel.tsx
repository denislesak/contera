"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Layers, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { bodyClass, eyebrowClass, metadataClass, systematicClass } from "@/components/reservation-detail/governance-surface";
import { FEATURE_REQUEST, type DomainResult, type FeatureReviewAnalysis, type TraceEntry } from "@/lib/contera/feature-review-analysis";
import type { AnalysisStage, HarnessDecision } from "./review-harness";

const CONTEXT_SYSTEM_INTRO =
  "Structured product knowledge that gives AI enough context to reason about what to build, how it should behave, what it is permitted to do, and how its output should be evaluated.";

const DECISION_CONFIRMATION: Record<Exclude<HarnessDecision, "none">, string> = {
  approved: "Approved for development.",
  "changes-requested": "Changes requested.",
  deferred: "Deferred.",
};

/** One Level 2/3 traceability line — a real semantic ID, de-emphasized relative to the Level 1 finding above it. */
function TraceList({ title, entries }: { title: string; entries: TraceEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div>
      <div className={eyebrowClass}>{title}</div>
      <ul className="mt-1 space-y-1">
        {entries.map((entry, i) => (
          <li key={i} className="text-xs">
            <span className={cn(systematicClass, "text-threshold-gray-400")}>{entry.id}</span>
            <span className="text-threshold-gray-500"> — {entry.label}</span>
            {entry.detail ? <span className="text-threshold-gray-400">. {entry.detail}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * One Context domain's finding row. Content is fully computed ahead of
 * time (lib/contera/feature-review-analysis.ts); `revealed` only stages
 * when it becomes visible — this is a reveal of already-derived findings,
 * not a simulation of the agent "thinking." Level 1 (human findings) is
 * always visible once revealed; Level 2/3 (semantic IDs, exact citations)
 * sits behind its own "Inspect context" disclosure, deliberately lower in
 * visual priority than the finding it backs.
 */
function DomainRow({ domain, revealed }: { domain: DomainResult; revealed: boolean }) {
  const [traceOpen, setTraceOpen] = useState(false);

  return (
    <div
      aria-hidden={!revealed}
      className={cn(
        "rounded-lg border border-threshold-gray-100 bg-threshold-surface p-4 transition-all duration-300",
        revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
      )}
    >
      <div className="flex items-center gap-2">
        {domain.status === "clean" ? (
          <CheckCircle2 className="size-4 shrink-0 text-threshold-ok" />
        ) : (
          <TriangleAlert className="size-4 shrink-0 text-threshold-gray-500" />
        )}
        <span className="text-xs font-medium tracking-wide text-threshold-gray-900 uppercase">{domain.label}</span>
        <span className={cn(metadataClass, "ml-auto")}>{domain.status === "clean" ? "Checked" : "Needs human input"}</span>
      </div>
      <p className={cn(bodyClass, "mt-1.5 text-threshold-gray-500")}>{domain.question}</p>

      {revealed ? (
        <div className="mt-3 space-y-3 text-sm">
          {domain.checkedSummary ? <p className={cn(bodyClass, "text-threshold-gray-700")}>{domain.checkedSummary}</p> : null}

          <div>
            <div className={eyebrowClass}>{domain.findingsLabel}</div>
            <ul className="mt-1 space-y-1 text-threshold-gray-800">
              {domain.findings.map((item, i) => (
                <li key={i} className="flex gap-1.5">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-threshold-ok" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {domain.metric ? <p className={metadataClass}>{domain.metric}</p> : null}

          {domain.chain ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {domain.chain.map((step, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="rounded-md border border-threshold-gray-200 bg-threshold-surface-sunken px-2 py-1 text-xs font-medium text-threshold-gray-700">
                    {step}
                  </span>
                  {i < domain.chain!.length - 1 ? <ChevronRight className="size-3 text-threshold-gray-300" /> : null}
                </span>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setTraceOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium text-threshold-gray-500 hover:text-threshold-gray-800"
          >
            Inspect context {traceOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>

          {traceOpen ? (
            <div className="space-y-2 rounded-md bg-threshold-surface-sunken p-3">
              <TraceList title="Checked" entries={domain.trace.checked} />
              <TraceList title="Derived" entries={domain.trace.derived} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The Contera review workspace — a temporary side panel over the real
 * Equipmate artifact (review-harness.tsx keeps the product visible and
 * compresses it while this is open; this component never becomes a
 * separate page). Presentational only: all state lives in ReviewHarness.
 */
export function ContereaPanel({
  open,
  width,
  stage,
  revealedCount,
  analysis,
  decision,
  onEvaluate,
  onReviewProposedChange,
  onDecision,
  onClose,
}: {
  open: boolean;
  width: number;
  stage: AnalysisStage;
  revealedCount: number;
  analysis: FeatureReviewAnalysis;
  decision: HarnessDecision;
  onEvaluate: () => void;
  onReviewProposedChange: () => void;
  onDecision: (decision: HarnessDecision) => void;
  onClose: () => void;
}) {
  const { summaryMetrics } = analysis;

  return (
    <aside
      aria-hidden={!open}
      aria-label="Contera Feature Review"
      style={{ width }}
      className={cn(
        "fixed top-0 right-0 z-20 h-screen overflow-y-auto border-l border-threshold-gray-100 bg-threshold-surface transition-transform duration-300 ease-out",
        "shadow-[-8px_0_24px_-12px_rgba(16,16,20,0.16)]",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b border-threshold-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-threshold-gray-500" />
          <div>
            <div className="text-xs font-semibold tracking-wide text-threshold-gray-900 uppercase">Contera</div>
            <div className={metadataClass}>Feature Review</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Contera panel"
          className="rounded-md p-1.5 text-threshold-gray-400 hover:bg-threshold-gray-50 hover:text-threshold-gray-700"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-threshold-gray-100 px-5 py-3">
        <div>
          <div className={eyebrowClass}>Product</div>
          <div className="mt-0.5 text-sm text-threshold-gray-800">Equipmate</div>
        </div>
        <div>
          <div className={eyebrowClass}>Affected surface</div>
          <div className="mt-0.5 text-sm text-threshold-gray-800">Reservation Detail</div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {stage === "idle" ? (
          <div className="rounded-lg border border-threshold-gray-100 bg-threshold-surface-sunken p-4">
            <div className={eyebrowClass}>Feature request</div>
            <p className="mt-1.5 text-sm font-medium text-threshold-gray-900">{FEATURE_REQUEST.title}</p>
            <p className={cn(bodyClass, "mt-1.5")}>&ldquo;{FEATURE_REQUEST.request}&rdquo;</p>
            <Button size="sm" className="mt-4" onClick={onEvaluate}>
              Evaluate feature
            </Button>
          </div>
        ) : (
          <>
            <div>
              <div className="text-xs font-semibold tracking-wide text-threshold-gray-900 uppercase">
                Contera Context System
              </div>
              <p className={cn(bodyClass, "mt-1.5")}>{CONTEXT_SYSTEM_INTRO}</p>
              <p className={cn(metadataClass, "mt-2")}>
                Evaluating: <span className="text-threshold-gray-700">{FEATURE_REQUEST.title}</span>
              </p>
            </div>

            <div className="space-y-3">
              {analysis.domains.map((domain, i) => (
                <DomainRow key={domain.id} domain={domain} revealed={i < revealedCount} />
              ))}
            </div>

            {stage === "complete" ? (
              <>
                <div className="flex items-center gap-2 border-t border-threshold-gray-100 pt-4">
                  <CheckCircle2 className="size-5 shrink-0 text-threshold-ok" />
                  <div>
                    <div className="text-sm font-semibold text-threshold-gray-900">Analysis complete</div>
                    <p className={metadataClass}>
                      {summaryMetrics.domainsEvaluated} Context domains evaluated · {summaryMetrics.rulesApplied}{" "}
                      Experience Rules applied · {summaryMetrics.primitivesImplicated} interaction primitives
                      implicated · {summaryMetrics.unresolvedCount} unresolved decisions
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-threshold-gray-100 bg-threshold-surface-sunken p-4">
                  <div className={eyebrowClass}>What Contera derived</div>
                  <p className={cn(bodyClass, "mt-1.5")}>
                    The original feature request didn&rsquo;t specify these. Contera derived them from existing
                    product Context.
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-threshold-gray-800">
                    {analysis.derivedBehavior.map((item, i) => (
                      <li key={i} className="flex gap-1.5">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-threshold-ok" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-threshold-gray-100 bg-threshold-surface-sunken p-4">
                  <div className={eyebrowClass}>Remains unresolved</div>
                  <p className={cn(bodyClass, "mt-1.5")}>
                    Contera has enough Context to propose an experience while carrying these decisions forward,
                    rather than inventing an answer.
                  </p>
                  <ul className="mt-2 space-y-2.5 text-sm">
                    {analysis.unresolved.map((item) => (
                      <li key={item.id}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-threshold-gray-900">{item.title}</span>
                          <span className="shrink-0 rounded-full border border-threshold-gray-200 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-threshold-gray-500 uppercase">
                            Unresolved
                          </span>
                        </div>
                        <p className="text-threshold-gray-600">{item.question}</p>
                        <p className={cn(metadataClass, "mt-0.5")}>
                          <span className={systematicClass}>{item.id}</span> — {item.note}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 border-t border-threshold-gray-100 pt-4">
                  {decision === "none" ? (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => onDecision("changes-requested")}>
                        Request changes
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onDecision("deferred")}>
                        Defer
                      </Button>
                      <Button size="sm" className="ml-auto" onClick={() => onDecision("approved")}>
                        Approve direction
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-sm text-threshold-gray-700">
                        <CheckCircle2 className="size-4 text-threshold-ok" />
                        {DECISION_CONFIRMATION[decision]}
                      </div>
                      {decision === "approved" ? (
                        <Button size="sm" onClick={onReviewProposedChange} className="w-full justify-between">
                          Review proposed change <ChevronRight className="size-3.5" />
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </aside>
  );
}
