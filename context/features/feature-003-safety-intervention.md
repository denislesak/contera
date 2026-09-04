# Feature 003 — Safety-Critical Equipment Intervention

**Status of this file:** Derived extraction. No independent authority — see `context/manifest.md` §2. Every claim below traces to `context/product.md` Scenario 003 (Section 8) and Section 7.1 ("Safety-critical concern"). This is the least resolved of the three features: `product.md` labels the core behavior a **WORKING HYPOTHESIS**, not DEFINED, and leaves the authorized human role, the exact escalation mechanism, and several interaction primitives explicitly unresolved or ambiguous. This file preserves that low resolution rather than tightening it.

**Relationship to Scenario 003:** This file extracts Scenario 003 ("Possible safety-critical equipment issue", `product.md` Section 8) as a feature-shaped artifact. It does not add anything beyond what that scenario and Section 7.1 already establish.

---

## Purpose

Let the Operations Agent notice a safety-relevant combination of signals (a dictated wear note plus an exceeded manufacturer maintenance interval) that a passed inspection did not surface as a blocker, and prevent ordinary checkout progression long enough for appropriate human safety review — without asserting that the equipment has been conclusively determined unsafe. (`product.md` Section 8, Scenario 003.)

## Trigger

A combination of signals indicating plausible (not confirmed) safety risk on equipment otherwise marked ready for checkout. Scenario 003's instance: Bobcat T66 #2188, shown Available/Reservation assigned/Fueled/Inspection complete, where the prior day's return inspection dictation ("hydraulic line looks a little worn... someone should look at it") was recorded but the inspection was still marked Passed, and hydraulic hose operating hours (1,842) exceed the manufacturer's inspection/replacement recommendation (1,800 hours). No qualified mechanic is at the branch; no equivalent T66 is available; customer arrives in 20 minutes. (`product.md` Section 8.)

## Relevant actors

- **Yard Associate** — recorded the original wear note during return inspection. (`product.md` 2.1, Section 8.)
- **Operations Agent** — observes the combination of signals, explains the basis, avoids asserting "unsafe," and (as a working hypothesis) prevents ordinary checkout progression pending review. (`product.md` 2.1, Section 8.)
- **Qualified mechanic / safety reviewer** — the implied reviewing role; not present at the branch in this scenario, and the exact human role authorized to clear or fail the equipment is **UNRESOLVED**. (`product.md` Section 7.1, Section 7.4, Section 9.)
- **Customer** — arriving to pick up the equipment; a competing consequence if checkout is blocked or delayed. (`product.md` Section 8, "Competing consequences.")

## Relevant product objects

Equipment, Inspection, Maintenance Event, Evidence (the dictated inspection note; maintenance/operating-hours records). (`product.md` 2.2.) The relationship between operational availability, safety status, reservation assignment, and maintenance status is itself **UNRESOLVED** (`product.md` 2.4, Equipment states).

## Agent capabilities

Per Scenario 003's working behavior (`product.md` Section 8):

- **Observe** — identify the combination of the wear note and the exceeded maintenance interval.
- **Observe (explain)** — expose the supporting inspection note, operating hours, and manufacturer recommendation as the basis, not a bare conclusion.
- **Prepare** — assemble safe operational alternatives (equivalent equipment at nearby branches, estimated transfer time, substitute equipment classes, customer schedule flexibility, upgrade options, delivery alternatives).

Whether a discrete Prepared Action instance also exists for a formal "place equipment on safety hold" action, separate from the alternatives-preparation above, is **unresolved** (`context/behaviors.md` coverage matrix, Prepared Action row for Scenario 003).

The agent explicitly must **avoid** claiming "Equipment unsafe" — it should indicate "Safety review required" or equivalent behavioral meaning instead. (`product.md` Section 8, "Working behavior.")

## Governance

As a **WORKING HYPOTHESIS**, the agent should be able to prevent ordinary checkout progression until appropriate human review occurs (`product.md` Section 7.1, "Safety-critical concern"; Section 8). This behaves like Escalation Required in effect, but:

- The specific mechanism is not concretely specified (`context/behaviors.md` coverage matrix: "Not required as specified — outcome likely Escalation, but the exact mechanism is unresolved").
- The target role for escalation is **UNRESOLVED** (`product.md` Section 7.4, Section 9).
- Who is authorized to lift the resulting hold is also **UNRESOLVED** (`product.md` Section 7.1, Section 8; `context/behaviors.md` primitive 8, Progress).

This is the scenario that motivated **Rule 006** (asymmetric evidentiary thresholds for high-consequence uncertainty) — the system does not need proof that the hydraulic line will fail before requiring review or temporarily preventing ordinary progression. (`product.md` Rule 006.)

## Evidence requirements

The system must expose, per Scenario 003's "Working behavior" (`product.md` Section 8):

- the dictated inspection note ("hydraulic line looks a little worn...")
- hydraulic hose operating hours (1,842)
- manufacturer inspection/replacement recommendation (1,800 hours)
- the fact that the inspection was nevertheless marked Passed
- absence of a qualified mechanic at the branch
- absence of equivalent equipment

Evidentiary uncertainty is rated **Moderate** — "There are two signals of risk, but no qualified mechanic has determined the hose unsafe" (`product.md` Section 8, "Working risk assessment").

## Applicable Experience Rules

