# Contera Intelligent UI — Machine-Consumable Component Documentation v0.2

**Context System provenance:** This document is the canonical, authoritative implementation-contracts layer — see `context/manifest.md` §2 (subordinate to `context/product.md` and `context/behaviors.md`; a schema field here reflects a decision made in those documents, it does not make the decision). It was originally migrated from `source/components.md`; that origin is historical provenance only (`context/manifest.md` §1) — `source/components.md` is not resynchronized with this document and carries no current authority. The [TYPE]/[GUARD]/[DOC] enforcement legend below is a distinct vocabulary from the DEFINED/WORKING HYPOTHESIS/UNRESOLVED epistemic-status vocabulary used in `context/product.md` — see `context/manifest.md` §5. The three implementation contracts documented here additionally have durable `COMPONENT-<NAME>` semantic IDs (`COMPONENT-FINDING`, `COMPONENT-PREPARED-ACTION`, `COMPONENT-APPROVAL`) documented in `context/id-scheme.md`.

**Scope:** Finding, Prepared Action, Approval only. Prepared Action and Approval remain separate primitives, per the formal separation adopted in `behaviors.md` (originally tested as a working hypothesis in `shadcn-implementation-analysis-v0.1.md`). Feature 001 also uses Evidence Inspection, Recommendation, and Progress (`behaviors.md`, primitives 2, 3, and 8) — these remain defined only in that document. This document does not schematize them; that remains a deliberate scope decision, not an oversight.

**Status:** v0.2 — revision pass addressing four human-review findings on v0.1 (change log at the end). Still documentation for a future coding agent, not implementation code. Does not modify `product.md`, `behaviors.md`, or `shadcn-implementation-analysis-v0.1.md`, and does not resolve any UNRESOLVED product policy.

**Ontology note:** `findingId` and `preparedActionId` below are interaction-layer identifiers used for rendering, state, and audit linkage. They do not make Finding or Prepared Action first-class persisted Product Ontology objects — see `product.md` Section 2.6 and `behaviors.md`'s "Relationship to the Product Ontology" section. Approval is the one primitive here that is also a named Product Ontology Core Object (`product.md` 2.2–2.3); Finding and Prepared Action are not, and this document does not propose making them so.

## Format choice (unchanged from v0.1)

TypeScript interfaces, for the same three reasons as before: directly importable/type-checked in the actual codebase, discriminated unions and tuple types let some invariants be compiler-enforced rather than only described, and JSDoc keeps prose and contract in one file.

## Legend for enforcement strength (unchanged from v0.1)

Every invariant claim below is tagged with exactly one of:

- **[TYPE]** — encoded in the TypeScript type system. The compiler rejects a value that violates this; no application code needs to run for the guarantee to hold.
- **[GUARD]** — enforced only if application code actually calls the accompanying guard/derivation function before acting. The type system alone permits violating values to exist.
- **[DOC]** — documented expectation only. No type or runtime mechanism in this schema prevents violation; it depends on either process discipline or on policy that is itself unresolved (in which case writing a guard would mean inventing that policy, which this document does not do).

---

## Shared types

```ts
type EvidentiaryUncertainty = "Low" | "Moderate" | "High"; // [TYPE] as an enum of values; the requirement to be *present* is per-field, see below.

/** Governance outcomes. "UNRESOLVED" is legitimate — see the Prepared
 *  Action section for how it must be handled (change log #3). */
type GovernanceOutcome =
  | "Permitted"
  | "ApprovalRequired"
  | "EscalationRequired"
  | "Prohibited"
  | "UNRESOLVED";

type ISODateTime = string;
type Id = string;
```

---

## 1. Finding

### Human-readable documentation

**Semantic purpose:** Represents what the Operations Agent observed, compared, or inferred about product state — Observe-tier content, expressed as the Finding interaction primitive (`behaviors.md`, primitive 1; `product.md` Section 2.6 maps Agent Action: Observe to Finding). Keeps observation, comparison, and inference distinguishable and never asserts an inference with more certainty than the evidence supports. Also represents the state of the evidence itself, including its absence, insufficiency, or internal conflict — Rule 003 requires inspectability, not that evidence always exists. A Finding stating "no rental history exists for this customer" is itself material information and must be representable without being forced through evidence that doesn't exist.

**When to use / when NOT to use:** unchanged from v0.1.

