# Contera Context System — Semantic ID Scheme

**Status of this file:** Structural/organizational artifact, ranked alongside `context/manifest.md` — it does not carry epistemic status for product behavior, only for how the Context System's identifiers are organized. See `context/manifest.md` §8 (Traceability expectations), which points here.

**Purpose:** Establish a stable, resolvable identifier for every entity in the Context System that another artifact, a future Context Inspector, or an implementation binding (see `/registry/README.md`) might need to reference — independent of where that entity's prose happens to live in a document. Prose citations like `product.md §7.1` remain useful as human-readable pointers to *where text lives*, and this scheme does not replace them; it adds an identifier for *what the entity is*, which survives a document being restructured, renumbered, or reworded.

**Why this exists:** The architecture audit that preceded this file found that every cross-reference in the Context System was a free-text citation (`product.md §7.1`, `behaviors.md, primitive 4`, `(4.1)`), with no resolvable identifier underneath. That made every future consumer of this system — Context Explorer's navigation, Context Inspector's trace-back, Context Lab's diff-targeting — dependent on parsing prose. This scheme is the fix.

---

## 1. The eight namespaces

| Namespace | Form | Applies to | Numbering source |
|---|---|---|---|
| `RULE-###` | 3-digit, zero-padded | The eleven Experience Rules | The rule's own existing number in `product.md` §6 (001–011) |
| `PRIMITIVE-###` | 3-digit, zero-padded | The nine interaction primitives | The primitive's own existing enumeration in `behaviors.md` (1–9) |
| `FEATURE-###` | 3-digit, zero-padded | The three feature files | The feature's own existing number (already used in the filename, e.g. `feature-001-...md`) |
| `POLICY-###` | 3-digit, zero-padded | Individual unresolved-policy questions in `policy-registry.json`'s `unresolved_policy_registry` | Newly assigned, sequential, in registry order (see §3) — these had no prior number |
| `EVAL-###` | 3-digit, zero-padded | The three evaluation scenarios | The scenario's own existing number in `product.md` §8 ("Scenario 001", "Scenario 002", "Scenario 003") |
| `OBJECT-<NAME>` | SCREAMING-KEBAB-CASE | Product Ontology Core Objects (`product.md` §2.2) | The object's own canonical name |
| `ACTOR-<NAME>` | SCREAMING-KEBAB-CASE | Product Ontology actors (`product.md` §2.1) | The actor's own canonical name |
| `COMPONENT-<NAME>` | SCREAMING-KEBAB-CASE | The implementation contracts in `components.md` | The contract's own canonical name |

**Numeric namespaces (`RULE`, `PRIMITIVE`, `FEATURE`, `POLICY`, `EVAL`)** always use 3-digit zero-padding, even though today's rule/primitive/feature/scenario counts are all under 100 and `POLICY` is under 999. This keeps the format uniform and avoids a future renumbering (e.g. a 10th primitive) changing the digit width of every existing ID.

**Name-based namespaces (`OBJECT`, `ACTOR`, `COMPONENT`)** are formed by taking the entity's canonical name, uppercasing it, and replacing whitespace/punctuation with a single hyphen. Examples: "Counter Agent" → `ACTOR-COUNTER-AGENT`; "Equipment Turnaround Requirement" → `OBJECT-EQUIPMENT-TURNAROUND-REQUIREMENT`; "Prepared Action" → `COMPONENT-PREPARED-ACTION`.

## 2. Rules that govern this scheme

- **IDs are never derived from a Markdown section number, heading position, or line number.** A `POLICY-###` id is a sequential registry assignment, not `POLICY-9.3`. An `OBJECT-<NAME>` id is derived from the object's name, not from "the 4th object in §2.2." This is deliberate: section numbers move when a document is edited; names and pre-existing numbers (rule/primitive/feature/scenario) do not.
- **Existing numbered entities keep their existing numbers.** Rule 009 is `RULE-009`, not renumbered. Primitive 4 (Prepared Action) is `PRIMITIVE-004`, not renumbered. Feature 001 is `FEATURE-001`, matching its filename. Scenario 002 is `EVAL-002`, matching `product.md` §8's own "Scenario 002" label. Nothing in this scheme changes what any of these numbers mean.
- **This scheme adds identifiers; it does not rename or replace existing human-readable fields.** Every JSON record that gained a `semantic_id` (or, for policy questions, an `id`) keeps its original `id`/`name`/`text` field exactly as it was. Prose in the canonical Markdown documents was not rewritten to insert IDs.
- **A semantic ID is a pointer, not an authority.** Assigning `RULE-009` to Rule 009 does not change Rule 009's meaning, status, or content. This scheme is purely an addressing convention — see `context/manifest.md` for what actually governs meaning.

## 3. Where each namespace is populated today

