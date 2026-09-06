"use client";

import { useState } from "react";
import { Info, Mail, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AgentActionState, ConflictAssessment } from "@/lib/feature-001/conflict-model";
import { formatTime } from "@/lib/format";
import type { Feature001ScenarioState } from "@/lib/feature-001/scenario-state";
import type { RentalFixture } from "@/lib/fixtures/rental-fixture";
import {
  governanceCardClass,
  resolvedGlyphClass,
  tierSignalIconSize,
  bodyClass,
  eyebrowClass,
  systematicClass,
} from "./governance-surface";
import { CONFLICT_NOTICE_BINDINGS } from "./conflict-notice.bindings";

/**
 * FEATURE-001 intelligent surface: Finding -> Recommendation -> Prepared
 * Action -> Approval, with Progress/revalidation state, per
 * context/features/feature-001-predicted-conflict.md and
 * context/behaviors.md primitives 1, 3, 4, 5, 8. See
 * conflict-notice.bindings.ts for the ContextBinding declarations.
 *
 * Visual tiering (design-system.md §3): the always-visible summary is
 * Finding/Recommendation content and stays neutral. Only the "Preview
 * message" disclosure — the actual drafted Prepared Action artifact — takes
 * the accent-200 treatment. accent-500 is reserved to the Approve/Send
 * action, per §1. This composes multiple tiers within one progressively
 * disclosed surface rather than applying one tier's treatment to the whole
 * card.
 *
 * Scope boundary: this component does not implement Resolution
 * Alternatives (PRIMITIVE-009) and does not claim to satisfy Rule 007 —
 * see conflict-notice.bindings.ts's header comment. It stops, as approved,
 * at preparing and (once a human approves) sending a confirmation-request
 * to the current renter only.
 */
