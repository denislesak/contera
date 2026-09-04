# Contera Context System — Manifest

**Status:** DEFINED (this manifest is a structural/organizational artifact, not a product-policy artifact — it does not carry its own epistemic status for product behavior, only for how the Context System is organized).

**Purpose:** This document is the authority map for the Contera Context System. It tells a human or an AI agent what each artifact owns, what it does not own, which artifact wins when two appear to say different things, and in what order to read the system before acting on it.

This manifest does not restate product, behavioral, or design content. It governs how the other artifacts relate to one another.

---

## 1. Provenance

Every artifact under `/context` and `/agents` is derived from exactly four immutable source documents in `/source`:

| Source document | Canonical context document | Governs |
|---|---|---|
| `source/product.md` | `context/product.md` | Product ontology, agent capability model, governance/permission model, risk model, Experience Constitution (Rules 001–011), evaluation scenarios 001–003, open policy questions |
| `source/behaviors.md` | `context/behaviors.md` | Interaction primitives (Finding, Evidence Inspection, Recommendation, Prepared Action, Approval, Escalation, Correction, Progress, Resolution Alternatives) |
| `source/components.md` | `context/components.md` | Machine-readable implementation contracts for Finding, Prepared Action, Approval |
| `source/design-system.md` | `context/design-system.md` | Visual presentation: color, type, governance-tier visual language, icons |

`/source` is immutable. It is never edited, renamed, or deleted as part of maintaining this Context System. When source content changes, that change happens in `/source` first, through whatever process governs that document, and the corresponding `/context` artifact is then re-migrated.

`context/features/*`, `context/data/*`, and `context/evaluation/evaluation-system.md` are **derived** artifacts — they restructure and cross-reference the four canonical documents above. They do not introduce content the canonical documents do not already support.

---

## 2. What each artifact owns — and does not own

### `context/product.md`
**Owns:** product meaning and behavior — actors, core objects, relationships, working state models, events, the agent capability model (Observe/Recommend/Prepare/Execute), the governance/permission model (Permitted/Approval Required/Escalation Required/Prohibited), the risk model (consequence, irreversibility, evidentiary uncertainty, time sensitivity), Experience Rules 001–011, evaluation Scenarios 001–003, and the registry of open/unresolved product policy.
**Does not own:** how agent behavior is expressed to a human (→ `behaviors.md`), implementation data shapes (→ `components.md`), or visual presentation (→ `design-system.md`).
**Authority:** highest. Product meaning and behavior originate here. No other artifact may introduce a product rule, permission, threshold, workflow, or ontology object that is not already present or explicitly flagged as unresolved here.

### `context/behaviors.md`
**Owns:** interaction semantics — the nine interaction primitives, their required/optional information, governance implications, and how they compose (e.g., Prepared Action → Approval or Escalation).
**Does not own:** product ontology (it explicitly does not add Core Objects), implementation types, or visual treatment.
**Authority:** governs *how agent behavior is expressed to and controlled by a human*. It must trace every primitive back to a rule, scenario, capability, or governance requirement in `product.md`. It cannot originate new product policy.

### `context/components.md`
**Owns:** implementation contracts — TypeScript-shaped schemas for Finding, Prepared Action, and Approval, and the [TYPE]/[GUARD]/[DOC] enforcement classification for each invariant.
**Does not own:** product or interaction meaning. A schema field here (e.g., `requiredGovernanceOutcome`) reflects a decision made in `product.md`/`behaviors.md`; it does not make that decision.
**Authority:** subordinate to `product.md` and `behaviors.md`. Where an implementation contract seems to imply behavior beyond what those documents establish, the contract is wrong or incomplete — not authoritative — and the discrepancy should be flagged, not silently coded around.