- **Rule 002** — potential impact and intervention urgency are both High here and must still be represented as independent dimensions, not collapsed (`product.md` Section 8, "Working risk assessment": consequence High on both paths, time sensitivity High).
- **Rule 004** — autonomy should reduce given High consequence and potentially High irreversibility (an unsafe rental that fails could cause injury) (`product.md` Rule 004, Section 8).
- **Rule 005** — "Safety review required," not "Equipment unsafe" — preserves the observation/inference/human-determination distinction (`product.md` Section 8, "Working behavior").
- **Rule 006** — the rule this scenario produced: apply asymmetric thresholds to high-consequence uncertainty; temporary intervention does not require proof of failure (`product.md` Rule 006, Section 8 lesson 2).
- **Rule 007** — when the agent introduces friction (blocking checkout), it should proactively prepare safe alternatives (`product.md` Rule 007, Section 8 "Working behavior": prepare nearby equivalent equipment, transfer time, substitute classes, schedule flexibility, upgrade/delivery alternatives).
- **Rule 010** — this is a high-urgency, high-consequence intervention (pickup in 20 minutes) and should occupy a primary attention region per Rule 010's own logic, using the least interruptive treatment sufficient for the window.

(`product.md` Section 6, Section 8.)

## Mutable state dependencies

Not enumerated for this feature in the source material — same gap as Feature 002. No Rule-009-scoped list exists for this scenario's Prepared Action(s) (the alternatives set). This is an open item, not a resolved "none."

## Permitted behavior

- Observe and surface the combination of wear note and exceeded maintenance interval, with its basis.
- State "safety review required" (or equivalent), not a conclusion of unsafety.
- As a working hypothesis, temporarily prevent ordinary checkout progression pending human review.
- Prepare safe operational alternatives for the customer (nearby equivalent equipment, transfer time, substitute classes, schedule flexibility, upgrade or delivery alternatives).

## Prohibited behavior

- Asserting "equipment unsafe" without a qualified determination supporting that statement (`product.md` Section 8, "Working behavior").
- Making a final determination to remove the equipment from service, clear it, or return it to service — the authorized role for this is **UNRESOLVED** (`product.md` Section 7.1, Section 7.4).
- Presenting the blocking hold as resolved or removable without human review, given no override mechanism is defined for the human who may lift it.

## Human intervention

A human safety review is required before checkout proceeds, but the Product System does not specify who performs it, what determination options they have, or what happens after (`product.md` Section 7.1: "The exact human role authorized to clear or fail the equipment is UNRESOLVED"). `context/behaviors.md` notes this is "Partial/underspecified — a human determination is clearly implied but the spec gives no defined menu of outcomes, unlike Scenario 002" (Correction row, coverage matrix).

## Resolution alternatives

**Required** — this is the scenario that most concretely demonstrates the Resolution Alternatives primitive (`context/behaviors.md` primitive 9, coverage matrix): nearby equivalent equipment, estimated transfer time, substitute equipment classes, customer schedule flexibility, upgrade options, or delivery alternatives (`product.md` Section 8, "Working behavior"). Note: the "equivalent equipment" concept used here is broader than Feature 001's scoped definition (which is specific to Feature 001's own trigger condition) and has no defined equivalence rule of its own for this scenario (`context/behaviors.md`, Resolution Alternatives gap entry).

## Unresolved policy

Carried forward from `product.md`, not resolved here:

- The exact human role authorized to clear, fail, or return equipment to service — `product.md` Section 7.1, Section 7.4.
- Who can place or remove a safety hold, and when a qualified mechanic is required — `product.md` Section 9, "Safety and maintenance."
- Which manufacturer recommendations are advisory versus mandatory policy — `product.md` Section 9.
- Under exactly what conditions AI may temporarily block checkout based on a safety signal — `product.md` Section 9.
- The relationship between operational availability, safety status, reservation assignment, and maintenance status — `product.md` Section 2.4.
- The exact escalation mechanism and target role for a safety review — `product.md` Section 7.4, Section 9; `context/behaviors.md` primitive 6.
- Whether a discrete Prepared Action for a formal safety hold exists, distinct from the alternatives-preparation — `context/behaviors.md` coverage matrix.
- A defined menu of human determination outcomes for this scenario's Correction step (Scenario 002 has one; this scenario does not) — `context/behaviors.md` primitive 7.
- An equivalence rule for "equivalent equipment" at this scenario's broader scope (beyond Feature 001's narrow definition) — `context/behaviors.md` primitive 9.
- Rule 009 mutable-state dependencies for this feature's Prepared Action(s).

## Evaluation expectations

Per `context/evaluation/evaluation-system.md` and Scenario 003's own lessons (`product.md` Section 8):

- The system must never render "equipment unsafe" as a stated conclusion; only "safety review required" or equivalent hedged language (Rule 005).
- Impact and urgency must both be represented, and both are High here — this is the scenario where they coincide, unlike Scenario 001 (Rule 002).
- The temporary block must not require proof of failure to justify itself (Rule 006) — a generated implementation must not gate the hold behind a burden of proof the Product System explicitly rejects.
- Resolution Alternatives must be prepared and presented alongside the hold (Rule 007) — a generated implementation that only blocks without offering alternatives fails this scenario's core lesson.
- Because the authorized reviewing/override role is UNRESOLVED, a generated implementation must not silently pick a role (e.g., defaulting to "Branch Manager") without flagging that this is an assumption requiring product/business decision.

## Source references

- `product.md` Section 2.1 (Yard Associate), 2.2 (Equipment, Inspection, Maintenance Event), 2.4 (Equipment states, UNRESOLVED)
- `product.md` Section 3 (Agent capability model)
- `product.md` Section 6, Rules 002, 004, 005, 006, 007, 010
- `product.md` Section 7.1 ("Safety-critical concern"), 7.4 (Safety authority, UNRESOLVED)
- `product.md` Section 8, Scenario 003
- `product.md` Section 9 ("Safety and maintenance")
- `context/behaviors.md` primitives 1, 2, 4, 6, 7, 8, 9 (Finding, Evidence Inspection, Prepared Action, Escalation, Correction, Progress, Resolution Alternatives)
