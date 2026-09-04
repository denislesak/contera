# Feature 002 — Suspected Damage Review

**Status of this file:** Derived extraction. No independent authority — see `context/manifest.md` §2. Every claim below traces to `context/product.md` Scenario 002 (Section 8) and Section 7.1 ("Suspected damage"). Unlike Feature 001, this scenario's working behavior is documented as a **Scenario 002 working decision**, not a fully cross-functionally approved feature spec — `product.md` marks it "DEFINED for Scenario 002 working behavior," which this file preserves rather than upgrading to a general policy.

**Relationship to Scenario 002:** This file extracts Scenario 002 ("Suspected new equipment damage", `product.md` Section 8) as a feature-shaped artifact. It does not add anything beyond what that scenario and Section 7.1 already establish.

---

## Purpose

Let the Operations Agent detect a possible new equipment damage by comparing checkout and return evidence, and route it to manager review with the supporting evidence and a draft damage report — without the agent itself determining liability or assessing a charge. (`product.md` Section 8, Scenario 002.)

## Trigger

A return inspection's evidence (photos) differs from checkout evidence in a way that suggests new physical damage. Scenario 002's instance: Bobcat T66 #4421 returned with a visible dent/scrape on the right rear panel not clearly visible at checkout, where checkout evidence for that panel was itself taken in poor lighting and partly obscured by mud. (`product.md` Section 8.)

## Relevant actors

- **Yard Associate** — performs the return inspection and photographs the equipment. (`product.md` 2.1.)
- **Operations Agent** — compares evidence, infers possible new damage, recommends secondary inspection, prepares the damage report. (`product.md` 2.1, Section 8.)
- **Branch Manager** (or equivalent) — the escalation target for review; exact role authority is **UNRESOLVED** (`product.md` 7.4, Section 9).
- **Customer** — subject of the disputed/suspected damage; liability determination role is **UNRESOLVED**.

## Relevant product objects

Rental, Equipment, Inspection, Evidence, Damage, Charge (proposed, not created by the agent), Agent Action. (`product.md` 2.2.) Checkout Inspection and return Inspection both reference Evidence; the Rental "may create or reference Damage" (2.3).

## Agent capabilities

Per Scenario 002's working behavior (`product.md` Section 8):

- **Observe** — identify visible damage in return evidence.
- **Observe (comparison)** — identify that the damage is not clearly visible in checkout evidence.
- **Observe (inference)** — state that damage may have occurred during the rental (hedged, not asserted as fact).
- **Recommend** — request a secondary human inspection.
- **Prepare** — assemble evidence, relevant rental information, repair estimate, and a draft damage report.

The agent does **not** reach Execute for any liability or financial action in this scenario.

## Governance

**Escalation Required**, not Approval Required — this is the scenario that established that Prepare and Escalate can occur together (`product.md` Section 4.1; `context/behaviors.md` primitive 6 coverage-matrix note). Manager review is required before any consequential customer action. (`product.md` Section 8, "Working behavior" / "Governance".)