### `context/design-system.md`
**Owns:** presentation and visual semantics — color, type, the governance-tier visual language, icons, and the (working-hypothesis) hero stat pattern.
**Does not own:** product behavior, governance outcomes, or interaction semantics. It renders meaning defined elsewhere; it does not create meaning.
**Authority:** subordinate to `product.md` and `behaviors.md` for anything behavioral. If a presentation question turns out to require a product-behavior answer (the design system's own stated example: whether a Hero Stat implies a new kind of data should exist), that question belongs to `product.md`, not here.

### `context/features/*`
**Own:** feature-scoped synthesis of the above four documents against a specific scenario (Feature 001 / Scenario 001, Feature 002 / Scenario 002, Feature 003 / Scenario 003). Each feature file traces its claims back to specific sections of the canonical documents.
**Do not own:** any policy not already present in the canonical documents. A feature file may show that a policy question is *relevant* to that feature and still unresolved; it may not resolve it.
**Authority:** none independent of the canonical documents. A feature file is a lens on the canonical documents, not a fifth source of product truth.

### `context/data/*.json`
**Own:** machine-readable, structured representation of information already stated in the canonical Markdown documents — identifiers, enumerations, relationships, cross-references.
**Do not own:** anything not already stated in Markdown. JSON is a structured *representation* of the Markdown, not a second, independent source of truth. Where the source material did not support a complete structure (e.g., a full design token architecture, a defined delegation/expiry model), the JSON represents the gap explicitly (`null`, an empty array, or a `"status": "UNRESOLVED"` field with a `note`) rather than inventing a plausible value.
**Authority:** derivative and non-authoritative. If a JSON file and a Markdown canonical document ever appear to disagree, the Markdown document wins, and the JSON file is treated as stale and in need of re-derivation — not as evidence that the Markdown is wrong.

### `context/evaluation/evaluation-system.md`
**Owns:** the evaluation architecture — how Scenarios 001–003, the Experience Rules, the governance model, evidence requirements, and epistemic-status distinctions are used to judge whether a generated experience or implementation is acceptable.
**Does not own:** product policy, and does not claim automated enforcement of anything the source material does not already enforce (only [TYPE]-level invariants in `components.md` are compiler-enforced; everything else is [GUARD] or [DOC], i.e., process-dependent).
**Authority:** procedural, not substantive — it defines *how* evaluation happens, drawing its substantive criteria entirely from the canonical documents.

### `agents/instructions.md`
**Owns:** the operating procedure a coding agent follows when using this Context System to implement or modify a feature.
**Does not own:** any authority to decide product policy on the Product Context's behalf. It can tell an agent *how to find* the applicable rule, permission, or gap; it cannot grant the agent standing to invent one.
**Authority:** procedural only, and explicitly subordinate to every canonical document above.

---

## 3. Authority hierarchy

When artifacts appear to disagree, resolve in this order:

1. **`context/product.md`** — product meaning, ontology, governance, permissions, risk, Experience Rules, evaluation scenarios.
2. **`context/behaviors.md`** — interaction semantics, subordinate to and must trace to (1).
3. **`context/components.md`** — implementation contracts, subordinate to (1) and (2).
4. **`context/design-system.md`** — presentation, subordinate to (1) for anything behavioral; independent authority only for pure visual/presentation questions that (1) and (2) do not address.
5. **`context/features/*`, `context/evaluation/evaluation-system.md`, `agents/instructions.md`** — derived/procedural; no independent authority over (1)–(4).
6. **`context/data/*.json`** — structured representation of (1)–(4); no independent authority at all.

This mirrors Core Migration Rule 4 in the project's founding instructions: Product Context governs product meaning and behavior; the behavioral/interaction system governs interaction semantics; component documentation describes implementation contracts but does not override product behavior; the Design System governs presentation but must not introduce behavioral rules.

---

## 4. Conflict resolution

- A lower-authority artifact never silently overrides a higher-authority one. If `components.md` or `design-system.md` appears to require behavior that `product.md` does not support, that is a **flagged conflict**, not a resolved question — it is recorded as such (see each canonical document's own cross-reference notes) and left for human/cross-functional resolution, not silently reconciled by whichever document was read last.
- A conflict is different from a **gap**. A gap is missing information (see §6). A conflict is two present statements that cannot both be true. This Context System currently contains no known unresolved conflicts between the four canonical documents — each has already been through at least one cross-functional reconciliation pass, documented in its own change log. If migration or later editing surfaces a new apparent conflict, it must be recorded, not silently resolved by the person or agent who noticed it.
- Feature files and JSON data must never be used to adjudicate a conflict between canonical documents. They inherit the conflict, flagged, until the canonical documents are reconciled.

---

## 5. Epistemic status vocabulary

Used throughout `context/product.md` and, by inheritance, everywhere that document is cited:

- **DEFINED** — The cross-functional team has explicitly established this behavior or model in the current working specification.
- **WORKING HYPOTHESIS** — A provisional model adopted so it can be tested against scenarios. It may change as the team learns.
- **UNRESOLVED** — Required product or business policy has not yet been decided. No artifact in this system may silently convert an UNRESOLVED item into a decision, or a WORKING HYPOTHESIS into DEFINED behavior, on its own authority.

`context/design-system.md` reuses this same three-value vocabulary for presentation-layer claims.

`context/components.md` uses a distinct, narrower vocabulary for *enforcement strength*, not epistemic status — do not conflate the two:

- **[TYPE]** — compiler-enforced. The type system rejects a violating value; no application code needs to run for the guarantee to hold.
- **[GUARD]** — runtime-enforced only if application code actually calls the accompanying guard/derivation function before acting. The type system alone permits violating values to exist.
- **[DOC]** — documentation/process expectation only. No type or runtime mechanism prevents violation. Never describe a [DOC]-level constraint as technically enforced.

A statement can be DEFINED product policy and still only [DOC]-enforced at the implementation layer (e.g., Rule 009's revalidation principle is DEFINED, but whether a specific execution path actually calls the revalidation guard is a [GUARD]-level runtime fact, not something the type system verifies).

---

## 6. How unresolved policy is handled

- An UNRESOLVED item is carried forward verbatim, with its source citation, into every artifact that touches it. It is never quietly dropped, softened into a default, or replaced with a "reasonable" placeholder.
- In JSON (`context/data/*.json`), an unresolved field is represented as `null` or `"UNRESOLVED"` (matching the convention already used in `components.md`'s `GovernanceOutcome` type, which includes `"UNRESOLVED"` as a legitimate value, not an error state) plus a sibling `note` or `unresolved_ref` field citing where the gap is documented in the canonical Markdown.
- In feature files, an unresolved dependency is listed under that feature's "Unresolved policy" section rather than answered.
- Components.md's own pattern is the model for the rest of the system: `blockedByUnresolvedPolicy` is a first-class, machine-detectable state — not a fallback to the nearest-seeming resolved value (the document explicitly rejects defaulting `"UNRESOLVED"` governance to `"ApprovalRequired"` as itself a fabricated policy). Apply that same discipline anywhere else this system represents an open question.

---

## 7. How structured data relates to Markdown

Markdown carries meaning; JSON carries structure. Concretely:

- Every fact in `context/data/*.json` must be traceable to a specific passage in a canonical Markdown document (see §8, Traceability).
- JSON is generated *from* the Markdown, not alongside it as an independent editorial effort. If the Markdown changes, the JSON is stale until re-derived.
- JSON does not contain prose rationale, "why" explanations, or epistemic nuance beyond a status/enum field and a source citation — that belongs in the Markdown. JSON is for identifiers, enumerations, and relationships an agent or tool needs to look up programmatically.
- Where the source material does not support a complete field (e.g., a numeric threshold, a full token scale, a delegation-expiry rule), the JSON says so explicitly rather than omitting the field silently or filling it with an invented value — an omitted field and an unresolved field are not the same thing, and this system treats them differently: fields that don't exist in the ontology at all are omitted; the corresponding source document is silent by design; fields that exist conceptually but lack a settled value carry an explicit `"UNRESOLVED"`/`null` marker.

---

## 8. Traceability expectations

- Every canonical `context/*.md` document should identify, near the top or inline, which `source/*.md` document and section it derives from.
- Every feature file should cite the specific scenario, section, and rule numbers it draws from (e.g., "product.md §7.1", "Scenario 001", "Rule 009").
- Every JSON record should carry a `source` field (document + section identifier) wherever practical. Line numbers are not fabricated — cite section headings and rule/primitive identifiers, which are stable, rather than line numbers, which are not durable across edits.
- Experience Rules keep their numeric identifiers (001–011) unchanged everywhere they are cited, so they remain traceable across `product.md`, `behaviors.md`, feature files, `policy-registry.json`, and `evaluation-system.md`.
- Interaction primitives keep their numeric identifiers (1–9, as enumerated in `behaviors.md`) unchanged everywhere they are cited.
- Governance outcomes (Permitted / Approval Required / Escalation Required / Prohibited) and capability tiers (Observe / Recommend / Prepare / Execute) keep their exact names unchanged everywhere, matching `components.md`'s `GovernanceOutcome` type and `product.md` Section 3's tier names, so a string match against the canonical documents is always possible.

---

## 9. Expected read order for AI agents

Before analyzing or implementing anything against this system, read in this order:

1. **This manifest** — establishes authority and vocabulary.
2. **`context/product.md`** — the product meaning being implemented against.
3. **`context/behaviors.md`** — how that meaning is expressed to a human.
4. **The relevant `context/features/*.md`** file, if the task concerns Feature 001, 002, or 003.
5. **`context/components.md`** — implementation contracts for whatever primitives are in play.
6. **`context/design-system.md`** — presentation constraints.
7. **`context/data/*.json`** — structured lookups to confirm identifiers, cross-references, and any UNRESOLVED markers programmatically, rather than re-deriving them from prose.
8. **`context/evaluation/evaluation-system.md`** — how the resulting work will be judged.
9. **`agents/instructions.md`** — the operating procedure for the implementation step itself.

`agents/instructions.md` restates a condensed version of this order for direct use during implementation; this manifest is the authoritative version.