**Required properties:** `findingId`, `epistemicStage`, `statement`, `evidentiaryUncertainty`, `evidenceAvailability`, `evidenceRefs` (shape now conditional on `evidenceAvailability` — see schema), `sourceAgentActionId`, `createdAt`, `status`.

**Allowed states:** `active`, `superseded`, `dismissed` — unchanged.

**Relationships, governance requirements:** unchanged from v0.1.

**Evidence/uncertainty requirements:** `evidentiaryUncertainty` remains mandatory. `evidenceAvailability` is also mandatory and answers a question v0.1 didn't ask: *is there evidence to inspect at all, and if not, why?* When evidence exists (`available`, `insufficient`, or `conflicting`), at least one `evidenceRefs` entry is required — there is always something to point to, even if it's partial or contradictory. When evidence is `unavailable`, `evidenceRefs` must be empty — and the absence itself is the material fact being surfaced, not an error state to suppress.

**Accessibility, revalidation, audit requirements:** unchanged from v0.1, except statusHistory's presence rule is expressed as a type-level invariant (see schema).

**Relevant Constitution rules:** Rule 001, Rule 003, Rule 005, Rule 008 (unchanged).

**Recommended shadcn foundations:** Card, Alert, Badge, HoverCard/Tooltip; AI Elements Reasoning. Classification: EXTENDED (`shadcn-implementation-analysis-v0.1.md`, Section 1).

### Machine-readable schema

```ts
type EpistemicStage = "observation" | "comparison" | "inference";
type EvidenceAvailability = "unavailable" | "available" | "insufficient" | "conflicting";

/**
 * [TYPE] This union is the core fix for review finding #1. It is no longer
 * possible to construct a Finding that claims evidence is "available" with
 * zero evidenceRefs, NOR one that claims "unavailable" while smuggling in
 * references. Both directions of the invariant are compiler-checked via
 * the tuple type [Id, ...Id[]] (at-least-one) vs. the empty-tuple type [].
 */
type EvidenceState =
  | { evidenceAvailability: "unavailable"; evidenceRefs: [] }
  | { evidenceAvailability: "available" | "insufficient" | "conflicting"; evidenceRefs: [Id, ...Id[]] };

interface StatusHistoryEntry {
  status: "superseded" | "dismissed";
  actorId?: Id; // absent if the agent itself superseded it
  at: ISODateTime;
  reason?: string;
}

/**
 * [TYPE] Second fix: statusHistory is required (non-empty) whenever status
 * is not "active", and disallowed while status is "active" — encoded as a
 * union rather than an optional field with a comment, which is how v0.1
 * left this unenforced.
 */
type FindingLifecycle =
  | { status: "active" }
  | { status: "superseded" | "dismissed"; statusHistory: [StatusHistoryEntry, ...StatusHistoryEntry[]] };

type Finding = {
  findingId: Id;                      // [TYPE] required
  epistemicStage: EpistemicStage;     // [TYPE] required, one of three literals
  statement: string;                  // [TYPE] required as a string;
                                       // [DOC] that hedged language is used when
                                       // epistemicStage === "inference" — content
                                       // cannot be validated by a type.
  evidentiaryUncertainty: EvidentiaryUncertainty; // [TYPE] required
  sourceAgentActionId: Id;            // [TYPE] required
  createdAt: ISODateTime;             // [TYPE] required
  comparisonRefs?: { beforeEvidenceId: Id; afterEvidenceId: Id }; // [TYPE] optional
  limitations?: string[];             // [TYPE] optional
  supersedesFindingId?: Id;
  relatedFindingIds?: Id[];
} & EvidenceState & FindingLifecycle;

/**
 * [GUARD] Valid status transitions. This is plain data — nothing in the
 * type system stops code from setting `status` without consulting it.
 * It only has effect if the function/reducer that mutates a Finding's
 * status actually checks this table first.
 */
const FINDING_TRANSITIONS: Record<FindingLifecycle["status"], FindingLifecycle["status"][]> = {
  active: ["superseded", "dismissed"],
  superseded: [],
  dismissed: [],
};

/**
 * [DOC] A Finding never carries a GovernanceOutcome field in this canonical
 * type. Nothing stops a different part of a codebase from defining an
 * extended interface that adds one — this is a modeling convention, not an
 * enforced boundary.
 */
```

---

## 2. Prepared Action

### Human-readable documentation