export function ConflictNotice({
  rental,
  assessment,
  scenarioState,
  agentAction,
  minimized,
  onApprove,
  onDismiss,
  onReopen,
  onRecheck,
}: {
  rental: RentalFixture;
  assessment: ConflictAssessment;
  scenarioState: Feature001ScenarioState;
  agentAction: AgentActionState | null;
  minimized: boolean;
  onApprove: () => void;
  onDismiss: () => void;
  onReopen: () => void;
  onRecheck: () => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!agentAction || agentAction.inference.status === "superseded" || agentAction.preparedAction.status === "withdrawn") {
    return (
      <div className={`flex items-center gap-2 rounded-lg p-4 text-sm ${governanceCardClass.resolved}`}>
        <CheckCircle2 className={`${tierSignalIconSize} ${resolvedGlyphClass.ok}`} />
        <span className="text-threshold-gray-700">
          No scheduling conflict currently predicted for this rental.
          {agentAction?.preparedAction.status === "withdrawn" ? " (Prior predicted-conflict outreach was withdrawn — see Activity.)" : null}
        </span>
      </div>
    );
  }

  const { inference, observation, recommendation, preparedAction, approval } = agentAction;
  const isStale = approval.status === "stale";
  const isApproved = approval.status === "approved";
  const content = preparedAction.content as { to: string; channel: { value: string }; message: string };

  // Tightened top-level summary (Rule 011: show what's necessary to decide;
  // defer the rest). The full observation, including equivalent-equipment
  // availability, remains inspectable in "View details" below — nothing is
  // dropped, only deferred.
  const headline = `${rental.equipmentName} is due back at ${formatTime(scenarioState.scheduledReturnIso)}, and another reservation for the same equipment begins at ${formatTime(scenarioState.downstreamPickupTimeIso)}.`;

  if (minimized) {
    return (
      <button
        onClick={onReopen}
        className="flex w-full items-center gap-2 rounded-lg border border-threshold-gray-100 bg-threshold-surface p-3 text-left text-sm"
      >
        <Info className={`${tierSignalIconSize} text-threshold-gray-500 shrink-0`} />
        <span className="text-threshold-gray-700">Predicted scheduling conflict — action recommended.</span>
        <span className="ml-auto text-xs font-medium text-threshold-gray-500">Review</span>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-threshold-gray-100 bg-threshold-surface p-5">
      <div className="flex items-start gap-3">
        <Info className={`${tierSignalIconSize} text-threshold-gray-500 mt-0.5 shrink-0`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-threshold-gray-900">Possible scheduling conflict</p>
          <p className={`${bodyClass} mt-1`}>{headline}</p>

          {isApproved ? (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-threshold-ok">
              <CheckCircle2 className="size-4" /> Confirmation request approved and sent.
            </p>
          ) : (
            <>
              {isStale ? (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-threshold-gray-100 bg-threshold-surface-sunken p-3 text-sm">
                  <AlertCircle className="size-4 text-threshold-err mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-threshold-err">Facts changed since this was prepared — review before approving.</p>
                    {approval.revalidationResult?.changedFields?.length ? (
                      <ul className="mt-1 list-inside list-disc text-threshold-gray-700">
                        {approval.revalidationResult.changedFields.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <button
                  className="inline-flex items-center gap-1 text-threshold-gray-600 hover:text-threshold-gray-900"
                  onClick={() => setDetailsOpen((v) => !v)}
                >
                  View details {detailsOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>
                <button
                  className="inline-flex items-center gap-1 text-threshold-gray-600 hover:text-threshold-gray-900"
                  onClick={() => setPreviewOpen((v) => !v)}
                >
                  Preview message {previewOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                </button>
              </div>

              {detailsOpen ? (
                <div className="mt-3 space-y-3 rounded-md bg-threshold-surface-sunken p-3 text-sm">
                  <div>
                    <div className={eyebrowClass}>Known facts</div>
                    <p className={`${bodyClass} mt-1`}>{observation.statement}</p>
                  </div>
                  <div>
                    <div className={eyebrowClass}>Basis for prediction (inference — not a confirmed fact)</div>
                    <p className={`${bodyClass} mt-1`}>{inference.statement}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div>
                      <div className={eyebrowClass}>Evidentiary uncertainty</div>
                      <div className="mt-0.5 text-sm font-medium text-threshold-gray-800">{inference.evidentiaryUncertainty}</div>
                    </div>
                    <div>
                      <div className={eyebrowClass}>Estimated ready time</div>
                      <div className={`${systematicClass} mt-0.5`}>{formatTime(assessment.estimatedReadyTimeIso)}</div>
                    </div>
                    <div>
                      <div className={eyebrowClass}>Downstream pickup ({scenarioState.downstreamCustomerName})</div>
                      <div className={`${systematicClass} mt-0.5`}>{formatTime(scenarioState.downstreamPickupTimeIso)}</div>
                    </div>
                  </div>
                  <div>
                    <div className={eyebrowClass}>Recommendation</div>
                    <p className={`${bodyClass} mt-1`}>{recommendation.statement}</p>
                  </div>
                </div>
              ) : null}

              {previewOpen ? (
                <div className="mt-3 space-y-2 rounded-md border-l-[3px] border-l-threshold-accent-200 bg-threshold-surface-sunken p-3 text-sm">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Mail className="size-4 text-threshold-accent-200" />
                    <span className="text-xs font-medium uppercase tracking-wide text-threshold-accent-200">Prepared</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div>
                      <div className={eyebrowClass}>To</div>
                      <div className="mt-0.5 text-threshold-gray-800">{content.to}</div>
                    </div>
                    <div>
                      <div className={eyebrowClass}>Channel (fixture — channel policy unresolved)</div>
                      <div className="mt-0.5 text-threshold-gray-800 uppercase">{content.channel.value}</div>
                    </div>
                  </div>
                  <p className={bodyClass}>{content.message}</p>
                </div>
              ) : null}

              <div className="mt-4 flex items-center gap-2">
                {isStale ? (
                  <Button size="sm" onClick={onRecheck}>
                    Re-check facts
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-threshold-accent-500 text-white hover:bg-threshold-accent-500/90"
                    onClick={onApprove}
                  >
                    Approve &amp; Send
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={onDismiss}>
                  Not now
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Attaches this surface's ContextBinding declarations for runtime/audit inspection. */
ConflictNotice.contextBindings = CONFLICT_NOTICE_BINDINGS;
