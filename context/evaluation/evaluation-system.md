# Contera Context System — Evaluation Architecture

**Status of this file:** Derived/procedural artifact. No independent authority over `context/product.md`, `context/behaviors.md`, `context/components.md`, or `context/design-system.md` — see `context/manifest.md` §2. This document defines *how* evaluation happens; its substantive pass/fail criteria are drawn entirely from those four canonical documents plus the three feature files.

**What this document does not claim:** No automated enforcement exists beyond what `context/components.md` actually encodes at the [TYPE] level (compiler-checked invariants on `Finding`, `PreparedAction`, and `Approval`). Everything else described below — including every Experience Rule, every scenario lesson, and most of `components.md`'s own [GUARD]-level checks — depends on either a runtime guard actually being called or a human reviewer actually checking it. This document does not upgrade any of those to "automatically enforced" merely by listing them as evaluation criteria.

---

## 1. Purpose

Contera's product model is deliberately incomplete (`product.md` §1). Evaluation Scenarios 001–003 exist to test the product model and Experience Constitution against concrete situations, not merely to validate a feature's happy path (`product.md` §8, opening note). This document establishes how a generated experience or implementation — whether hand-built or AI-generated — is judged against that model, consistent with the AI-assisted change workflow in `product.md` §10.2 (steps 9–10: "Experience / implementation generation" and "Evaluation").

## 2. What "passing" means — and what is UNRESOLVED about that

`product.md` §9 ("Evaluation") lists these as explicitly open questions, not settled here:

- What constitutes a passing behavioral test?
- Which scenarios should block release if they fail?
- How should AI output quality be evaluated separately from deterministic product behavior?
- Which scenarios require human usability testing versus automated behavioral evaluation?

This document does not answer these. What follows is the set of criteria available to evaluate *against*, drawn from what the canonical documents already establish — it is a checklist architecture, not a release-gating policy. Whether failing a given criterion blocks release is a product decision this Context System does not make.

## 3. Enforcement-strength vocabulary (reused from `components.md`)

Every evaluation criterion below is implicitly one of:

- **[TYPE]** — the only category with real automated enforcement today. Confined to `components.md`'s `Finding`, `PreparedAction`, and `Approval` interfaces (e.g., the `EvidenceState` union, `PreparedActionSource` union, `FindingLifecycle` union). A violation here cannot compile.
- **[GUARD]** — checkable by a human or a test, but only if the corresponding guard function (`canAdvancePastPreparation`, `revalidationRequired`, `mustRecheckBeforeExecution`, `computeApprovalRevalidationRequired`) is actually invoked by the implementation under evaluation. Absence of a call is itself a finding worth reporting.
- **[DOC]** — process/behavioral criteria with no type or runtime mechanism at all (e.g., whether an inference is phrased with appropriate hedging, whether progressive disclosure was actually applied well). These can only be evaluated by a human reviewer or an AI reviewer reasoning over the canonical documents — never claimed as "tested" in the automated sense.

Do not describe a [DOC]-level criterion as "enforced" in any evaluation report this system produces.

## 4. Evaluation dimensions

These map directly to the Experience Constitution (`product.md` §6) and the interaction primitives (`context/behaviors.md`). Each dimension names the rule/primitive it derives from and its enforcement strength.

### 4.1 Epistemic integrity — Rule 005 [DOC]
Does the output keep Observation, Comparison, Inference, Recommendation, Human determination, and Business action distinguishable? Does a Finding's `epistemicStage` field (`components.md`) actually match the epistemic content of its `statement`? A Finding claiming `epistemicStage: "inference"` with unhedged language ("customer damaged equipment") fails this dimension even though the type system permits it — hedged phrasing is [DOC]-only (`components.md` §1, `statement` field comment).

### 4.2 Impact/urgency separation — Rule 002, Rule 010 [DOC]
Are potential consequence and intervention urgency represented as two independent values wherever severity is displayed (Finding, Recommendation, Escalation, Progress — `context/behaviors.md`, cross-cutting requirement)? Is placement/interruptiveness proportionate to the *actual* urgency×consequence combination rather than to data structure (Rule 010)? Scenario 001 (high impact, low urgency at prediction time) and Scenario 003 (high impact, high urgency) are the two reference cases a generated experience should be checked against.

