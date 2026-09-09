/**
 * FEATURE REVIEW v1 demo — Context Analysis content for the one pre-tested
 * feature specimen (PREDICT RESERVATION CONFLICTS / FEATURE-001). Derives
 * the Contera side panel's five-domain findings from the same canonical
 * getters the rest of the app uses (lib/context/index.ts) rather than
 * hardcoding a parallel copy of product/behavior/governance meaning. This
 * module curates selection, sequencing, and human-readable summary
 * language only — every citation traces to a real record in
 * context/data/*.json, to CONFLICT_NOTICE_BINDINGS (the actual, reviewed
 * ContextBinding declarations for this feature's surface), or to a named
 * file/section where no structured getter exists yet.
 *
 * Information-design shape (per the FEATURE REVIEW v1 refinement pass):
 * every domain separates a short, ID-free Level 1 human finding from a
 * Level 2/3 `trace` of the semantic IDs and canonical citations backing
 * it. The UI decides how much of `trace` to reveal; this module never
 * drops the underlying traceability to produce nicer prose.
 *
 * design-system.md and components.md have no JSON getters (a documented
 * Foundation Gap, context/id-scheme.md §5) — their two domains below cite
 * file/section directly, the same convention already used in
 * components/reservation-detail/governance-surface.ts's own comments.
 *
 * Scoped to this one demo specimen — not a general feature-evaluation
 * engine. Do not generalize without a Product Context change.
 */
import { getProductOntology, getInteractionPrimitives, getPolicyRegistry } from "@/lib/context";
import { CONFLICT_NOTICE_BINDINGS } from "@/components/reservation-detail/conflict-notice.bindings";

export const FEATURE_REQUEST = {
  title: "PREDICT RESERVATION CONFLICTS",
  request:
    "Help branch staff identify when a rental may be returned too late to prepare the equipment for the next reservation. Give them a way to contact the current renter before the conflict occurs.",
} as const;

export type DomainId = "product" | "behaviors" | "design-system" | "components" | "governance";
export type DomainStatus = "clean" | "attention";

/** One Level 2/3 traceability line — a real semantic ID plus its human label. */
export interface TraceEntry {
  id: string;
  label: string;
  detail?: string;
}

export interface DomainResult {
  id: DomainId;
  label: string;
  question: string;
  status: DomainStatus;
  /** Label the Level 1 finding block itself, matching the source language ("found" vs "derived"). */
  findingsLabel: "CONTERA FOUND" | "CONTERA DERIVED";
  /** Level 1: what Contera looked at, in plain language. Omitted where the findings alone are self-explanatory. */
  checkedSummary?: string;
  /** Level 1: short, ID-free conclusions. This is the primary reading experience. */
  findings: string[];
  /** Optional short factual badge line, e.g. rule/primitive counts — always a real derived count, never invented. */
  metric?: string;
  /** Components domain only: the human-readable interaction-primitive sequence this proposal reuses. */
  chain?: string[];
  /** Level 2/3: the real IDs and citations backing checkedSummary/findings, for progressive disclosure. */
  trace: {
    checked: TraceEntry[];
    derived: TraceEntry[];
  };
}

export interface UnresolvedItem {
  id: string;
  title: string;
  question: string;
  /** Level 2/3: the canonical policy-registry question this was derived from. */
  note: string;
}

export interface SummaryMetrics {
  domainsEvaluated: number;
  rulesApplied: number;
  primitivesImplicated: number;
  unresolvedCount: number;
}

export interface FeatureReviewAnalysis {
  domains: DomainResult[];
  derivedBehavior: string[];
  unresolved: UnresolvedItem[];
  summaryMetrics: SummaryMetrics;
}

/**
 * The Experience Rules and Interaction Primitives this feature's own
 * surface actually cites, derived from CONFLICT_NOTICE_BINDINGS rather
 * than hand-picked — this is the real, reviewed set of ContextBindings
 * for ConflictNotice, so the counts below are exactly as traceable as the
 * shipped implementation. Evidence Inspection (PRIMITIVE-002) is
 * functionally present in ConflictNotice's "View details" disclosure but
 * is not declared as a binding, so it is correctly excluded here rather
 * than asserted on this module's own authority.
 */
const CITED_RULE_IDS = Array.from(new Set(CONFLICT_NOTICE_BINDINGS.flatMap((b) => b.ruleIds ?? []))).sort();
const CITED_PRIMITIVE_IDS = Array.from(
  new Set(CONFLICT_NOTICE_BINDINGS.map((b) => b.primitiveId).filter((id): id is string => Boolean(id)))
);

