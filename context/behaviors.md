# Contera Intelligent UI Library — Interaction Primitives v0.2

**Context System provenance:** Canonical context document, migrated from `source/behaviors.md` without content changes. This is the behavioral/interaction-semantics layer — see `context/manifest.md` §2 (subordinate to `context/product.md`; every primitive here must trace to a rule, scenario, capability, or governance requirement in that document, and does not itself add Product Ontology objects). Primitive numbers (1–9) below are stable identifiers cited by `context/components.md`, `context/features/*`, `context/data/interaction-primitives.json`, and `context/evaluation/evaluation-system.md`.

Derived from: `product.md` — Experience Constitution (Rules 001–009), Governance & Permission Model (Section 4), Risk Model (Section 5), and Evaluation Scenarios 001–003 (Section 8). Scope: Behavioral primitives only. No UI components, visual styling, or page layouts are specified. No new Contera product behavior is introduced — every primitive traces to an existing rule, scenario, capability, or governance requirement.

Status: v0.2 — approved via cross-functional reconciliation review. Formally separates Prepared Action from Approval, previously folded together in v0.1. Change log at the end.

## Method

A behavioral primitive is a reusable interaction concept (e.g., approval, evidence inspection). A UI component is a particular visual implementation (card, modal, drawer, banner, table) that could realize a primitive in different ways in different contexts. No primitive below is assumed to map to exactly one component — the same primitive (e.g., Evidence Inspection) will likely need different visual treatments for a photo comparison versus a maintenance-record readout.

Nine primitives are derived by walking Rule 005's explicit epistemic chain (Observation → Comparison → Inference → Recommendation → Human determination → Business action) against what Scenarios 001–003 and Rules 001–009 actually required, then merging anything that didn't earn a distinct behavioral responsibility. Two candidates remain deliberately folded into others to keep the system minimal — see "What was folded in, and why" at the end. A third candidate, Prepared Action, was folded into Approval in v0.1 and has since been un-folded (see the v0.2 change log).

## Relationship to the Product Ontology

Status: DEFINED, approved via cross-functional reconciliation review.

The Product Ontology, the Agent Capability model, and these Interaction Primitives operate at three distinct layers. They are not three names for the same thing, and this document does not add to or modify the Product Ontology.

- Product/domain ontology (`product.md`, Section 2) describes the entities Contera knows about and operates on — Customer, Equipment, Reservation, Rental, Agent Action, Approval, and so on.
- Agent Capability (`product.md`, Section 3) describes what the agent is doing at a given moment — Observe, Recommend, Prepare, Execute — as a classification of an Agent Action, not a separate object.
- Interaction primitives (this document) describe how that agent behavior is expressed to, and controlled by, a human. The primitives below are an interaction-layer vocabulary, not additional Product Ontology objects.

Explicit mapping from capability to primitive:

- Agent Action: Observe → may be expressed through Finding
- Agent Action: Recommend → may be expressed through Recommendation
- Agent Action: Prepare → may be expressed through Prepared Action
- Agent Action: Execute → represented through execution/progress behavior as applicable (see Progress)

Two clarifications follow from this layering:

1. Primitive-level identifiers used for rendering, state-tracking, or audit linkage (`findingId`, `preparedActionId`, and similar, as used in the machine-readable component documentation) do not, by themselves, make Finding or Prepared Action first-class persisted Product Ontology objects. Whether they are implemented as views over Agent Action, independent application-layer records that reference Agent Action, or some other structure is an Engineering decision this document does not make.
2. Approval is a special case. Approval exists as a named Core Object of the Product Ontology (`product.md`, Sections 2.2–2.3), representing recorded human authorization, and as an interaction primitive below, representing the human authorization experience. Unlike Finding and Prepared Action, Approval's ontology object and its interaction primitive refer to the same underlying thing viewed from two angles — the record and the experience of creating that record — rather than one being an interaction-layer view with no ontology counterpart.

This document does not invent a persistence architecture beyond this distinction.

---

## 1. Finding

