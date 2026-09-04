# Feature 001 — Predicted Rental Conflict Outreach

**Status of this file:** Derived extraction. No independent authority — see `context/manifest.md` §2. Every claim below traces to `context/product.md` (Scenario 001, Section 7.1, Section 2.2, Rule 009, the permission table in 4.3) and, for interaction shape, `context/behaviors.md`. Where product.md marks something UNRESOLVED, this file preserves that status rather than resolving it.

**Relationship to Scenario 001:** This feature is the approved, cross-functionally reviewed resolution built from Scenario 001 ("Predicted inventory collision", `product.md` Section 8). Scenario 001 is the evaluation scenario; Feature 001 is the specific outreach behavior the team approved in response to it (`product.md` Section 7.1).

---

## Purpose

Reduce inventory conflicts by having the Operations Agent identify, ahead of time, that an active Rental's predicted readiness time may jeopardize a downstream Reservation for the same Equipment or equipment type, and prompt a human-approved outreach to the current renter to confirm the return — rather than the conflict surfacing only after the downstream customer arrives to find no equipment available. (`product.md` Section 11, "Current evaluation objective"; Section 8, Scenario 001.)

## Trigger

An active Rental's **Estimated Ready Time** (`product.md` 2.2: `Expected Return Time + Required Turnaround Time`) is predicted to fall after a downstream Reservation's pickup time for the same Equipment or equivalent equipment type, **and** no equivalent equipment (as scoped to this feature — see below) is currently available. (`product.md` Section 7.1, Section 2.2.)

Scenario 001's illustrative instance: Bobcat T66 #4421 scheduled to return 9:00 AM, historically returned ~1h47m late by this renter, against a downstream reservation with an 11:00 AM pickup, with no equivalent T66 available. (`product.md` Section 8, Scenario 001.)

## Relevant actors

- **Operations Agent** — identifies the predicted conflict, prepares the outreach, and (once approved) executes it. (`product.md` 2.1, Section 3.)
- **Current renter (Customer)** — the recipient of the confirmation-request outreach. (`product.md` 2.2.)
- **Downstream customer (Customer)** — holds the reservation at risk; not directly contacted by this feature as approved (see Prohibited behavior below).
- **Human approver** — an authorized human who must approve the Execute phase before the communication is sent. Exact role/authorization criteria are **UNRESOLVED** (full RBAC gap, `product.md` Section 9, Permissions and RBAC).

## Relevant product objects

Rental, Equipment, Reservation, Customer, Communication, Agent Action, Approval, Equipment Turnaround Requirement (WORKING HYPOTHESIS), Estimated Ready Time (derived value). (`product.md` 2.2, 2.3.) The conflict between the active Rental and the downstream Reservation is a **derived/computed relationship**, evaluated at prediction time — not a persisted ontology relationship. No permanent Rental → downstream Reservation relationship or complete Reservation state model was added for this feature. (`product.md` 2.3, "Derived conflict relationship".)

## Agent capabilities

One Agent Action progressing through two capability phases (`product.md` Section 7.1):

1. **Prepare** — assemble the renter-outreach communication (a confirmation-request message) as a Prepared Action, linked to the Finding/Recommendation that identified the predicted conflict.
2. **Execute** — send/commit the assembled communication. This is the consequential step.

This is modeled as one Agent Action whose capability classification advances from Prepare to Execute, not two separate Agent Action objects. (`product.md` Section 7.1.)

## Governance

- **Prepare phase:** Permitted. Assembling the draft does not itself require review.
- **Execute phase:** **Approval Required.** An authorized human must review and explicitly approve the Prepared Action before the communication is sent. (`product.md` Section 7.1; `context/behaviors.md` primitives 4–5.)

This resolves the "Contact renter" row of the `product.md` 4.3 permission table **only for this specific action**. It does not resolve the general "Contact renter" policy or the broader autonomous-communication policy in Section 7.2, both of which remain UNRESOLVED.

Autonomous (unreviewed) execution may be reconsidered once sufficient product evidence demonstrates that predictive operational outreach is appropriate and useful — not yet authorized. (`product.md` Section 7.1.)

## Evidence requirements

A human must be able to inspect, per Scenario 001 (`product.md` Section 8):

- current renter identity and preferred contact information
- downstream customer/reservation identity where appropriate
- equipment identity
- scheduled return time
- anticipated return time and the basis for that prediction
- next reservation time
- equivalent replacement inventory
- equipment turnaround requirement, if available

Evidentiary uncertainty must be exposed qualitatively (Low/Moderate/High per `product.md` 5.3), not as an opaque confidence number (Rule 003). The prediction is explicitly a prediction, not a known fact (Scenario 001 lesson 2).

## Applicable Experience Rules

- **Rule 001** — resolve material uncertainty (e.g., confirm actual return intent) before consequential action.
- **Rule 002** — potential impact (high, if unresolved) and intervention urgency (not necessarily urgent at 8:00 AM, since the conflict is predicted) must be represented independently.
- **Rule 003** — expose the prediction's evidence and basis rather than an opaque confidence score.
- **Rule 005** — keep observation (current facts), inference (may return late enough to threaten the reservation), recommendation (contact the renter), and human approval distinct.
- **Rule 008** — do not invent the missing turnaround/communication-channel policy; represent it as fixture data or as unresolved.
- **Rule 009** — revalidate the specific mutable-state dependencies listed below immediately before the Execute phase.
- **Rule 010** — place this intervention according to its actual urgency/consequence combination (high impact, lower urgency at prediction time), not according to underlying data's information architecture.
- **Rule 011** — progressively disclose: show the situation and recommended action first; keep evidence, prediction basis, and prepared-action detail inspectable but not all simultaneously visible.