### 4.3 Evidence inspectability — Rule 003, Evidence Inspection primitive [TYPE for presence/absence shape; DOC for sufficiency]
Does every Finding expose `evidentiaryUncertainty` and `evidenceAvailability` (`components.md` §1 — [TYPE]-enforced presence, and the `EvidenceState` union enforcing `evidenceRefs` shape)? Is the evidence itself, its provenance, timestamps, and stated quality limitations actually surfaced to a human, not just summarized (Rule 003; Scenario 002's "obscured by mud" caveat)? Sufficiency of evidence for a given conclusion is a human judgment, not type-checkable (`components.md`, `describeEvidenceState` comment).

### 4.4 Governance correctness — Section 4, `components.md` Prepared Action/Approval [GUARD]
- Does the assigned `requiredGovernanceOutcome` match what the applicable canonical document (or approved feature file) actually establishes for that action type? The type system only constrains the value to one of five literals; it cannot verify the *right* literal was chosen (`components.md` §2, `requiredGovernanceOutcome` comment).
- If governance is `"UNRESOLVED"`, does the Prepared Action correctly route to `blockedByUnresolvedPolicy` rather than being defaulted to `ApprovalRequired` or any other gate? Defaulting is itself a Rule 008 violation, not a safe fallback (`components.md` §2, "Governance requirements").
- Is `canAdvancePastPreparation` actually called before any transition to `awaitingGovernance` or `executed`?

### 4.5 Revalidation — Rule 009 [GUARD]
- Does every Prepared Action declare `mutableStateDependencies` (even if empty)?
- Where non-empty, is `mustRecheckBeforeExecution` actually invoked immediately before execution, and does the check cover the specific fields named in the relevant feature file (e.g., Feature 001's five listed dependencies — `context/features/feature-001-predicted-conflict.md`)?
- Does a change detected during revalidation correctly move the linked Approval `pending → revalidating → stale` and return the Prepared Action to `draft`/`edited` (`components.md` §3, "Revalidation requirements")?

### 4.6 Unresolved-policy handling — Rule 008 [DOC, with one TYPE-adjacent exception]
Does the output ever silently invent a value for something the canonical documents mark UNRESOLVED (a monetary threshold, an approver role, a communication channel, a turnaround duration)? The one place this is partially type-adjacent is `GovernanceOutcome`'s `"UNRESOLVED"` literal itself and the `blockedByUnresolvedPolicy` status it routes to (§4.4) — everywhere else (RBAC, financial thresholds, safety authority, delegation), this is a pure documentation/review check against `context/data/policy-registry.json`'s `unresolved_policy_registry`.

### 4.7 Prepared Action / Approval / Escalation shape correctness — `components.md` [TYPE + GUARD]
- Finding's `EvidenceState` and `FindingLifecycle` unions, and Prepared Action's `PreparedActionSource` union (at least one of Finding/Recommendation linked), are [TYPE]-enforced — a genuine compile-time check available to any implementation using these interfaces.
- Everything else in the three schemas (transition-table conformance, `approverIdentity` authorization, `governanceBasis` accuracy) is [GUARD] or [DOC] and must be checked by test or review, not assumed from the type passing.

### 4.8 Presentation conformance — `design-system.md` [DOC]
- Governance-tier surfaces match §3's rules (Finding/Recommendation neutral; Prepared Action's 3px accent-200 thread + tier icon/label; Approval's dark inversion + accent-500 reserved to label/Approve action; resolved states neutral + ok/err glyph only, never a fill).
- Data values (dates, currency, IDs, meter readings) use the Systematic (mono, tabular-nums) voice; prose uses Body; structural labels stay Eyebrow even beside a Systematic value (§2).
- No behavioral rule is being smuggled in through a presentation choice — if a proposed visual treatment implies a product decision (the Hero Stat pattern's own caveat, §5/§6), that is flagged as a product question, not silently implemented.

### 4.9 Resolution alternatives (Rule 007) [DOC]
Where the agent introduces friction (a Progress hold or Escalation), does it also prepare and present viable alternatives (`context/behaviors.md` primitive 9)? Feature 001 is a known, documented gap against this rule (it stops at contacting the renter) — an evaluation of Feature 001 should note this gap rather than treat its absence as a defect newly discovered.

### 4.10 Decision-object presentation priority — Rule 011, Approval primitive [DOC]
At a human Approval boundary, can the human understand the linked Prepared Action's decision object — the specific content it would execute — and the immediate consequence of approving it, without having to discover it first? This is independent of whether supporting evidence, rationale, or uncertainty detail is expanded; those may remain progressively disclosed. This criterion does not require a Prepared Action's full content to be expanded by default — a summary sufficient to convey the decision object and its immediate consequence, with the full content directly inspectable, satisfies Rule 011. How much must be immediately visible versus one inspection step away should be judged against the action's consequence and irreversibility (`product.md` §5.1–5.2), not against one fixed layout expectation. This dimension applies to any feature using the Approval primitive, not only Feature 001.

## 5. Scenario-based evaluation

Scenarios 001–003 (`context/data/evaluation-scenarios.json`, `product.md` §8) are the canonical behavioral tests. Evaluating a generated implementation of a feature means walking its corresponding scenario's "lessons produced" list as a checklist, in addition to the dimensions in §4:

| Scenario | Feature | Key checks beyond §4 |
|---|---|---|
| 001 — Predicted inventory collision | `context/features/feature-001-predicted-conflict.md` | Prediction never rendered as fact; downstream customer not contacted; Execute phase gated by Approval with the five named Rule 009 dependencies revalidated; the drafted outreach's decision object (recipient, channel, message) understandable before Approval without discovery (§4.10) |
| 002 — Suspected new equipment damage | `context/features/feature-002-damage-review.md` | Agent never states liability or a settled damage conclusion; Prepared Action (damage report) routed to Escalation, not Approval; Correction offers at minimum the five Scenario 002 outcomes |
| 003 — Possible safety-critical equipment issue | `context/features/feature-003-safety-intervention.md` | Agent never asserts "unsafe," only "safety review required"; block does not require proof of failure (Rule 006); Resolution Alternatives are prepared alongside the hold; no invented approver/override role |

## 6. What this evaluation architecture does not do

- It does not define a formal, machine-executed test suite. `product.md` §9 leaves "what constitutes a passing behavioral test" open, and this document does not resolve that.
- It does not define release-blocking criteria. Whether a given scenario failure should block a release is a product/business decision, not a schema property.
- It does not claim that any [DOC]- or [GUARD]-level criterion above is checked automatically merely by being listed here.
- It does not evaluate AI output quality (fluency, tone) separately from product-behavior correctness — that separation is itself named as an open question in `product.md` §9 and is not addressed by this document.

## 7. Procedure for evaluating a generated experience or implementation

1. Identify which feature (`context/features/*.md`) and which canonical primitives/schemas (`context/behaviors.md`, `context/components.md`) the generated work is meant to satisfy.
2. Check [TYPE]-level conformance first — does the implementation even type-check against the `components.md` interfaces it claims to implement?
3. Walk §4's dimensions against the implementation, noting for each whether the criterion is [TYPE] (verified), [GUARD] (verify the guard is actually called), or [DOC] (requires human/AI-reviewer judgment against the canonical prose).
4. Walk the relevant scenario's lessons (§5) as a scenario-specific checklist.
5. Cross-check every UNRESOLVED item the feature file lists under "Unresolved policy" — confirm the implementation surfaces each as visibly unresolved (a `blockedByUnresolvedPolicy` state, a labeled `FixtureValue`, an explicit gap in the UI) rather than silently resolving it.
6. Record findings using the same DEFINED/WORKING HYPOTHESIS/UNRESOLVED and TYPE/GUARD/DOC vocabularies used throughout this Context System (`context/manifest.md` §5), so findings compose with the rest of the system rather than introducing a fourth vocabulary.
7. Where a finding reveals a systemic gap (not just a local implementation bug), route it back to the applicable canonical document for human/cross-functional review, per `product.md` §1 principle 6 and §10 (Change governance) — do not patch the finding only at the implementation layer if the underlying specification is what's actually incomplete.