**Purpose:** Present what the Operations Agent has observed, compared, or inferred, without asserting more certainty than the evidence supports.

**Behavioral responsibility:** Hold the observation/comparison/inference content of an Agent Action; keep those three epistemic layers distinguishable rather than collapsed (Rule 005); never phrase an inference as settled fact — "possible new damage," not "customer damaged equipment" (Scenario 002); "safety review required," not "equipment unsafe" (Scenario 003).

**When it appears:** Whenever the agent has identified something worth a human's attention — a predicted conflict (Scenario 001), a possible-damage comparison (Scenario 002), a safety-relevant combination of signals (Scenario 003).

**Required information:** the observation; the inference, if any, explicitly labeled as inference; the evidence supporting it; which epistemic stage each statement belongs to.

**Optional information:** a comparison view (before/after); known limitations of the underlying evidence; related prior findings.

**Agent states supported:** Observe (always); may co-occur with Recommend/Prepare as the front matter of a larger Agent Action.

**Human actions permitted:** inspect evidence (→ Evidence Inspection); dismiss (→ Correction). No approval action — a Finding is not itself a proposed action.

**Governance implications:** none on its own; Findings are Observe-tier and Permitted by definition (Section 3). Governance attaches to whatever Recommendation or Prepared Action follows.

**Uncertainty/evidence requirements:** must expose Evidentiary Uncertainty qualitatively (5.3) rather than an opaque confidence number (Rule 003) — though whether confidence scores may ever appear at all is itself unresolved (Section 9, Confidence and evidence).

**Accessibility:** evidence referenced by a Finding (e.g., a damage comparison) needs a non-visual equivalent — a text description of what changed, not only a highlighted image diff; certainty language must not rely on color alone.

**Relationships:** feeds Recommendation; is attached to by Evidence Inspection; may be the subject of Correction; is tracked by Progress.

---

## 2. Evidence Inspection

**Purpose:** Let a human examine the underlying evidence, its quality, and its limitations behind a Finding, Recommendation, Prepared Action, Approval, or Escalation.

**Behavioral responsibility:** Surface raw evidence — photos, notes, meter readings, maintenance records — timestamps, provenance, and known quality limitations, rather than a summarized conclusion alone (Rule 003; Scenario 002's "evidence-quality limitations"; Scenario 001's "anticipated return time and the basis for that prediction").

**When it appears:** Attached to nearly every other primitive rather than standing alone — anywhere a Finding, Recommendation, Prepared Action, Approval, or Escalation references evidence.

**Required information:** the evidence items; source/provenance; timestamps; stated quality limitations; for comparisons, both before/after sets.

**Optional information:** highlighted/annotated differences; related historical evidence (e.g., prior damage history).

**Agent states supported:** Observe (evidence grounds an Observe-tier Finding); referenced by any higher-tier action built from it.

**Human actions permitted:** inspect; request more evidence (→ Correction, or back to the agent for further observation).

**Governance implications:** none directly, but evidence surfaced here is what justifies Escalation or a Progress hold under Rule 006's asymmetric-threshold logic.

**Uncertainty/evidence requirements:** this primitive is the uncertainty/evidence requirement made visible — it carries the Evidentiary Uncertainty rating and the specific reasons behind it.

**Accessibility:** photo/video evidence needs text alternatives sufficient for a non-visual user to understand the finding; quality caveats (e.g., "obscured by mud") must be text, not implied only by an annotated image.

**Relationships:** attaches to Finding, Recommendation, Prepared Action, Approval, Escalation; may trigger Correction.

---

## 3. Recommendation

**Purpose:** Suggest a next action without committing to it.

**Behavioral responsibility:** State the suggested action and its rationale, tied to a Finding, at Recommend-tier — explicitly stopping short of Prepare/Execute (Section 3).

**When it appears:** After a Finding, when the agent has identified a worthwhile next step — contact the renter (Scenario 001), conduct a secondary inspection (Scenario 002).

**Required information:** the recommended action; the Finding it's based on; why this action addresses the situation.

**Optional information:** alternatives considered and set aside; urgency rationale.

