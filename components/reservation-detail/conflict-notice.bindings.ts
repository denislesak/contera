/**
 * Implementation bindings for the FEATURE-001 predicted-conflict surface
 * (ConflictNotice), per the ContextBinding convention in
 * /registry/README.md. Traceability declarations only — see that file's
 * "What a binding is — and is not". Not written into /registry/bindings/,
 * which stays reserved/empty per manifest.md §10; this is a local,
 * component-scoped declaration, which is an Engineering choice the
 * registry convention explicitly leaves open.
 *
 * ContextBinding.primitiveId is singular (one binding = one primitive), so
 * this surface's several primitives (Finding, Recommendation, Prepared
 * Action, Approval, Progress) are declared as separate binding records
 * rather than inventing a new array field on the shared type.
 *
 * Known scope boundary (Rule 007 / PRIMITIVE-009): this surface does NOT
 * implement Resolution Alternatives and does NOT satisfy Rule 007.
 * context/behaviors.md's coverage matrix and
 * context/evaluation/evaluation-system.md §4.9 record this as an already
 * -accepted, documented gap in Feature 001 as approved — not something
 * this implementation resolves or should silently paper over. RULE-007 and
 * PRIMITIVE-009 are deliberately absent from every binding below; do not
 * add them without a Product Context change (product.md §10).
 */
import type { ContextBinding } from "@/lib/context/binding";

export const CONFLICT_NOTICE_BINDINGS: ContextBinding[] = [
  {
    surfaceId: "ConflictNotice.finding",
    featureId: "FEATURE-001",
    primitiveId: "PRIMITIVE-001", // Finding
    ruleIds: ["RULE-001", "RULE-002", "RULE-003", "RULE-005", "RULE-008"],
    objectIds: ["OBJECT-RENTAL", "OBJECT-RESERVATION", "OBJECT-EQUIPMENT"],
    actorId: "ACTOR-OPERATIONS-AGENT",
    agentCapability: "Observe",
    governanceOutcome: "Permitted",
    componentId: "COMPONENT-FINDING",
    evalScenarioIds: ["EVAL-001"],
  },
  {
    surfaceId: "ConflictNotice.recommendation",
    featureId: "FEATURE-001",
    primitiveId: "PRIMITIVE-003", // Recommendation
    ruleIds: ["RULE-001", "RULE-002", "RULE-005", "RULE-010", "RULE-011"],
    objectIds: ["OBJECT-CUSTOMER", "OBJECT-COMMUNICATION"],
    actorId: "ACTOR-OPERATIONS-AGENT",
    agentCapability: "Recommend",
    governanceOutcome: "Permitted",
    evalScenarioIds: ["EVAL-001"],
  },
  {
    surfaceId: "ConflictNotice.preparedAction",
    featureId: "FEATURE-001",
    primitiveId: "PRIMITIVE-004", // Prepared Action
    ruleIds: ["RULE-005", "RULE-008", "RULE-009", "RULE-011"],
    objectIds: [
      "OBJECT-AGENT-ACTION",
      "OBJECT-COMMUNICATION",
      "OBJECT-CUSTOMER",
      "OBJECT-EQUIPMENT-TURNAROUND-REQUIREMENT",
      "OBJECT-ESTIMATED-READY-TIME",
    ],
    actorId: "ACTOR-OPERATIONS-AGENT",
    agentCapability: "Prepare",
    governanceOutcome: "ApprovalRequired",
    componentId: "COMPONENT-PREPARED-ACTION",
    evalScenarioIds: ["EVAL-001"],
  },
  {
    surfaceId: "ConflictNotice.approval",
    featureId: "FEATURE-001",
    primitiveId: "PRIMITIVE-005", // Approval
    ruleIds: ["RULE-008", "RULE-009"],
    objectIds: ["OBJECT-APPROVAL", "OBJECT-AGENT-ACTION"],
    // actorId intentionally omitted: the authorized-approver role is
    // UNRESOLVED (product.md §9, full RBAC gap). Asserting an ACTOR-* id
    // here would invent RBAC policy this Context System does not resolve.
    governanceOutcome: "ApprovalRequired",
    componentId: "COMPONENT-APPROVAL",
    evalScenarioIds: ["EVAL-001"],
  },
  {
    surfaceId: "ConflictNotice.progress",
    featureId: "FEATURE-001",
    primitiveId: "PRIMITIVE-008", // Progress
    ruleIds: ["RULE-009", "RULE-010", "RULE-011"],
    objectIds: ["OBJECT-AGENT-ACTION"],
    evalScenarioIds: ["EVAL-001"],
  },
];