(`product.md` Section 6.)

## Mutable state dependencies (Rule 009, scoped to this feature)

Per `product.md` Section 7.1, immediately before the Execute phase, the following must be revalidated because a change in any of them could invalidate or materially alter the prepared outreach:

- Current renter's Expected Return Time
- Downstream reservation pickup time
- Equipment assignment (whether the Rental and downstream Reservation still resolve to the same Equipment/type)
- Equipment availability/status (specifically, whether an equivalent replacement has since become available)
- Required Turnaround Time

This list is scoped to this Agent Action only and does not generalize to other action types (`product.md` Section 7.1; `context/components.md`, `mutableStateDependencies`).

## Permitted behavior

- Identify the predicted conflict (Observe).
- Recommend contacting the current renter (Recommend).
- Assemble/draft the confirmation-request communication (Prepare).
- Send the communication, **after** human approval and Rule 009 revalidation (Execute, gated).

## Prohibited behavior

- Sending the communication without human approval (Execute phase is Approval Required, not Permitted).
- Treating the prediction as a known fact rather than an inference.
- Contacting the downstream customer as part of this feature — not addressed by this decision; Scenario 001 lesson 3 explicitly cautions against unnecessarily involving downstream affected parties before material uncertainty is resolved.
- Defaulting an unresolved governance value to Approval Required or any other gate as a fallback (`context/components.md`, Prepared Action governance requirements) — if governance for a given variant of this action were ever unresolved, it must route to `blockedByUnresolvedPolicy`, not be assumed.

## Human intervention

The human approver reviews the Prepared Action (the drafted confirmation-request communication) together with its supporting Finding/Evidence, confirms the Rule 009 revalidation result, and approves or rejects. (`context/behaviors.md` primitive 5.) The exact role authorized to approve is **UNRESOLVED** (full RBAC gap).

## Resolution alternatives

Not required as approved. Feature 001 as approved stops at contacting the current renter to confirm return time; it does not extend to proposing substitute equipment, transfers, or schedule alternatives for the downstream customer. This is a noted gap against Rule 007 (help resolve the consequences of friction the agent introduces) — see `context/behaviors.md` coverage matrix, Resolution Alternatives row for Scenario 001, and is not resolved by this file.

## Unresolved policy

Carried forward from `product.md`, not resolved here:

- Required Turnaround Time's production calculation method (fixed value / varies by equipment type or condition / computed estimate) — `product.md` 2.2.
- Customer communication channel selection (SMS/email/call) — `product.md` 7.2 (general policy; unaffected by this feature's scoped decision).
- The general "Contact renter" permission and the broader autonomous-communication policy — `product.md` 7.2, 4.3.
- Who is authorized to approve this action (RBAC) — `product.md` Section 9.
- What constitutes "equivalent equipment" outside this feature's scope — `product.md` Section 9.
- Whether/when a Prepared Action expires if left undecided — `context/components.md`, Prepared Action.
- What happens if a human has recently contacted the customer, or if product state changes after preparation but before sending, beyond the five Rule 009 dependencies listed above — `product.md` 7.2.

**Prototype/fixture note:** Required Turnaround Time and customer communication channel may be supplied as labeled fixture data (`FixtureValue<T>`, `context/components.md`) for prototyping purposes. This does not resolve either open policy question.

## Evaluation expectations

Per `context/evaluation/evaluation-system.md` and Scenario 001's own lessons (`product.md` Section 8):

- The system must surface the situation with impact and urgency represented independently (Rule 002/010).
- The prediction must never be rendered as a settled fact (Rule 005).
- The Execute phase must not proceed without a recorded Approval whose revalidation result reflects the five listed mutable-state dependencies (Rule 009).
- The downstream customer must not be contacted by this feature.
- Any UNRESOLVED item listed above must remain visibly unresolved in generated output (e.g., a fixture-labeled turnaround value), not silently defaulted.

## Source references

- `product.md` Section 2.2 (Equipment Turnaround Requirement, Estimated Ready Time)
- `product.md` Section 2.3 (Derived conflict relationship)
- `product.md` Section 3 (Agent capability model)
- `product.md` Section 4.1, 4.2, 4.3 (Governance, permission table)
- `product.md` Section 6, Rules 001, 002, 003, 005, 008, 009, 010, 011
- `product.md` Section 7.1 (Predicted rental conflict outreach)
- `product.md` Section 7.2 (Customer communication, UNRESOLVED)
- `product.md` Section 8, Scenario 001
- `context/behaviors.md` primitives 1, 3, 4, 5, 8 (Finding, Recommendation, Prepared Action, Approval, Progress)
- `context/components.md` (Prepared Action, Approval schemas; `FixtureValue<T>`; Feature 001 illustrative notes)