**Agent states supported:** Recommend.

**Human actions permitted:** accept, decline, request a different recommendation.

**Governance implications:** none on its own — a Recommendation isn't yet a committed action. Governance attaches once something is Prepared from it.

**Uncertainty/evidence requirements:** inherits the Finding's evidentiary uncertainty; must not imply more confidence in the recommended path than the Finding supports.

**Accessibility:** the Finding→Recommendation rationale must be available as text/structured content, not only implied by visual proximity or ordering.

**Relationships:** consumes a Finding; may lead to a Prepared Action, whose own governance outcome then determines whether Approval or Escalation follows. Scenario 003 suggests the Recommendation stage can sometimes be compressed directly into Escalation for high-urgency safety cases — flagged below as an open question, not resolved here.

---

## 4. Prepared Action

**Purpose:** Present an agent-created artifact or action that is ready for human inspection, editing, routing, authorization, handoff, or execution.

**Behavioral responsibility:** Hold the drafted artifact/action content — a draft SMS, a damage report bundling evidence and a repair estimate, a set of transfer alternatives — and its link back to the Finding and/or Recommendation it is built from; remain a stable, editable object independent of whatever governance outcome applies to it. Capability and governance are separate dimensions (4.1), and a Prepared Action must not itself imply which kind of gate, if any, follows — Scenario 002's "Prepare and Escalate together" lesson demonstrates that Prepare-tier work can be carried forward by Escalation rather than by Approval.

**When it appears:** Whenever the agent commits to Prepare-tier work, regardless of what governance requires next — a drafted communication (Scenario 001 / Feature 001), a damage report (Scenario 002), a set of operational alternatives (Scenario 003).

**Required information:** the prepared content/artifact; the Finding and/or Recommendation it is sourced from (at least one is always required); which fields are human-editable; the governance outcome currently applicable to it (Permitted / Approval Required / Escalation Required / Prohibited / unresolved).

**Optional information:** edit history; a handoff target, if a human is to take over manual execution instead of the agent.

**Agent states supported:** Prepare (always); may subsequently be edited by a human, withdrawn by the agent because underlying state changed, or handed off for manual execution.

**Human actions permitted:** inspect, edit, discard, hand off to manual execution, forward to whichever governance step applies (Approval, Escalation, or direct execution if Permitted).

**Governance implications:** a Prepared Action carries no governance decision of its own — it can exist under any governance outcome, including Prohibited (where it should not be allowed to progress) and Escalation Required (where it is carried forward by Escalation rather than Approval). This is the direct behavioral reason this primitive is separate from Approval: a merged primitive would hard-code "being Prepared always means an Approval-shaped gate comes next," which Scenario 002 already disproves (see the v0.2 change log).

**Uncertainty/evidence requirements:** inherits evidentiary uncertainty from its source Finding/Recommendation; must not present as more certain or more final than that source once prepared.

**Accessibility:** editable fields must be real labeled form controls, not an undifferentiated block of generated text; edits a human makes must remain distinguishable from the agent's original draft.

**Relationships:** consumes Finding and/or Recommendation; is gated by Approval when governance = Approval Required; is carried forward by Escalation when governance = Escalation Required; updates Progress; may itself be the artifact Resolution Alternatives is built from.

---

## 5. Approval

**Purpose:** Provide the governance interaction through which an authorized human permits or rejects execution of a Prepared Action.

**Behavioral responsibility:** Present the linked Prepared Action together with its supporting Finding/Evidence; immediately before execution, revalidate that the supporting facts still hold, when the Prepared Action has a mutable-state dependency (Rule 009); record the decision and the deciding human (2.3, Approval object). Approval is the authorization event itself, not the artifact being authorized — that separation is exactly what distinguishes it from Prepared Action.

**When it appears:** Whenever a Prepared Action's governance outcome is Approval Required — e.g., Feature 001's predicted-return-conflict communication (7.1).

**Required information:** the linked Prepared Action in full; the Finding/Evidence it rests on; the governance basis for requiring approval; a revalidation-check result, where revalidation applies.