**Semantic purpose:** an agent-created artifact or action ready for human inspection, editing, routing, authorization, handoff, or execution (`behaviors.md`, primitive 4; `product.md` Section 2.6 maps Agent Action: Prepare to Prepared Action) — deliberately separate from Approval, which is the governance interaction through which an authorized human permits or rejects execution of it, not the artifact itself.

**When to use / when NOT to use:** unchanged from v0.1.

**Required properties:** `preparedActionId`, `actionType`, `content`, `editableFields`, a **source** (a discriminated union guaranteeing at least a Finding or a Recommendation is linked — see schema), `requiredGovernanceOutcome`, `mutableStateDependencies` (see Rule 009 below), `lastRevalidatedAt`, `createdAt`, `status`.

**Allowed states:** `draft`, `edited`, `stale`, `blockedByUnresolvedPolicy`, `awaitingGovernance`, `withdrawn`, `handedOff`, `executed`, `failed`.

**Governance requirements:** when `requiredGovernanceOutcome === "UNRESOLVED"`, the Prepared Action is not routed to any gate at all. Treating "UNRESOLVED" as equivalent to `ApprovalRequired` is itself a fabricated fallback policy — Rule 008 prohibits inventing missing policy, and "assume the conservative gate" is still an invention, just a cautious-sounding one. Instead, it can still be created, edited, or withdrawn (Prepare-tier capability doesn't depend on governance being resolved — 4.1), but it cannot reach `awaitingGovernance` or `executed`. It moves instead to `blockedByUnresolvedPolicy`, an explicit, machine-detectable state meaning "this cannot proceed until Product/Engineering resolves the applicable governance policy for this action type" — a direct expression of Section 10.4 ("stop and identify the missing dependency rather than fabricate it"), not a workaround for it. If the applicable governance for an `actionType` is *known* to be `"Prohibited"`, no Prepared Action instance should be created at all — the value exists in the type to make an accidental violation detectable, not to represent a legitimate flow.

**Revalidation requirements:** Rule 009 reads "Revalidate mutable state before consequential execution... when relevant state may have changed" — a conditional, not a universal requirement. A Prepared Action declares `mutableStateDependencies` — the specific facts or fields it depends on that could change between preparation and execution (e.g., `"rental.status"`, `"reservation.pickupTime"`). This field is required but may be an empty array — an empty array is an active claim ("this action has no known mutable-state dependency"), not an omission, since the field cannot be left out. Revalidation before execution is only meaningful, and only required, when this array is non-empty; an empty array means Rule 009's own conditional isn't triggered for this action.

**Evidence/uncertainty requirements:** unchanged — inherits from the source Finding, does not define its own uncertainty rating.

**Human actions, accessibility, audit requirements:** unchanged from v0.1.

**Relevant Constitution rules:** Rule 004, Rule 005, Rule 007, Rule 008, Rule 009 (modeled as conditional, per its actual wording).

**Recommended shadcn foundations:** AI Elements `Tool` (artifact half), Card, Attachment, Input/Textarea. Classification: EXTENDED (`shadcn-implementation-analysis-v0.1.md`, Section 4).

### Machine-readable schema

```ts
type PreparedActionStatus =
  | "draft"
  | "edited"
  | "stale"
  | "blockedByUnresolvedPolicy"
  | "awaitingGovernance"
  | "withdrawn"
  | "handedOff"
  | "executed"
  | "failed";

/**
 * [TYPE] Fix for review finding #4's second example: v0.1's two optional
 * fields (`sourceRecommendationId?`, `sourceFindingId?`) allowed BOTH to be
 * omitted despite a comment claiming "at least one required" — that was
 * never actually enforced. This union makes it a compile error to omit
 * both.
 */
type PreparedActionSource =
  | { sourceFindingId: Id; sourceRecommendationId?: Id }
  | { sourceRecommendationId: Id; sourceFindingId?: Id };

interface PreparedActionCore {
  preparedActionId: Id;
  actionType: string;          // free-form, feature-defined; not enumerated here
  content: unknown;            // shape depends on actionType, deliberately unconstrained
  editableFields: string[];

  /**
   * [TYPE] present as a required field. [DOC] that the applicable
   * governance value assigned here is actually correct per current policy
   * — the type only constrains it to one of the five literals, it cannot
   * check that "Permitted" is the RIGHT answer for a given actionType.
   */
  requiredGovernanceOutcome: GovernanceOutcome;

  /**
   * [TYPE] required array (may be empty — see human-readable section).
   * [GUARD] that the array's CONTENTS are accurate (i.e., that whoever
   * created this Prepared Action correctly identified every mutable
   * dependency) — the type system cannot verify completeness of this list
   * against the real world.
   */
  mutableStateDependencies: string[];

  createdAt: ISODateTime;

  /**
   * [TYPE] required field, present. [GUARD] that it is actually rechecked
   * immediately before execution — see mustRevalidateBeforeExecution below.
   * Only meaningful/binding when mutableStateDependencies.length > 0.
   */
  lastRevalidatedAt: ISODateTime;

  status: PreparedActionStatus;   // [TYPE] one of the nine literals
  evidenceRefs?: Id[];
  handoffTargetActorId?: Id;

  /**
   * [DOC] Whether/when a Prepared Action expires if undecided is
   * UNRESOLVED policy — no timeout rule exists in product.md.
   * This field is a placeholder; do not implement automatic expiry logic
   * against it without a resolved policy.
   */
  expiresAt?: ISODateTime;
}

type PreparedAction = PreparedActionCore & PreparedActionSource;

/**
 * [GUARD] Baseline transitions, ignoring the governance condition — plain
 * data, not compiler-enforced. See canAdvancePastPreparation below for the
 * governance-sensitive check this table alone cannot express.
 */
const PREPARED_ACTION_TRANSITIONS: Record<PreparedActionStatus, PreparedActionStatus[]> = {
  draft: ["edited", "stale", "awaitingGovernance", "blockedByUnresolvedPolicy", "executed", "withdrawn", "handedOff"],
  edited: ["stale", "awaitingGovernance", "blockedByUnresolvedPolicy", "executed", "withdrawn", "handedOff"],
  stale: ["draft", "edited", "withdrawn"],
  blockedByUnresolvedPolicy: ["withdrawn"], // exits only by policy being resolved out-of-band, see below
  awaitingGovernance: ["executed", "withdrawn"],
  withdrawn: [],
  handedOff: [],
  executed: [],
  failed: [],
};

/**
 * [GUARD] — this is the check the flat transition table above cannot
 * express, because it depends on a second field (requiredGovernanceOutcome),
 * not just the current status. A coding agent must call this before ever
 * moving a PreparedAction to "awaitingGovernance" or "executed" — the type
 * system does not prevent constructing a PreparedAction with status
 * "executed" and requiredGovernanceOutcome "UNRESOLVED" simultaneously.
 */
function canAdvancePastPreparation(a: PreparedActionCore): boolean {
  return a.requiredGovernanceOutcome !== "UNRESOLVED" && a.requiredGovernanceOutcome !== "Prohibited";
}

/**
 * [GUARD] Rule 009's actual conditional, not an unconditional "always true."
 * Revalidation is required only when a mutable dependency is declared.
 */
function revalidationRequired(a: Pick<PreparedActionCore, "mutableStateDependencies">): boolean {
  return a.mutableStateDependencies.length > 0;
}

/**
 * [GUARD] Must be invoked before any execution attempt when
 * revalidationRequired(a) is true. Not enforced by the type system —
 * lastRevalidatedAt being present does not mean it was checked *now*.
 */
function mustRecheckBeforeExecution(a: PreparedActionCore, nowCheck: () => boolean): boolean {
  if (!revalidationRequired(a)) return true; // Rule 009 not triggered — nothing to recheck
  return nowCheck(); // application-supplied check against current state
}

/**
 * NOTE on blockedByUnresolvedPolicy exit: leaving this state happens when
 * Product/Engineering resolves the governance policy for this actionType —
 * an out-of-band policy event, not a UI action. The recommended pattern
 * (not implemented here) is to create a NEW PreparedAction reflecting the
 * now-resolved requiredGovernanceOutcome, rather than mutating the blocked
 * instance in place, so the record of "this was blocked, then policy
 * resolved" stays intact for audit. This is a documentation recommendation
 * [DOC], not a mechanism this schema enforces.
 */
```

### Feature 001 illustrative notes (non-normative)

The following illustrates how the generic `PreparedActionCore` fields above would be populated for Feature 001's predicted-return-conflict outreach (`product.md`, Section 7.1). This is an example for this one feature, not a change to the schema, and does not generalize to any other `actionType`.

```ts
/**
 * [DOC] Illustrative only. mutableStateDependencies is a generic
 * string[] field (see PreparedActionCore above) — this is what Feature
 * 001 specifically populates it with, per product.md
 * Section 7.1's Feature-001-scoped Rule 009 list. Do not read this as a
 * default or a convention for other actionTypes.
 */
const FEATURE_001_MUTABLE_STATE_DEPENDENCIES: string[] = [
  "rental.expectedReturnTime",
  "reservation.pickupTime",
  "equipment.assignment",
  "equipment.availabilityStatus",
  "turnaround.requiredTurnaroundTime",
];
```

**Prototype fixture labeling.** Two inputs to this feature's Prepared Action `content` correspond to open Product System policy questions, not resolved values: Required Turnaround Time's production calculation (`product.md`, Section 2.2, UNRESOLVED) and the customer communication channel to use (Section 7.2, UNRESOLVED). For the prototype, such inputs may be supplied as labeled fixture data using a convention like the following, so a coding agent — and anyone reading generated output — can tell a fixture value apart from a value the Product System has actually resolved:

```ts
/**
 * [DOC] Convention only — not enforced by the type system. Wrapping an
 * unresolved-policy input this way is how this documentation recommends
 * a coding agent represent Feature-001 prototype fixture data, so it is
 * never mistaken for a production value or for a resolved policy
 * decision. `T` still satisfies a raw field typed `T` with or without
 * this wrapper; nothing here changes PreparedActionCore's shape.
 */
interface FixtureValue<T> {
  value: T;
  source: "fixture";
  policyStatus: "UNRESOLVED";
  /** e.g., "Required Turnaround Time production calculation is
   *  UNRESOLVED (product.md Section 2.2); this is a labeled
   *  prototype fixture, not a resolved value." */
  note: string;
}

// Example usage for this feature's two named fixture inputs — illustrative only:
type RequiredTurnaroundTimeInput = FixtureValue<number>;   // minutes; production calculation UNRESOLVED (2.2)
type CommunicationChannelInput = FixtureValue<"sms" | "email" | "call">; // general channel policy UNRESOLVED (7.2)
```

Using `FixtureValue<T>` for these two inputs, or documenting them as fixture data some other way, does not resolve the underlying Product System policy questions. It only prevents a prototype implementation detail from being silently read back as if it were policy.

---

## 3. Approval

### Human-readable documentation

**Semantic purpose:** the governance interaction through which an authorized human permits or rejects execution of a linked Prepared Action (`behaviors.md`, primitive 5; `product.md` Section 2.2–2.3, Approval Core Object) — distinguished from Prepared Action itself, which is the artifact being authorized, not the authorization event.

**When to use / when NOT to use, relationships:** unchanged from v0.1.

**Required properties:** `approvalId`, `preparedActionId`, `governanceBasis`, `status`, `createdAt`. Revalidation is not a hardcoded `true` literal (see below).

**Governance requirements:** exists precisely when the linked Prepared Action's `requiredGovernanceOutcome === "ApprovalRequired"`. An Approval should never be constructed for a Prepared Action whose governance is `"UNRESOLVED"` — that Prepared Action would be in `blockedByUnresolvedPolicy`, not `awaitingGovernance`, so no Approval instance should exist for it in the first place.

**Revalidation requirements:** revalidation applicability mirrors the linked Prepared Action's `mutableStateDependencies` — if that list is empty, there is no mutable state for Rule 009 to condition on, and the `pending → revalidating → stale` path is simply not exercised; `pending` may transition directly to `approved`/`rejected`. If the list is non-empty, revalidation before commit remains mandatory, and `stale` is the answer to "what happens if state changes while approval is pending."

**Evidence/uncertainty requirements, human actions, accessibility, audit requirements:** unchanged from v0.1.

**Relevant Constitution rules:** Rule 004, Rule 008, Rule 009 (modeled per its actual conditional wording).

**Recommended shadcn foundations:** Alert Dialog, Dialog/Sheet/Drawer; AI Elements Tool `needsApproval`. Classification: EXTENDED (`shadcn-implementation-analysis-v0.1.md`, Section 5).

### Machine-readable schema

```ts
type ApprovalStatus =
  | "pending"
  | "revalidating"
  | "stale"
  | "approved"
  | "rejected"
  | "expired";

interface Approval {
  approvalId: Id;              // [TYPE]
  preparedActionId: Id;        // [TYPE]
  governanceBasis: string;     // [TYPE] present; [DOC] that the cited basis is accurate
  status: ApprovalStatus;      // [TYPE]
  createdAt: ISODateTime;      // [TYPE]

  /**
   * [GUARD], not [TYPE]. Computed via revalidationRequired() from the
   * LINKED PreparedAction's mutableStateDependencies, not asserted
   * independently on the Approval. Nothing in the type system keeps this
   * boolean in sync with the linked PreparedAction — that synchronization
   * is a runtime obligation of whatever code creates/updates this Approval.
   */
  revalidationRequired: boolean;

  /**
   * [DOC] only. Authorization criteria for who may hold this field are
   * UNRESOLVED at the general-policy level (product.md Section
   * 9, full RBAC gap). Deliberately NOT paired with a [GUARD] function here
   * — writing an authorization check would require inventing the missing
   * RBAC policy, which this document must not do. Enforce per-feature once
   * that policy exists.
   */
  approverIdentity?: Id;

  decidedAt?: ISODateTime;
  revalidationResult?: { checkedAt: ISODateTime; stillValid: boolean; changedFields?: string[] };

  /** [DOC] — same unresolved-expiry caveat as PreparedAction.expiresAt. */
  expiresAt?: ISODateTime;
}

/**
 * [GUARD] Plain data; not compiler-enforced. Note "revalidating"/"stale"
 * are only reachable when revalidationRequired is true (see the note
 * below) — the table itself can't express that condition, same limitation
 * as PreparedAction's transition table.
 */
const APPROVAL_TRANSITIONS: Record<ApprovalStatus, ApprovalStatus[]> = {
  pending: ["revalidating", "approved", "rejected"], // "revalidating" only reachable if revalidationRequired
  revalidating: ["pending", "stale"],
  stale: ["pending", "rejected", "expired"],
  approved: [],
  rejected: [],
  expired: [],
};

/**
 * [GUARD] Direct answer to "does this Approval require revalidation?" —
 * conditional, not universal. Mirrors PreparedAction.revalidationRequired.
 */
function computeApprovalRevalidationRequired(preparedAction: Pick<PreparedActionCore, "mutableStateDependencies">): boolean {
  return preparedAction.mutableStateDependencies.length > 0;
}

/**
 * [GUARD] What evidence must be available before rendering an Approval.
 * Leans on Finding's own [TYPE]-enforced evidence union: if the source
 * Finding's evidenceAvailability is "unavailable", that is itself a valid,
 * inspectable state — an Approval MAY still be rendered, but must surface
 * "no evidence available" honestly rather than blocking or fabricating
 * evidence. This function checks presence/absence, not sufficiency —
 * sufficiency is a human judgment, not a type-checkable one.
 */
function describeEvidenceState(finding: Finding): EvidenceAvailability {
  return finding.evidenceAvailability;
}
```

---

## Direct answers to the five target questions

- **"Am I allowed to render this inference without uncertainty metadata?"** No — `evidentiaryUncertainty` remains a required, non-optional field on `Finding`. [TYPE]
- **"Can this Prepared Action execute directly?"** Only if `requiredGovernanceOutcome === "Permitted"` and `canAdvancePastPreparation` returns true. `"UNRESOLVED"` blocks progress entirely (routes to `blockedByUnresolvedPolicy`) rather than being treated as `ApprovalRequired`. [GUARD]
- **"Does this Approval require revalidation?"** Conditionally — yes if and only if the linked Prepared Action declares at least one `mutableStateDependencies` entry; not an unconditional yes for every Approval. [GUARD]
- **"What evidence must be available?"** A Finding must state its `evidenceAvailability`; when evidence exists in any form (available/insufficient/conflicting), at least one reference is required — enforced by the type union. When evidence is genuinely unavailable, that absence is itself the represented fact, not a validation failure. [TYPE] for the presence/absence shape; [DOC] for sufficiency judgment.
- **"What should happen if the underlying state changes while approval is pending?"** If revalidation applies (non-empty `mutableStateDependencies`), the Approval moves `pending → revalidating → stale`, and the linked Prepared Action must return to `draft`/`edited` for re-review before a new approval cycle can complete. If no mutable dependency was declared, this path is not exercised. [GUARD]

---

## Change log — v0.1 → v0.2 (Finding/Prepared Action/Approval revision pass)

1. **Finding evidence invariant relaxed and made honest.** Replaced the "always ≥1 `evidenceRefs`" rule with an `EvidenceAvailability` field (`unavailable`/`available`/`insufficient`/`conflicting`) unioned with a tuple-typed `evidenceRefs` that is compiler-enforced to be empty exactly when availability is `unavailable`, and non-empty otherwise. This preserves Rule 003's inspectability requirement (there's still always something to inspect, even if it's "no evidence exists") without assuming evidence always exists.

2. **Rule 009 re-modeled as conditional, not universal.** Removed the hardcoded `revalidationRequired: true` literal from Approval. Added `mutableStateDependencies` (required, possibly-empty array) to Prepared Action, and made both Prepared Action's and Approval's revalidation obligation a function of that list's non-emptiness. This matches Rule 009's actual wording — "when relevant state may have changed" — rather than "always, for every Approval."

3. **UNRESOLVED governance no longer defaults to Approval Required.** Replaced a v0.1 fallback ("treat UNRESOLVED as at least ApprovalRequired") with a new `blockedByUnresolvedPolicy` status: a Prepared Action with unresolved governance can still be prepared, edited, or withdrawn, but cannot reach `awaitingGovernance` or `executed`. This makes "policy is missing" a visible, machine-detectable blocking state — the schema-level expression of Section 10.4 — rather than quietly picking a gate.

4. **Machine-readable vs. machine-enforceable claims audited throughout.** Added the three-level legend ([TYPE]/[GUARD]/[DOC]) and applied it to every invariant, upgrading Finding's evidence shape and Prepared Action's Finding-or-Recommendation source to genuine [TYPE] enforcement via discriminated unions/tuples, and explicitly labeling the rest [GUARD] or [DOC]. Approver authorization is left [DOC]-only, since a guard would require inventing the still-unresolved RBAC policy.

## Change log — reconciliation pass (this revision)

5. **Filename brought in line with content version.** Published at `components.md` (previously `component-docs-finding-preparedaction-approval-v0.2.md`, and before that stored at the `...v0.1.md` path despite this document's content already being titled v0.2).

6. **Cross-document references corrected and made explicit.** The Scope and Status lines now name `behaviors.md` and `shadcn-implementation-analysis-v0.1.md` explicitly rather than generically ("the primitives doc," "the shadcn analysis doc"). References to `product.md` (Approval's `approverIdentity` comment, Prepared Action's `expiresAt` comment) were already correct in content but previously pointed to a filename that did not exist in the project; they now resolve, since that file has been renamed to match.

7. **Semantic-purpose wording aligned with the canonical primitive definitions.** Finding, Prepared Action, and Approval's "Semantic purpose" lines now state the same wording approved in `behaviors.md`, and each links back to the mapping in `product.md` Section 2.6, rather than each document paraphrasing the split independently.

8. **Added an ontology note** at the top of this document pointing to Section 2.6 and the primitives document's "Relationship to the Product Ontology," clarifying that `findingId`/`preparedActionId` are interaction-layer identifiers and do not make Finding or Prepared Action Product Ontology Core Objects, and that Approval is the one primitive here that is also a Core Object.

No product policy was resolved by this pass, and no primitive's behavior beyond the approved Prepared Action/Approval split and ontology clarification was changed.

## Change log — second reconciliation pass (Feature 001 lifecycle and fixtures)

9. **Reaffirmed machine-readable scope.** The Scope line now explicitly names Evidence Inspection, Recommendation, and Progress as primitives Feature 001 also uses, while confirming they remain documented only in `behaviors.md` and are not schematized here — a deliberate scope decision, not an oversight.

10. **Added a Feature 001 illustrative example for `mutableStateDependencies`.** Under Prepared Action, a non-normative example shows how `product.md` Section 7.1's Feature-001-scoped Rule 009 list (expected return time, downstream pickup time, equipment assignment, equipment availability/status, Required Turnaround Time) populates the existing generic field. No schema type changed; this does not become a default for other `actionType` values.

11. **Added a `FixtureValue<T>` labeling convention.** Documents how Required Turnaround Time's production calculation and the customer communication channel — both UNRESOLVED product policy — may be represented as labeled prototype fixture data without that data being mistaken for a resolved value or for Product System policy. [DOC]-level convention only; not enforced by the type system.

No product policy was resolved by this pass either. `mutableStateDependencies` and `FixtureValue` additions are illustrative/documentation-only and do not change any [TYPE]-level guarantee described earlier in this document.