The Prepared Action (the draft damage report) is carried forward by Escalation rather than gated by Approval — this is the concrete case that justified separating the Prepared Action and Approval primitives in `behaviors.md` v0.2 (see that document's change log item 1).

## Evidence requirements

Per Scenario 002's "Evidence presentation requirement" (`product.md` Section 8), the system should expose:

- checkout evidence
- return evidence
- timestamps
- highlighted or otherwise inspectable visual difference where useful
- inspection records
- known prior damage history if available
- relevant rental agreement
- repair estimate
- evidence-quality limitations (e.g., poor lighting, mud obscuring part of the checkout photo)

Evidentiary uncertainty for this scenario is rated **Moderate** ("Material/Moderate because checkout evidence is incomplete" — `product.md` Section 8, "Working risk assessment").

## Applicable Experience Rules

- **Rule 001** — evolved specifically from this scenario, from "resolve uncertainty at its source" to "resolve material uncertainty before consequential action" (`product.md` Rule 001, Section 8 lesson 1).
- **Rule 003** — evidence-quality limitations (poor lighting, mud) must be exposed, not summarized away.
- **Rule 004** — reduced autonomy given High consequence (financial impact, dispute potential) — `product.md` Section 8, "Working risk assessment."
- **Rule 005** — the epistemic chain is the explicit worked example for this rule: Observation → Comparison → Inference → Recommendation → Human determination → Business action (`product.md` Rule 005). The agent must not silently transform "possible new damage" into "customer damaged equipment."
- **Rule 006** — not directly cited for this scenario (that's Scenario 003), but the "Prepare and Escalate together" lesson (Rule-adjacent finding) originates here (`product.md` Section 8 lesson 3).
- **Rule 008** — do not invent customer liability determination or a charge amount; those remain human/manager determinations.

(`product.md` Section 6, Section 8.)

## Mutable state dependencies

Not enumerated for this feature in the source material. Unlike Feature 001, `product.md` does not provide a Rule-009-scoped list of mutable-state dependencies for this scenario. This is a **gap**, not a resolved "none" — `context/behaviors.md`'s own gap list notes that "which fields must be revalidated per action type under Rule 009 is unresolved generically" and must be identified per feature as it is approved (`context/behaviors.md`, "Where the Product System is insufficient," Prepared Action entry). This feature has not gone through that approval step.

## Permitted behavior

- Observe and compare checkout/return evidence.
- State an inference of possible new damage, explicitly hedged as an inference.
- Recommend a secondary human inspection.
- Prepare a draft damage report bundling evidence, rental information, and repair estimate.
- Escalate the prepared report and finding to manager review.

## Prohibited behavior

Per `product.md` Section 7.1 ("Suspected damage") and Section 8:

- Conclude that the customer caused the damage.
- Determine customer liability.
- Autonomously assess or collect the proposed ~$1,250–$1,700 charge.

## Human intervention

Per Scenario 002's "Human controls identified" (`product.md` Section 8), potential human outcomes include:

- confirm damage
- mark as pre-existing
- request more evidence
- dismiss the AI finding
- escalate dispute

These map to the Correction primitive (`context/behaviors.md` primitive 7), which is squarely demonstrated by this scenario. Exact UI controls for these outcomes were not designed as part of the Product System (`product.md` Section 8: "Exact UI controls are not yet designed").

## Resolution alternatives

Not applicable to this scenario as documented — this scenario is about liability determination, not equipment availability, so Resolution Alternatives (`context/behaviors.md` primitive 9) is not required here (see that document's coverage matrix).

## Unresolved policy

Carried forward from `product.md`, not resolved here:

- Which human role determines customer liability, and what minimum evidence is required — `product.md` Section 9, "Damage and liability."
- Is a secondary inspection mandatory for AI-flagged damage? — `product.md` Section 9.
- What happens when evidence remains inconclusive after correction is attempted, and what customer dispute process exists — `product.md` Section 9; `context/behaviors.md`, Correction gap entry.
- What monetary thresholds trigger manager vs. owner approval, and who may waive or refund a charge — `product.md` Section 7.3, Section 9 ("Financial actions").
- The underlying record change a Correction produces (e.g., waiving a charge) may need its own governance treatment, not yet resolved — `context/behaviors.md` primitive 7.
- Rule 009 mutable-state dependencies for this feature's Prepared Action (the draft damage report) have not been identified/approved — see "Mutable state dependencies" above.

## Evaluation expectations

Per `context/evaluation/evaluation-system.md` and Scenario 002's own lessons (`product.md` Section 8):

- The Finding must keep observation, comparison, and inference distinguishable (Rule 005) — never state the inference as settled fact.
- Evidence-quality limitations must be surfaced, not hidden (Rule 003).
- The agent must not autonomously assess, collect, or waive any charge, or state a liability conclusion.
- The Prepared Action (draft damage report) must be routed to Escalation, not Approval, consistent with this scenario's governance decision — a generated implementation that instead gates it behind ordinary Approval would misrepresent this scenario's resolved governance.
- Correction outcomes offered to the reviewing human should include, at minimum, the five outcomes Scenario 002 identifies (confirm / mark pre-existing / request more evidence / dismiss / escalate dispute), since no other set is documented.

## Source references

- `product.md` Section 2.2, 2.3 (Damage, Inspection, Evidence, Charge)
- `product.md` Section 3 (Agent capability model)
- `product.md` Section 4.1 (capability vs. governance; the "Prepare and Escalate together" correction)
- `product.md` Section 6, Rules 001, 003, 004, 005, 008
- `product.md` Section 7.1 ("Suspected damage")
- `product.md` Section 7.3, 7.4, Section 9 (Financial actions; Damage and liability, UNRESOLVED)
- `product.md` Section 8, Scenario 002
- `context/behaviors.md` primitives 1, 2, 3, 4, 6, 7, 8 (Finding, Evidence Inspection, Recommendation, Prepared Action, Escalation, Correction, Progress)
