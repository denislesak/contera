"use client";

import { useState } from "react";
import { RENTAL_FIXTURE, INITIAL_FEATURE_001_STATE, type Feature001ScenarioState } from "@/lib/fixtures/feature-001-scenario";
import {
  assessConflict,
  buildInitialAgentAction,
  checkRevalidation,
  snapshotDependencies,
  type AgentActionState,
} from "@/lib/feature-001/conflict-model";
import { mustRecheckBeforeExecution } from "@/lib/contera/prepared-action";
import { RentalHeader } from "./rental-header";
import { ConflictNotice } from "./conflict-notice";
import { EquipmentCard } from "./equipment-card";
import { CustomerCard } from "./customer-card";
import { PickupReturnCard } from "./pickup-return-card";
import { PaymentDepositCard } from "./payment-deposit-card";
import { ActivityCard } from "./activity-card";
import { TestControlsPanel } from "./test-controls-panel";

export type ScenarioControlKey =
  | "downstream-pickup-earlier"
  | "turnaround-revised"
  | "renter-early-return"
  | "equipment-reassigned"
  | "equivalent-available";

type ActivityEntry = { actor: string; atIso: string; note: string };

function applyControlToState(state: Feature001ScenarioState, key: ScenarioControlKey): Feature001ScenarioState {
  switch (key) {
    case "downstream-pickup-earlier":
      return { ...state, downstreamPickupTimeIso: "2026-09-04T10:30:00-05:00" };
    case "turnaround-revised":
      return { ...state, requiredTurnaroundMinutes: { ...state.requiredTurnaroundMinutes, value: 75 } };
    case "renter-early-return":
      return { ...state, expectedReturnTimeIso: "2026-09-04T08:20:00-05:00" };
    case "equipment-reassigned":
      return { ...state, equipmentAssignmentMatches: false };
    case "equivalent-available":
      return { ...state, equivalentEquipmentAvailable: true };
  }
}

function buildAgentActionForState(state: Feature001ScenarioState): AgentActionState | null {
  return assessConflict(state).conflictDetected
    ? buildInitialAgentAction(RENTAL_FIXTURE, state, new Date().toISOString())
    : null;
}

/**
 * Rule 009: revalidate the five mutable-state dependencies whenever the
 * scenario state changes, for as long as the Approval is still pending.
 * Pure function, called directly from the event handler that changed
 * scenarioState — not reactively synced via a useEffect.
 *
 * components.md, Approval "Revalidation requirements": a changed
 * dependency moves Approval pending -> stale and the Prepared Action back
 * to "edited" for re-review; a fully dissolved trigger condition withdraws
 * the Prepared Action and supersedes the Finding outright.
 */
function deriveNextAgentAction(
  prev: AgentActionState | null,
  nextState: Feature001ScenarioState
): { next: AgentActionState | null; activityEntry: ActivityEntry | null } {
  if (!prev) {
    return { next: buildAgentActionForState(nextState), activityEntry: null };
  }
  if (prev.approval.status === "approved" || prev.preparedAction.status === "executed") {
    return { next: prev, activityEntry: null }; // already executed — a historical record
  }
  const outcome = checkRevalidation(prev.snapshot, nextState);
  if (outcome.changedFields.length === 0) {
    return { next: prev, activityEntry: null };
  }

  const nowIso = new Date().toISOString();
  if (!outcome.conflictStillPresent) {
    const reason = `Trigger condition no longer holds (changed: ${outcome.changedFields.join(", ")}).`;
    return {
      next: {
        ...prev,
        inference: {
          ...prev.inference,
          status: "superseded" as const,
          statusHistory: [{ status: "superseded" as const, at: nowIso, reason }],
        },
        preparedAction: { ...prev.preparedAction, status: "withdrawn" as const },
        approval: {
          ...prev.approval,
          status: "stale" as const,
          revalidationResult: { checkedAt: nowIso, stillValid: false, changedFields: outcome.changedFields },
        },
      },
      activityEntry: { actor: "Operations Agent", atIso: nowIso, note: `Predicted-conflict outreach withdrawn — ${reason}` },
    };
  }

  return {
    next: {
      ...prev,
      preparedAction: { ...prev.preparedAction, status: "edited" as const, lastRevalidatedAt: nowIso },
      approval: {
        ...prev.approval,
        status: "stale" as const,
        revalidationResult: { checkedAt: nowIso, stillValid: false, changedFields: outcome.changedFields },
      },
    },
    activityEntry: null,
  };
}