function buildProductDomain(): DomainResult {
  const ontology = getProductOntology();
  const rental = ontology.core_objects.find((o) => o.semantic_id === "OBJECT-RENTAL")!;
  const reservation = ontology.core_objects.find((o) => o.semantic_id === "OBJECT-RESERVATION")!;
  const equipment = ontology.core_objects.find((o) => o.semantic_id === "OBJECT-EQUIPMENT")!;
  const readyTime = ontology.core_objects.find((o) => o.semantic_id === "OBJECT-ESTIMATED-READY-TIME")!;
  const turnaround = ontology.core_objects.find((o) => o.semantic_id === "OBJECT-EQUIPMENT-TURNAROUND-REQUIREMENT")!;
  const conflictRelationship = ontology.relationships.find((r) => r.subject === "derived-conflict-relationship")!;

  return {
    id: "product",
    label: "PRODUCT",
    question: "What does AI need to know about the product?",
    status: "clean",
    findingsLabel: "CONTERA FOUND",
    checkedSummary:
      "Rental, reservation, and equipment records — plus how expected return time and equipment readiness relate.",
    findings: [
      "The current rental and the next reservation can target the same equipment, which is what makes a conflict possible.",
      "Equipment readiness is a calculated value, not just the scheduled return time — and how that calculation itself is done is still an open question.",
    ],
    trace: {
      checked: [
        { id: rental.semantic_id, label: "Rental", detail: rental.status },
        { id: reservation.semantic_id, label: "Reservation", detail: reservation.status },
        { id: equipment.semantic_id, label: "Equipment", detail: equipment.status },
      ],
      derived: [
        {
          id: "derived-conflict-relationship",
          label: "Rental ↔ downstream Reservation conflict",
          detail: conflictRelationship.description,
        },
        {
          id: readyTime.semantic_id,
          label: "Estimated Ready Time",
          detail: `${readyTime.status} — ${readyTime.formula}`,
        },
        {
          id: turnaround.semantic_id,
          label: "Equipment Turnaround Requirement",
          detail: `${turnaround.status} — ${readyTime.unresolved}`,
        },
      ],
    },
  };
}

function buildBehaviorsDomain(): DomainResult {
  const registry = getPolicyRegistry();
  const primitives = getInteractionPrimitives();
  const rules = CITED_RULE_IDS.map((id) => registry.experience_rules.find((r) => r.semantic_id === id)!);
  const primitiveList = CITED_PRIMITIVE_IDS.map((id) => primitives.primitives.find((p) => p.semantic_id === id)!);

  return {
    id: "behaviors",
    label: "BEHAVIORS",
    question: "How should the product behave?",
    status: "clean",
    findingsLabel: "CONTERA DERIVED",
    findings: [
      "Predicted lateness remains an inference, not a fact.",
      "The evidence behind that prediction stays inspectable, not reduced to a confidence score.",
      "AI may prepare renter outreach, but may not send it.",
      "A human must approve before the outreach sends.",
      "The facts this outreach depends on are rechecked immediately before it can send.",
    ],
    metric: `${rules.length} Experience Rules applied · ${primitiveList.length} interaction primitives implicated`,
    trace: {
      checked: rules.map((r) => ({ id: r.semantic_id, label: r.title })),
      derived: primitiveList.map((p) => ({ id: p.semantic_id, label: p.name, detail: p.purpose })),
    },
  };
}

function buildDesignSystemDomain(): DomainResult {
  return {
    id: "design-system",
    label: "DESIGN SYSTEM",
    question: "How should those behaviors be presented?",
    status: "clean",
    findingsLabel: "CONTERA DERIVED",
    findings: [
      "The predicted-conflict summary stays in the neutral, unstyled Finding treatment.",
      "The drafted outreach carries the Prepared-tier accent thread — never a background fill.",
      "Evidence and prepared-action detail stay behind progressive disclosure, not all shown at once.",
      "Approve & Send is the one place the product's single accent color may appear at full strength.",
    ],
    trace: {
      checked: [
        { id: "design-system.md §3", label: "Governance-tier visual language" },
        { id: "design-system.md §6", label: "Progressive disclosure" },
        { id: "design-system.md §1", label: "Accent-color scarcity rule" },
      ],
      derived: [
        { id: "design-system.md §3", label: "Finding tier", detail: "White surface, gray-100 border, no color — never a fill." },
        { id: "design-system.md §3", label: "Prepared Action tier", detail: "accent-200 thread, icon, and label — never a fill." },
        { id: "design-system.md §1", label: "Approval tier", detail: "accent-500 reserved to exactly the label and the Approve/Send fill." },
      ],
    },
  };
}

