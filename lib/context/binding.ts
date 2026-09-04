/**
 * Contera implementation binding type.
 *
 * Mirrors the convention documented in /registry/README.md exactly. A
 * binding declares which Context System entities a rendered surface
 * implements — a declaration of traceability only, never a grant of
 * authority. All entity references are semantic IDs from
 * context/id-scheme.md (RULE-###, PRIMITIVE-###, FEATURE-###, POLICY-###,
 * EVAL-###, OBJECT-<NAME>, ACTOR-<NAME>, COMPONENT-<NAME>).
 *
 * No bindings are populated by this file. See /registry/README.md and
 * /registry/bindings/README.md.
 */
export interface ContextBinding {
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
   *  displays, if any — mirrors product.md §3's four tiers exactly. */
  agentCapability?: "Observe" | "Recommend" | "Prepare" | "Execute";

  /** The governance outcome this surface is currently rendering under.
   *  Mirrors components.md's GovernanceOutcome type exactly — a claim to
   *  be verified against context/product.md, not a source of truth. */
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