**Optional information:** suggested edits surfaced from the Prepared Action; alternative channel/timing.

**Agent states supported:** none directly — Approval is a human-authorization event over a Prepared Action, not an agent capability state itself.

**Human actions permitted:** approve as-is, edit the linked Prepared Action then approve, reject, request more evidence.

**Governance implications:** exists precisely when Governance = Approval Required (4.2); distinguished from Escalation in that any authorized actor for that action type may act, not necessarily a specific higher-authority role.

**Uncertainty/evidence requirements:** must expose the same evidentiary basis as the underlying Finding; per Rule 009, must reflect whether anything material changed since preparation, when the linked Prepared Action declares a mutable-state dependency.

**Accessibility:** approve/reject/edit controls must be fully keyboard/AT operable, given they gate consequential, sometimes-irreversible actions (5.2); a revalidation warning must be announced, not shown only as a visual badge.

**Relationships:** consumes a Prepared Action (and, through it, Finding/Evidence Inspection); updates Progress on decision; may route back to Correction if the human disagrees with the underlying Finding rather than just the prepared artifact.

---

## 6. Escalation

**Purpose:** Route a Finding or Prepared Action to a specific role or higher-authority actor, rather than letting the current actor resolve it.

**Behavioral responsibility:** Identify that specific-role review is required, not just any authorized approver; carry the Finding/Evidence, and a Prepared Action if one exists, forward to that role; support the "Prepare and Escalate together" pattern (Scenario 002 lesson) where a fully prepared action still requires escalated review rather than ordinary approval.

**When it appears:** Manager review for suspected damage (Scenario 002); safety review for a possible hydraulic-line issue (Scenario 003).

**Required information:** the Finding/Evidence; why escalation rather than ordinary approval is required; the target role, where known, or a note that the authorized role is unresolved.

**Optional information:** a linked Prepared Action, if one exists (e.g., the draft damage report).

**Agent states supported:** Prepare, and sometimes Execute-blocking (Scenario 003 prevents ordinary checkout progression pending review).

**Human actions permitted:** the escalated-to role can adjudicate (→ Correction), approve/reject a linked Prepared Action, or request more evidence.

**Governance implications:** exists precisely when Governance = Escalation Required (4.2). Who the "specific role" is remains UNRESOLVED for both damage liability and safety authority (7.4, Section 9) — this primitive cannot be fully specified for those cases without that policy decision.

**Uncertainty/evidence requirements:** same as Approval, plus Rule 006's asymmetric-threshold logic — escalation may be warranted before proof of a high-consequence failure exists (Scenario 003).

**Accessibility:** routing/assignment information (who this went to, and why) must be exposed as text, not only implied by workflow state.

**Relationships:** may follow directly from a Finding (Scenario 003) or from a Prepared Action (Scenario 002); resolves into Correction; is one Progress state; may co-occur with Resolution Alternatives (Scenario 003).

---

## 7. Correction

**Purpose:** Let an authorized human resolve ambiguity in a Finding — determine what's actually true — rather than merely approving or rejecting a proposed action.

**Behavioral responsibility:** Offer the range of determinations a Finding's ambiguity requires (Scenario 002: confirm damage, mark as pre-existing, request more evidence, dismiss the finding, escalate the dispute); feed the result back to correct the system's own understanding rather than only gating one pending action.

**When it appears:** Whenever a human must adjudicate an agent's inference rather than simply approve/reject a prepared artifact — squarely demonstrated in Scenario 002; underspecified for Scenario 003 (see gaps below).

**Required information:** the Finding and its Evidence; the set of valid determination outcomes for this situation type; who is authorized to make this determination, where known.

**Optional information:** a reasoning/notes field; links to related disputes or history.

**Agent states supported:** Observe/Recommend/Prepare — a Correction can be invoked against a Finding at any of these stages, not only against something already Prepared.

**Human actions permitted:** confirm, mark as pre-existing, request more evidence, dismiss, escalate.