function buildComponentsDomain(): DomainResult {
  const primitives = getInteractionPrimitives();
  const primitiveList = CITED_PRIMITIVE_IDS.map((id) => primitives.primitives.find((p) => p.semantic_id === id)!);

  return {
    id: "components",
    label: "COMPONENTS",
    question: "How does behavior become reusable UI?",
    status: "clean",
    findingsLabel: "CONTERA DERIVED",
    findings: ["This proposal is composed entirely from existing interaction patterns — no new component type is required."],
    chain: primitiveList.map((p) => p.name),
    trace: {
      checked: [
        { id: "COMPONENT-FINDING", label: "Finding contract", detail: "components.md §1" },
        { id: "COMPONENT-PREPARED-ACTION", label: "Prepared Action contract", detail: "components.md §2" },
        { id: "COMPONENT-APPROVAL", label: "Approval contract", detail: "components.md §3" },
      ],
      derived: [
        {
          id: "canAdvancePastPreparation",
          label: "Governance guard",
          detail: "An unresolved governance outcome cannot silently default to Approval Required — this action's governance is explicitly resolved, not defaulted.",
        },
        ...primitiveList.map((p) => ({ id: p.semantic_id, label: p.name })),
      ],
    },
  };
}

function buildGovernanceDomain(unresolved: UnresolvedItem[]): DomainResult {
  const registry = getPolicyRegistry();
  const primitives = getInteractionPrimitives();
  const approvalRequired = registry.governance_outcomes.outcomes.find((o) => o.name === "ApprovalRequired")!;
  const resolutionAlternativesGap = primitives.coverage_matrix.rows.find(
    (r) => r.primitive === "Resolution Alternatives"
  )!;

  return {
    id: "governance",
    label: "GOVERNANCE & EVALUATION",
    question: "Is the proposed change permitted and consistent?",
    status: "attention",
    findingsLabel: "CONTERA FOUND",
    findings: [
      "AI may observe, recommend, and prepare this action.",
      "Sending it requires a human's explicit approval.",
      `${unresolved.length} product decisions remain unresolved — see below.`,
    ],
    trace: {
      checked: [
        { id: "ApprovalRequired", label: approvalRequired.name, detail: approvalRequired.description },
        { id: "product.md §9", label: "Unresolved-policy registry" },
      ],
      derived: [
        {
          id: "RULE-007",
          label: "Resolution Alternatives — known gap",
          detail: `This proposal does not offer alternative equipment or schedule options; it stops at contacting the current renter. ${resolutionAlternativesGap.scenario_001}`,
        },
        ...unresolved.map((u) => ({ id: u.id, label: u.title, detail: u.note })),
      ],
    },
  };
}

function buildUnresolved(): UnresolvedItem[] {
  const registry = getPolicyRegistry();
  const findPolicy = (id: string) => {
    for (const category of registry.unresolved_policy_registry.categories) {
      const found = category.questions.find((q) => q.id === id);
      if (found) return found;
    }
    throw new Error(`Unknown policy id: ${id}`);
  };

  const approver = findPolicy("POLICY-011");
  const turnaround = findPolicy("POLICY-001");
  const channel = findPolicy("POLICY-007");

  return [
    { id: approver.id, title: "Authorized approver", question: "Who is allowed to approve renter outreach?", note: approver.text },
    {
      id: turnaround.id,
      title: "Required Turnaround Time",
      question: "How should required preparation time be determined?",
      note: turnaround.text,
    },
    { id: channel.id, title: "Communication channel", question: "Which channel should renter outreach use?", note: channel.text },
  ];
}

export function buildFeatureReviewAnalysis(): FeatureReviewAnalysis {
  const unresolved = buildUnresolved();

  return {
    domains: [
      buildProductDomain(),
      buildBehaviorsDomain(),
      buildDesignSystemDomain(),
      buildComponentsDomain(),
      buildGovernanceDomain(unresolved),
    ],
    derivedBehavior: [
      "The prediction must remain an inference, never presented as a known fact.",
      "The evidence behind it must stay inspectable, not reduced to a confidence score.",
      "The agent may prepare renter outreach, but may not send it.",
      "A human must approve before the outreach sends.",
      "The five facts this outreach depends on must be rechecked immediately before it sends.",
      "The downstream customer is not contacted based on the prediction alone.",
    ],
    unresolved,
    summaryMetrics: {
      domainsEvaluated: 5,
      rulesApplied: CITED_RULE_IDS.length,
      primitivesImplicated: CITED_PRIMITIVE_IDS.length,
      unresolvedCount: unresolved.length,
    },
  };
}