- **`RULE-001` … `RULE-011`** — `context/data/policy-registry.json`, `experience_rules[].semantic_id`. Mirror of `product.md` §6.
- **`PRIMITIVE-001` … `PRIMITIVE-009`** — `context/data/interaction-primitives.json`, `primitives[].semantic_id`. Mirror of `behaviors.md`'s nine primitives, in the same order (Finding=1 through Resolution Alternatives=9).
- **`FEATURE-001` … `FEATURE-003`** — referenced (as `feature_id`) from `context/data/evaluation-scenarios.json` and from `policy-registry.json`'s Feature 001 boundary entry. The three feature files themselves (`context/features/feature-00N-*.md`) are the canonical destination; no separate feature-index file was created (see `context/manifest.md` and the architecture audit — a full feature index is deliberately deferred).
- **`POLICY-001` … `POLICY-048`** — `context/data/policy-registry.json`, `unresolved_policy_registry.categories[].questions[].id`, assigned sequentially in the order the categories and questions already appeared (Product ontology/domain model first, Evaluation last). This is a closed, exhaustive numbering of every question that existed in that registry at the time this scheme was introduced; a newly added unresolved question gets the next unused number, appended — never inserted in a way that would renumber an existing one.
- **`EVAL-001` … `EVAL-003`** — `context/data/evaluation-scenarios.json`, `scenarios[].semantic_id`. Scenario 001 = `EVAL-001`, Scenario 002 = `EVAL-002`, Scenario 003 = `EVAL-003`.
- **`ACTOR-<NAME>`** — `context/data/product-ontology.json`, `actors[].semantic_id`: `ACTOR-COUNTER-AGENT`, `ACTOR-YARD-ASSOCIATE`, `ACTOR-BRANCH-MANAGER`, `ACTOR-FLEET-MANAGER`, `ACTOR-OPERATIONS-AGENT`.
- **`OBJECT-<NAME>`** — `context/data/product-ontology.json`, `core_objects[].semantic_id`: `OBJECT-CUSTOMER`, `OBJECT-EQUIPMENT`, `OBJECT-RESERVATION`, `OBJECT-RENTAL`, `OBJECT-LOCATION`, `OBJECT-INSPECTION`, `OBJECT-EVIDENCE`, `OBJECT-DAMAGE`, `OBJECT-MAINTENANCE-EVENT`, `OBJECT-PAYMENT-CHARGE`, `OBJECT-COMMUNICATION`, `OBJECT-AGENT-ACTION`, `OBJECT-APPROVAL`, `OBJECT-EQUIPMENT-TURNAROUND-REQUIREMENT`, `OBJECT-ESTIMATED-READY-TIME`.
- **`COMPONENT-<NAME>`** — documented here only; `components.md` has no JSON counterpart yet (a full component-contract JSON extraction was flagged in the architecture audit as a Foundation Gap, deliberately not built now). The three assigned IDs are:
  - `COMPONENT-FINDING` — `components.md`, "Finding"
  - `COMPONENT-PREPARED-ACTION` — `components.md`, "Prepared Action"
  - `COMPONENT-APPROVAL` — `components.md`, "Approval"

## 4. A worked example: why namespacing matters (Approval)

"Approval" is the one concept in this system that legitimately has three different IDs, because it is three different things viewed from three different layers (`product.md` §2.6 makes this same layering argument in prose):

| ID | Layer | What it identifies |
|---|---|---|
| `OBJECT-APPROVAL` | Product Ontology | The Core Object: recorded human authorization (`product.md` §2.2–2.3) |
| `PRIMITIVE-005` | Interaction layer | The interaction primitive: the human authorization experience (`behaviors.md`, primitive 5) |
| `COMPONENT-APPROVAL` | Implementation layer | The TypeScript contract for an `Approval` record (`components.md`) |

These three IDs refer to "the same underlying concept from two [or three] angles," in `product.md`'s own words — they are not three competing definitions. A future implementation binding (see `/registry/README.md`) that renders an Approval surface would reasonably reference all three simultaneously: which primitive it implements, which component contract its data conforms to, and (indirectly, via the primitive) which ontology object it authorizes.

## 5. What this scheme deliberately does not do yet

- It does not assign IDs to `evaluation-system.md`'s evaluation dimensions (§4.1–4.9 in that document) — those are still addressed by section reference only. Assigning them a stable ID (likely under a future `EVAL-CHECK-###` or similar namespace) is deferred until the evaluation-checks structure itself is formalized, which the architecture audit placed after Context Lab, not before.
- It does not add `POLICY-###`-style numeric IDs to `known_permission_gaps` or `scenario_specific_boundaries` in `policy-registry.json`. Those already carry stable, name-based identifiers (e.g. `"safety-authority"`, `"suspected-damage"`) that are not derived from section numbers and were judged sufficiently stable as-is; converting them to the `POLICY-###` numeric form was not necessary to close the specific gap this scheme was introduced to fix (individually addressing the 48 previously-unnumbered open questions).
- It does not build a lookup index, resolver function, or `ctx://` URI parser. This document is the specification a future tool would implement against — not that tool.