**Governance implications:** Correction outcomes can themselves trigger Escalation ("escalate dispute"); the underlying record change a Correction produces may need its own governance treatment (e.g., waiving a charge) that isn't yet resolved (7.3).

**Uncertainty/evidence requirements:** must show why the Finding was ambiguous in the first place, so the correcting human isn't asked to resolve uncertainty blind.

**Accessibility:** the full set of determination options must be presented as discrete, individually operable controls — not a single ambiguous free-text field — so the choice made is unambiguous and auditable.

**Relationships:** consumes Finding + Evidence Inspection; may produce a new Escalation; updates Progress; is the natural terminus of Rule 005's "human determination" stage.

---

## 8. Progress

**Purpose:** Show where a given Agent Action currently sits in its capability/governance lifecycle, and — where required — actively hold up an ordinary workflow until that lifecycle resolves.

**Behavioral responsibility:** Track the Agent Action's capability tier (Observe/Recommend/Prepare/Execute) and governance outcome (Permitted/Approval Required/Escalation Required/Prohibited) as two independent values, not one combined ladder (4.1's own correction — "Prepare and Escalate may occur together"); when warranted, prevent an ordinary state transition (e.g., checkout) from completing until a human has resolved the pending review (Scenario 003).

**When it appears:** Attached to every Agent Action from creation; becomes an active hold specifically in cases like Scenario 003.

**Required information:** current capability tier; current governance outcome; whether progression is blocked and why, linked to the Finding/Escalation that caused it.

**Optional information:** state history (e.g., "Prepared at 8:02 AM, Escalated at 8:04 AM"); estimated time to resolution.

**Agent states supported:** all four, plus the terminal outcome/failure state named in the Agent Action object (2.3) — though how a failure state should surface is not concretely demonstrated by any of the three scenarios (see gaps below).

**Human actions permitted:** view current status. For a blocking state, the spec defines no override — the human role authorized to lift a hold is UNRESOLVED (7.4, Scenario 003).

**Governance implications:** a blocking Progress state operationalizes Escalation Required or Approval Required as a real constraint on the product, not just a review queue.

**Uncertainty/evidence requirements:** a blocking state must be justified by the same evidentiary basis as its originating Finding and must not claim more certainty than that Finding supports.

**Accessibility:** blocking/urgent states must not be signaled by color alone; state changes should be announced to assistive technology as they occur, since they can affect a time-sensitive real-world action.

**Relationships:** the connective primitive nearly everything else reports into — Finding, Recommendation, Prepared Action, Approval, Escalation, and Correction all update it; Resolution Alternatives is typically offered specifically because Progress is in a blocked state.

---

## 9. Resolution Alternatives

**Purpose:** When the agent's own behavior introduces friction — a block, delay, or escalation — proactively offer safe ways forward rather than leaving the human with only a stop.

