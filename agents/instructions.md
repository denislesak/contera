# Instructions for AI Coding Agents Operating Against the Contera Context System

**Authority note, read first:** Nothing in this document grants an AI coding agent any authority that `context/product.md` does not itself grant. This document tells you *how to find* the applicable rule, permission, governance outcome, or gap in the Contera Context System before you touch code — it does not give you standing to decide a product question the Product Context leaves open. If you are ever unsure whether you are following this procedure or substituting your own judgment for a missing product decision, assume the latter and stop.

This document is procedural only, per `context/manifest.md` §2 and §9. It is subordinate to every canonical document under `context/`.

---

## Before implementing or modifying a feature

Work through these steps in order. Do not skip ahead to implementation because a step "seems obvious" — the point of this system is that product meaning lives in the documents, not in what seems obvious.

### 1. Read the manifest

Start with `context/manifest.md`. It establishes the authority hierarchy (`context/product.md` > `context/behaviors.md` > `context/components.md` > `context/design-system.md`, with features/data/evaluation as derived and non-authoritative), the epistemic-status vocabulary (DEFINED / WORKING HYPOTHESIS / UNRESOLVED), and the enforcement-strength vocabulary ([TYPE] / [GUARD] / [DOC]). Everything below assumes you already know these.

### 2. Identify affected product objects

Consult `context/product.md` §2 (or `context/data/product-ontology.json` for a structured lookup) to name every Core Object, actor, relationship, working state, and event your change touches. If your change appears to require a new object, relationship, or state that isn't already present or flagged as a working hypothesis, that is a product-ontology gap — go to step 10, not to your own judgment about what the ontology "should" include.

### 3. Identify applicable Experience Rules

Check `context/product.md` §6 (Rules 001–011), or `context/data/policy-registry.json`'s `experience_rules` array, for every rule your change engages. At minimum, always check:

- Rule 005 (epistemic distinctions) — is your implementation collapsing observation/inference/recommendation/decision into a single stronger claim?
- Rule 008 (no invented policy) — is any part of your implementation filling a gap the documents mark UNRESOLVED?
- Rule 009 (revalidation) — does your action have a mutable-state dependency, and if so, is it revalidated immediately before execution?

If you are implementing one of the three existing features, its feature file already lists the applicable rules — use that list rather than re-deriving it from scratch, but verify it still matches the canonical `product.md` §6 text.

### 4. Identify interaction primitives

Consult `context/behaviors.md` (or `context/data/interaction-primitives.json`) to determine which of the nine primitives (Finding, Evidence Inspection, Recommendation, Prepared Action, Approval, Escalation, Correction, Progress, Resolution Alternatives) your change expresses. Remember: these are an interaction-layer vocabulary, not Product Ontology objects (except Approval, which is both — `product.md` §2.6). Do not invent a tenth primitive without first checking whether the behavior you're building already fits inside one of the nine, extended rather than replaced.

### 5. Identify governance requirements

Determine the governance outcome (Permitted / Approval Required / Escalation Required / Prohibited) that applies to your action, per `context/product.md` §4 and the permission table in §4.3, or the relevant feature file if one exists. Capability (what the agent can technically do) and governance (what it is authorized to do) are separate — never infer governance from capability (`product.md` §4.1).

If the governance outcome for your specific action type is not already established in `product.md`, a feature file, or a prior cross-functional decision, it is **UNRESOLVED for this action**, even if a superficially similar action elsewhere has a resolved governance outcome. Do not generalize a resolved governance decision (e.g., Feature 001's Approval Required) to a different action (e.g., a different communication type) without confirming the source document actually supports that generalization — `product.md` §7.1 is explicit that Feature 001's resolution does not resolve the general policy.

### 6. Check unresolved policy

Search `context/product.md` §9 or `context/data/policy-registry.json`'s `unresolved_policy_registry` for anything relevant to your change. This step exists specifically to catch the gap between "this looks like it should work one way" and "the team has actually decided it works that way." An UNRESOLVED item found here is not a suggestion to pick the most reasonable-sounding answer — see step 10.

### 7. Check relevant component contracts

If your change touches Finding, Prepared Action, or Approval, read the corresponding section of `context/components.md`. Note which invariants are [TYPE] (you cannot violate them without a compile error), which are [GUARD] (you must actually call the named guard function — `canAdvancePastPreparation`, `revalidationRequired`, `mustRecheckBeforeExecution`, `computeApprovalRevalidationRequired`), and which are [DOC] (no mechanism will catch you; this is your responsibility to get right by reading the prose).

### 8. Check design context

Read `context/design-system.md` (or `context/data/design-tokens.json`) for anything your change renders. Confirm you are not using a governance-tier visual treatment (the accent-200 Prepared thread, the accent-500 Approval reservation, the neutral resolved-state glyphs) inconsistently with §3, and that data values use the Systematic voice per §2. If the design system doesn't define a token you need (see `context/data/design-tokens.json`'s `undefined_token_categories`), do not invent one silently — flag it (step 12).