export function ReservationDetailClient() {
  const [scenarioState, setScenarioState] = useState<Feature001ScenarioState>(INITIAL_FEATURE_001_STATE);
  const [agentAction, setAgentAction] = useState<AgentActionState | null>(() =>
    buildAgentActionForState(INITIAL_FEATURE_001_STATE)
  );
  const [minimized, setMinimized] = useState(false);
  const [extraActivity, setExtraActivity] = useState<ActivityEntry[]>([]);

  const assessment = assessConflict(scenarioState);

  function applyControl(key: ScenarioControlKey) {
    const nextState = applyControlToState(scenarioState, key);
    const { next, activityEntry } = deriveNextAgentAction(agentAction, nextState);
    setScenarioState(nextState);
    setAgentAction(next);
    if (activityEntry) setExtraActivity((log) => [activityEntry, ...log]);
  }

  function resetScenario() {
    setScenarioState(INITIAL_FEATURE_001_STATE);
    setAgentAction(buildAgentActionForState(INITIAL_FEATURE_001_STATE));
    setMinimized(false);
    setExtraActivity([]);
  }

  function approveAndSend() {
    if (!agentAction || agentAction.preparedAction.status !== "awaitingGovernance") return;
    const nowIso = new Date().toISOString();
    // Rule 009: recheck immediately before execution, not only reactively on state change.
    const outcome = checkRevalidation(agentAction.snapshot, scenarioState);
    const canExecute = mustRecheckBeforeExecution(
      agentAction.preparedAction,
      () => outcome.changedFields.length === 0 && outcome.conflictStillPresent
    );
    if (!canExecute) {
      setAgentAction({
        ...agentAction,
        preparedAction: {
          ...agentAction.preparedAction,
          status: outcome.conflictStillPresent ? ("edited" as const) : ("withdrawn" as const),
        },
        approval: {
          ...agentAction.approval,
          status: "stale" as const,
          revalidationResult: { checkedAt: nowIso, stillValid: false, changedFields: outcome.changedFields },
        },
      });
      return;
    }
    const content = agentAction.preparedAction.content as { to: string; channel: { value: string } };
    setExtraActivity((log) => [
      {
        actor: "Operations Agent",
        atIso: nowIso,
        note: `Approved & sent predicted-conflict confirmation request to ${content.to} via ${content.channel.value.toUpperCase()}.`,
      },
      ...log,
    ]);
    setAgentAction({
      ...agentAction,
      preparedAction: { ...agentAction.preparedAction, status: "executed" as const },
      approval: {
        ...agentAction.approval,
        status: "approved" as const,
        decidedAt: nowIso,
        revalidationResult: { checkedAt: nowIso, stillValid: true },
      },
    });
  }

  function recheckFacts() {
    if (!agentAction || agentAction.preparedAction.status !== "edited") return;
    const nowIso = new Date().toISOString();
    setAgentAction({
      ...agentAction,
      snapshot: snapshotDependencies(scenarioState),
      preparedAction: { ...agentAction.preparedAction, status: "awaitingGovernance" as const, lastRevalidatedAt: nowIso },
      approval: { ...agentAction.approval, status: "pending" as const, revalidationResult: { checkedAt: nowIso, stillValid: true } },
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <RentalHeader rental={RENTAL_FIXTURE} scheduledReturnIso={scenarioState.scheduledReturnIso} />

          <ConflictNotice
            rental={RENTAL_FIXTURE}
            assessment={assessment}
            scenarioState={scenarioState}
            agentAction={agentAction}
            minimized={minimized}
            onApprove={approveAndSend}
            onDismiss={() => setMinimized(true)}
            onReopen={() => setMinimized(false)}
            onRecheck={recheckFacts}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <EquipmentCard rental={RENTAL_FIXTURE} />
              <PickupReturnCard rental={RENTAL_FIXTURE} />
              <ActivityCard rental={RENTAL_FIXTURE} extraEntries={extraActivity} />
            </div>
            <div className="space-y-6">
              <CustomerCard rental={RENTAL_FIXTURE} />
              <PaymentDepositCard rental={RENTAL_FIXTURE} />
            </div>
          </div>
        </div>

        <div>
          <TestControlsPanel onApply={applyControl} onReset={resetScenario} />
        </div>
      </div>
    </div>
  );
}