**Behavioral responsibility:** Assemble and present viable alternative paths tied to the specific friction just introduced (Rule 007; Scenario 003's "equivalent equipment at nearby branches, estimated transfer time, substitute equipment classes, customer schedule flexibility, upgrade options, or delivery alternatives").

**When it appears:** Alongside a Progress hold or Escalation caused by the agent — concretely demonstrated only in Scenario 003.

**Required information:** the friction being addressed (which hold/escalation this responds to); the candidate alternatives and why each is viable.

**Optional information:** estimated cost/time tradeoffs; a preference ordering.

**Agent states supported:** Prepare — assembling alternatives is itself a Prepare-tier act (2.3 example: "prepare alternatives for an inventory or safety conflict"), and the resulting alternatives set is itself a Prepared Action.

**Human actions permitted:** select an alternative, request more options, dismiss.

**Governance implications:** none defined independently; selecting an alternative may trigger a new Agent Action (e.g., initiating a transfer) with its own governance.

**Uncertainty/evidence requirements:** each alternative's viability should be evidence-backed (e.g., confirmed availability), not merely suggested. Note: "equivalent equipment" has a scoped definition for Feature 001 (7.1) that doesn't necessarily cover Scenario 003's broader "equivalent equipment at nearby branches" — flagged below.

**Accessibility:** alternatives must be independently selectable via keyboard/AT with clear labeling of what makes each viable, not conveyed through layout or position alone.

**Relationships:** attaches to a blocked Progress state or an Escalation; consumes Evidence Inspection output; is the direct expression of Rule 007.

---

## Cross-cutting requirement, not a primitive: Impact/Urgency disclosure

Rule 002 requires that potential consequence and intervention urgency be represented as two independent values, never collapsed into one severity score. This isn't modeled as its own primitive because it doesn't have a distinct interaction shape of its own — it's a content constraint that Finding, Recommendation, Escalation, and Progress must all honor whenever they display severity (Scenario 001: high impact, low urgency at 8:00 AM; Scenario 003: high impact and high urgency together). Folding it in keeps the primitive count minimal without dropping the requirement.

Rule 008 (don't invent missing policy) is a similar cross-cutting constraint rather than a primitive: every primitive above must surface an unresolved policy (e.g., Escalation's undefined routing target) as visibly unresolved rather than have the interface silently default it.

---

## Where the Product System is insufficient to fully define a primitive

- **Finding / Evidence Inspection:** Rule 003's "when practical" threshold for exposing evidence is undefined, and whether numerical confidence may ever be shown at all is unresolved (Section 9) — both needed to fully specify Finding's content model.
- **Evidence Inspection:** evidence-provenance metadata requirements and how conflicting sources should be represented are unresolved (Section 9).
- **Recommendation:** whether a Recommendation stage is always required before Prepare, or can be compressed for high-urgency safety cases (Scenario 003 appears to skip straight to Escalation), is unresolved.
- **Prepared Action:** which fields must be revalidated per action type under Rule 009 is unresolved generically (Section 9, Agent execution) — each Prepared Action's mutable-state dependencies must currently be identified per feature as it is approved, not derived from a general rule; whether/when a Prepared Action expires if left undecided is also unresolved.
- **Approval:** who counts as an "authorized human actor" generally is unresolved (full RBAC gap) — Approval's authorization requirement can't be fully specified generically, only per-feature as each is approved.
- **Escalation:** the specific roles authorized to receive a damage-liability escalation or a safety escalation are both unresolved (7.4, Section 9) — Escalation's routing target is unresolved policy, not a design decision.
- **Correction:** what happens when evidence remains inconclusive after correction is attempted, and what customer dispute process exists, are both unresolved (Section 9) — these bound what the "dismiss" and "escalate dispute" outcomes actually do downstream.
- **Progress:** the relationship between operational availability, safety status, reservation assignment, and maintenance status (2.4) is unresolved, so it isn't clear which underlying object states a "blocked" Progress status should actually change.
- **Resolution Alternatives:** "equivalent equipment" is only defined for Feature 001's narrow scope (7.1); Scenario 003's broader alternative-equipment matching has no defined equivalence rule of its own.
- **Progress (failure state):** the Agent Action object names an "outcome or failure state," but no scenario walks through an execution failure — Section 9 leaves "what happens when execution partially fails?" open. This primitive's failure-handling behavior is a placeholder, not a specified design.

---

## Coverage matrix — Scenarios 001–003

| Primitive | Scenario 001 (predicted collision) | Scenario 002 (suspected damage) | Scenario 003 (safety-critical) |
|---|---|---|---|
| Finding | Required | Required | Required |
| Evidence Inspection | Required | Required | Required |
| Recommendation | Required | Required | Ambiguous — collapsed into Finding + Escalation ("safety review required" is stated directly rather than routed through a discrete Recommendation) |
| Prepared Action | Required (Feature 001's approved drafted communication) | Required (draft damage report, carried forward by Escalation rather than gated by Approval) | Ambiguous — Prepare-tier activity here produces Resolution Alternatives directly; whether a discrete Prepared Action instance (e.g., an action to formally place equipment on a safety hold) also exists is unresolved |
| Approval | Required (per Feature 001's approved governance) | Not required — governance here is Escalation, not Approval | Not required as specified — outcome likely Escalation, but the exact mechanism is unresolved |
| Escalation | Not required — Feature 001 uses Approval | Required ("Prepare and Escalate together," manager review) | Required (safety review; target role unresolved) |
| Correction | Not required — the human only approves/rejects a drafted message | Required (confirm / mark pre-existing / request evidence / dismiss / escalate dispute) | Partial/underspecified — a human determination is clearly implied but the spec gives no defined menu of outcomes, unlike Scenario 002 |
| Progress | Required (tracks lifecycle + Rule 009 revalidation) | Required (tracks the combined Prepare+Escalate state) | Required (tracks Observe→Blocked→Escalated, including the active hold) |
| Resolution Alternatives | Not required — Feature 001 as approved stops at contacting the renter (a gap against Rule 007 noted in the Feature 001 analysis) | Not required — this scenario is about liability determination, not equipment availability | Required (explicitly: nearby equivalent equipment, transfer time, substitute classes, schedule flexibility, upgrade or delivery alternatives) |

---

## What was folded in, and why (keeping the system minimal)

- A separate "blocking/hold" primitive was folded into Progress — blocking is one state of the same lifecycle-tracking responsibility, not a different concern.
- Rule 002's impact/urgency dual-disclosure was treated as a cross-cutting content requirement on existing primitives rather than a tenth primitive, since it has no interaction shape of its own (see above).
- An "Outcome/Failure disclosure" primitive was deliberately not added despite the ontology naming a failure state, because no scenario demonstrates what that behavior should look like — inventing its shape now would violate Rule 008. It's listed above as a gap instead.

Prepared Action was folded into Approval in v0.1; this has been reversed in v0.2 (see change log below) — it is no longer folded, and is documented above as its own primitive.

---

## Change log — v0.1 → v0.2

1. Prepared Action separated from Approval. v0.1 folded a "drafted artifact ready for review" concept into Approval, reasoning that the two had no distinct responsibility. Downstream implementation analysis (`shadcn-implementation-analysis-v0.1.md`) found concrete grounds to separate them: every Prepared Action does not necessarily route to Approval (Scenario 002 routes a Prepared Action to Escalation instead), so a merged primitive would silently re-encode the "one linear ladder" mistake Scenario 002 already disproved at the product level (4.1). shadcn/ui's own AI Elements Tool + `needsApproval` pattern was cited as a real, shipped precedent for treating the artifact and the governance gate as separable concerns. This document now formally adopts that separation as primitive 4 (Prepared Action) and primitive 5 (Approval), approved via cross-functional review.
2. All cross-references updated accordingly. Evidence Inspection, Recommendation, Escalation, and Progress now name Prepared Action explicitly in their purpose/relationships text where the merged "Approval" previously stood in for both concepts.
3. Coverage matrix gained a Prepared Action row, distinguishing it from the Approval row so a reader can see, per scenario, whether a Prepared Action exists at all and, independently, whether Approval or Escalation carries it forward.
4. "Where the Product System is insufficient" gap list split accordingly — the former single Approval-and-Prepared-Action gap entry is now two entries, one for each primitive's own unresolved dependency.
5. Added "Relationship to the Product Ontology" documenting the three-layer distinction (ontology / capability / interaction primitive), the explicit Observe→Finding / Recommend→Recommendation / Prepare→Prepared Action / Execute→Progress mapping, the clarification that primitive-level IDs do not imply persisted ontology objects, and Approval's special dual-layer status. This does not add Finding or Prepared Action as Core Objects and does not invent a persistence architecture — both remain Engineering decisions outside this document's scope.
6. Filename/reference hygiene. This document is now published at `behaviors.md` (previously `interaction-primitives-v0.2.md`, and before that `v0.1.md`), matching its content version, and its own "Derived from" line now correctly cites `product.md`, which previously did not exist under that exact filename.

No other primitive was redesigned, and no unresolved product policy named above (Escalation's routing target, the authorized-approver RBAC gap, revalidation field specifics, equivalent-equipment scope, and the rest) was resolved by this revision.
