# Contera Implementation Binding Registry

**Status:** Reserved architectural seam. This directory exists so that when the demo application, Context Explorer, Context Inspector, and Context Lab are eventually built, there is already an agreed place and format for a rendered surface to declare which Context System entities govern it. **No bindings are populated yet, because no application exists yet.**

**This is not part of `/context`.** `/context` is product-authored and governed by the process in `context/product.md` §10 (Change governance). `/registry` describes *implementation* — which screens/components exist and what they claim to implement — which is an Engineering concern, not a Product/Design one. Keeping it outside `/context` preserves the rule in `context/manifest.md` §7: JSON under `context/data/` is a structured representation of Markdown meaning, never a place for application facts to accumulate.

---

## What a binding is — and is not

A **binding** is a declaration, attached to a rendered surface (a component, screen, or panel), of which Context System entities that surface implements or is governed by. It exists so that:

- **Context Inspector** can take a rendered element and answer "what governs this?" by resolving its binding back through `context/id-scheme.md`'s semantic IDs to the actual canonical documents.
- **Context Lab** and **Evaluation** can ask "which surfaces implement Feature 001 / Rule 009 / the Approval primitive?" without re-deriving that from source code.

**A binding is a declaration of traceability, not a grant of authority.** Declaring `governanceOutcome: "Permitted"` on a binding does not make an action permitted — the actual governance outcome is, and remains, whatever `context/product.md` and `context/policy-registry.json` say it is. A binding that is wrong, stale, or missing changes nothing about what the underlying code is actually authorized to do; it only makes the (correct or incorrect) claim about that authorization visible for inspection. An implementation binding must never be treated as, or implemented as, an override of Product Context. If a binding and the Context System ever disagree, the Context System wins, exactly as `context/manifest.md` §3 already establishes for every other artifact in this system.

## The convention

A binding is a small, flat, serializable record. All fields are optional except `surfaceId`, because a given surface may only be governed by some of the nine reference categories in Product Context — a pure presentation-only surface, for instance, may have no `governanceOutcome` at all.

Every reference field's value must be a semantic ID from `context/id-scheme.md` — never a section number, never a bare human-readable name. This is what makes a binding resolvable rather than just descriptive prose.

```ts
/**
 * Contera implementation binding.
 *
 * Declares which Context System entities govern a single rendered surface.
 * TRACEABILITY ONLY — see the "What a binding is — and is not" section
 * above. This type must never be extended with a field that grants,
 * modifies, or overrides authority; if a surface needs new authority, that
 * is a context/product.md change, not a binding field.
 *
 * All entity references use the semantic IDs defined in
 * context/id-scheme.md (RULE-###, PRIMITIVE-###, FEATURE-###, POLICY-###,
 * EVAL-###, OBJECT-<NAME>, ACTOR-<NAME>, COMPONENT-<NAME>).
 */
interface ContextBinding {
  /** Stable id for the surface itself, assigned by the implementation
   *  (e.g. a component name or route id). Not a Context System id. */
  surfaceId: string;

  /** Which feature this surface implements, if any. e.g. "FEATURE-001" */
  featureId?: string;

  /** Which interaction primitive this surface renders, if any.
   *  e.g. "PRIMITIVE-004" (Prepared Action) */
  primitiveId?: string;

  /** Experience Rules this surface's behavior must satisfy.
   *  e.g. ["RULE-002", "RULE-009"] */
  ruleIds?: string[];

  /** Product Ontology Core Objects this surface reads or displays.
   *  e.g. ["OBJECT-RENTAL", "OBJECT-RESERVATION"] */
  objectIds?: string[];

  /** The actor this surface is built for, if role-specific.
   *  e.g. "ACTOR-BRANCH-MANAGER" */
  actorId?: string;

  /** The Operations Agent capability tier this surface exercises or
   *  displays, if any — mirrors product.md §3's four tiers exactly.
   *  Do not redefine this union independently of product.md. */
  agentCapability?: "Observe" | "Recommend" | "Prepare" | "Execute";

  /** The governance outcome this surface is currently rendering under.
   *  Mirrors components.md's GovernanceOutcome type exactly — do not
   *  redefine this union independently. Declaring a value here is a
   *  claim to be verified against context/product.md and
   *  context/data/policy-registry.json, not a source of truth in itself. */
  governanceOutcome?:
    | "Permitted"
    | "ApprovalRequired"
    | "EscalationRequired"
    | "Prohibited"
    | "UNRESOLVED";

  /** Which components.md implementation contract this surface's data
   *  conforms to, if any. e.g. "COMPONENT-PREPARED-ACTION" */
  componentId?: string;

  /** Which evaluation scenarios this surface should be checked against.
   *  e.g. ["EVAL-001"] */
  evalScenarioIds?: string[];
}
```

## Where populated bindings will live

`registry/bindings/` is reserved for the populated registry — one record (or one file) per rendered surface, once the demo application exists. It is intentionally empty today; see `registry/bindings/README.md`.

## Explicitly deferred (not built in this pass)

- No bindings are populated — there is nothing to bind to yet.
- No resolver, validator, or lookup tool is implemented against this type.
- No decision is made here about *how* a binding attaches to a real component (a prop, a decorator, a sidecar file, a build-time annotation) — that is an Engineering/framework decision to make once the application's tech stack is chosen, which is explicitly out of scope for this pass.
- No `current` vs. `target` state distinction is modeled on a binding yet (see the architecture audit's brownfield note) — every field above describes target-state intent only. Adding a `state: "current" | "target"` axis later, if needed, should extend this interface rather than replace it.