### 9. Identify mutable-state dependencies

For any Prepared Action, explicitly enumerate the facts/fields that could change between preparation and execution (`mutableStateDependencies` in `context/components.md`). If a feature file already lists these for your feature (e.g., Feature 001's five dependencies), use that list and do not silently narrow or widen it without justification traceable to the canonical documents. If no such list exists yet for your feature, that absence is itself a gap to report (step 12), not something to resolve by guessing which fields matter.

### 10. Stop rather than invent consequential missing policy

If steps 2–9 surface a product decision that is UNRESOLVED — a permission, a threshold, an approver role, a data model, an equivalence rule, a channel policy — **stop**. Do not:

- pick the "safest-sounding" default (e.g., treating unresolved governance as Approval Required — `components.md` explicitly rejects this as itself a fabricated policy),
- infer an answer from a superficially similar resolved decision elsewhere,
- implement a placeholder that could be mistaken for a resolved value without labeling it (see the `FixtureValue<T>` convention in `components.md` for how to label prototype fixture data when one exists).

Consequential is the operative word — not every gap blocks all progress. A UI copy question with no product-behavior implication is not the same as an unresolved approver role. If you're unsure whether a gap is consequential, treat it as consequential.

### 11. Implement only when sufficient context exists

Once steps 1–10 are satisfied for the scope of your change — the relevant objects, rules, primitives, governance, and design context are all either resolved or explicitly and safely represented as unresolved (e.g., `blockedByUnresolvedPolicy`, a labeled fixture, a flagged gap) — implement. Do not implement a partial version of a consequential UNRESOLVED item "to make progress"; a half-implemented policy decision is harder to distinguish from a real one than an honest gap.

### 12. Evaluate the resulting implementation

Use `context/evaluation/evaluation-system.md`'s dimensions (§4) and, if applicable, the relevant scenario's lessons (§5) to check your own output before considering the task done. Remember that only [TYPE]-level checks are automatically enforced — everything else, including your own Rule 005 phrasing and Rule 009 revalidation-call-site correctness, requires you to actually verify it, not assume it because the types compiled.

### 13. Report required Context System changes

If your work surfaced something the Context System should record — a new gap, a conflict between canonical documents, a scenario lesson not yet captured, a component contract that turned out to be incomplete — report it explicitly, in the same DEFINED/WORKING HYPOTHESIS/UNRESOLVED and [TYPE]/[GUARD]/[DOC] vocabulary the rest of the system uses. Do not fix it by silently editing a canonical document yourself; per `context/manifest.md` §1 and `product.md` §10.1, humans (Product, Design, Engineering, and relevant domain/business stakeholders) govern changes to the specification. You may propose a diff; you may not adopt it unilaterally.

---

## Summary checklist

- [ ] Read `context/manifest.md`
- [ ] Affected product objects identified (`context/product.md` §2 / `product-ontology.json`)
- [ ] Applicable Experience Rules identified (`context/product.md` §6 / `policy-registry.json`)
- [ ] Interaction primitives identified (`context/behaviors.md` / `interaction-primitives.json`)
- [ ] Governance requirement confirmed, not generalized from an unrelated resolved case
- [ ] Unresolved policy checked (`context/product.md` §9 / `policy-registry.json`)
- [ ] Component contracts checked, [TYPE]/[GUARD]/[DOC] status noted (`context/components.md`)
- [ ] Design context checked (`context/design-system.md` / `design-tokens.json`)
- [ ] Mutable-state dependencies identified for any Prepared Action
- [ ] Stopped and reported, rather than invented, any consequential missing policy
- [ ] Implemented only once sufficient context existed
- [ ] Evaluated the implementation against `context/evaluation/evaluation-system.md`
- [ ] Reported any required Context System changes rather than silently editing canonical documents
