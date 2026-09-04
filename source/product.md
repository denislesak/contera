# Contera Product System

**Version:** 0.2  
**Status:** Working behavioral specification  
**Purpose:** Source of truth for product-system analysis, AI-assisted product evolution, and future experience generation.

## Specification status vocabulary

This document uses three explicit status labels:

- **DEFINED** — The cross-functional team has explicitly established this behavior or model in the current working specification.
- **WORKING HYPOTHESIS** — A provisional model adopted so it can be tested against scenarios. It may change as the team learns.
- **UNRESOLVED** — Required product or business policy has not yet been decided. AI must not silently invent the missing policy.

---

# 1. Purpose and scope

**DEFINED**

Contera is a working concept for an enterprise SaaS platform supporting equipment-rental operations. It is being used as a laboratory for exploring AI-native product design and, specifically, how a cross-functional Product, Design, and Engineering team can define product behavior in a form that AI systems can analyze, generate against, and evaluate.

The current exercise is not primarily about designing screens. It is about defining the behavioral system that future interfaces and implementations must preserve.

The working product-development hypothesis is:

1. A product team maintains an explicit product model, behavioral rules, permissions, risk definitions, and evaluation scenarios.
2. AI can analyze proposed product changes against that system and identify affected objects, states, rules, permissions, risks, conflicts, and missing information.
3. AI may propose changes to the behavioral specification, but humans govern those changes.
4. Once approved, the behavioral system can be used by AI to generate candidate experiences and implementation.
5. Humans evaluate generated behavior and implementation against the specification and evaluation scenarios.
6. When failures reveal a systemic problem, the team should prefer correcting the underlying behavioral/design system over repeatedly patching individual screens.

The specification is intentionally incomplete. Missing product policy must remain visible as missing policy rather than being filled with plausible assumptions.

---

# 2. Product ontology v0.1

## 2.1 Actors

### Counter Agent
**Status: DEFINED**

Handles customer-facing rental operations.

Known capabilities include:

- find or create customers
- create and modify reservations
- check equipment out
- initiate returns
- collect payments
- review inspection results
- communicate with customers

Specific monetary, override, and communication permissions are **UNRESOLVED** unless explicitly defined elsewhere.

### Yard Associate
**Status: DEFINED**

Handles physical equipment movement and inspection.

Known capabilities include:

- identify equipment
- record meter and fuel levels
- photograph equipment
- document damage
- perform return inspections
- flag maintenance concerns
- mark equipment physically available

The exact authority to pass/fail equipment or remove equipment from service is **UNRESOLVED**.

### Branch Manager
**Status: DEFINED**

Responsible for branch operations and exceptions.

Known capabilities include:

- perform most Counter Agent actions
- approve some exceptions
- override some policies
- resolve inventory conflicts
- approve some consequential customer charges
- manage operational priorities

Exact thresholds and override permissions are **UNRESOLVED**.

### Fleet Manager
**Status: DEFINED**

Concerned primarily with equipment utilization and health.

Known capabilities include:

- review fleet condition
- schedule maintenance
- change equipment availability
- relocate equipment
- review utilization

Exact safety, maintenance, and branch-level override authority is **UNRESOLVED**.

### Operations Agent
**Status: DEFINED**

A non-human product actor representing AI capabilities inside Contera. The Operations Agent is not defined as a chatbot or a particular interface.

Potential capabilities include:

- observe product state
- identify anomalies
- combine information across objects
- interpret unstructured information
- recommend actions
- prepare actions
- execute specifically authorized actions
- identify situations requiring human review or escalation

Actual authority is governed separately from capability. The existence of a capability does not imply permission to exercise it autonomously.

---

## 2.2 Core objects

### Customer
**Status: DEFINED**  
A person or organization renting equipment.

### Equipment
**Status: DEFINED**  
A physical rental asset.

### Reservation
**Status: DEFINED**  
Future intent to rent equipment or an equipment type.

### Rental
**Status: DEFINED**  
An active or historical contractual use of equipment by a customer.

### Location
**Status: DEFINED**  
A branch or other operational location where equipment resides or rental activity occurs.

### Inspection
**Status: DEFINED**  
A structured assessment of equipment condition.

### Evidence
**Status: DEFINED**  
Information supporting an observation, inference, recommendation, or decision. Examples include photos, video, voice observations, notes, meter readings, signatures, inspection records, and maintenance records.

### Damage
**Status: DEFINED**  
A recorded or suspected physical condition affecting equipment.

### Maintenance Event
**Status: DEFINED**  
Maintenance work required, scheduled, recommended, or performed on equipment.

### Payment / Charge
**Status: DEFINED**  
A financial transaction or proposed financial transaction associated with a rental or customer.

### Communication
**Status: DEFINED**  
A customer or operational communication such as call, SMS, email, or system-generated message.

### Agent Action
**Status: DEFINED**  
An observation, recommendation, preparation, or execution performed by the Operations Agent.

### Approval
**Status: DEFINED**  
Human authorization associated with an action that requires review before execution.

### Equipment Turnaround Requirement
**Status: WORKING HYPOTHESIS**  
Scenario 001 revealed that a return time alone is insufficient to determine whether a downstream reservation is at risk. The system may require information representing the time or work necessary to make returned equipment ready for its next rental, potentially including inspection, cleaning, refueling, or maintenance.

The exact data model is **UNRESOLVED**.

#### Estimated Ready Time
**Status: DEFINED, approved via Feature 001 cross-functional review**

`Estimated Ready Time = Expected Return Time + Required Turnaround Time`

Conflict detection for a downstream reservation must evaluate Estimated Ready Time against the downstream reservation's pickup time, rather than raw Expected Return Time alone.

How Required Turnaround Time itself is determined (a fixed value, a value that varies by equipment type or condition, or a computed estimate) remains **UNRESOLVED**. This decision defines the formula and its use in conflict detection, not the underlying turnaround data model.

---

## 2.3 Known relationships

**Status: DEFINED unless noted**

A **Customer**:

- has many Reservations
- has many Rentals
- receives Communications

A **Reservation**:

- belongs to a Customer
- requests an Equipment item or equipment type
- may be fulfilled by Equipment
- occurs at a Location
- may become a Rental

A **Rental**:

- belongs to a Customer
- uses Equipment
- may originate from a Reservation
- may have a checkout Inspection
- may have a return Inspection
- may create a Charge
- may create or reference Damage

An **Inspection**:

- evaluates Equipment
- contains or references Evidence
- may identify Damage
- is performed or confirmed by a human actor
- may be assisted by the Operations Agent

An **Agent Action**:

- is triggered by product state, event, user intent, or detected condition
- references Evidence where relevant
- affects one or more product objects
- has an Agent Capability classification
- has a Governance outcome
- may require Approval
- produces an outcome or failure state

An **Approval**:

- is requested for an action
- is granted or rejected by an authorized human actor
- should remain attributable to the approving actor

#### Derived conflict relationship (Feature 001)
**Status: DEFINED as a scoping decision, approved via Feature 001 cross-functional review**

For Feature 001, a potential conflict between an active Rental and a downstream Reservation for the same Equipment or equipment type is represented as a **derived/computed relationship**, evaluated at prediction time rather than persisted as a new core ontology relationship. The team explicitly declined to add a permanent Rental → downstream Reservation relationship or a complete Reservation state model solely for Feature 001. Whether either becomes necessary will be revisited if future implementation analysis demonstrates the need.

---

## 2.4 Working state models

### Rental states
**Status: WORKING HYPOTHESIS**

Potential primary lifecycle:

`Reserved -> Ready for pickup -> Checked out -> Due soon -> Due -> Overdue -> Return initiated -> Inspection in progress -> Inspection complete -> Charges pending -> Closed`

Potential branching or exception states include:

- Damage review required
- Maintenance required
- Dispute

This is not yet an exhaustive or implementation-ready state machine.

### Equipment states
**Status: WORKING HYPOTHESIS**

Potential states include:

- Available
- Reserved
- Checked out
- Return inspection
- Unavailable
- Maintenance
- Transfer pending

The relationship between operational availability, safety status, reservation assignment, and maintenance status remains **UNRESOLVED**.

---

## 2.5 Known events

**Status: WORKING HYPOTHESIS**

Candidate events identified so far:

- `rental_due_soon`
- `rental_overdue`
- `equipment_returned`
- `inspection_started`
- `damage_detected`
- `damage_uncertain`
- `inspection_completed`
- `maintenance_required`
- `payment_failed`
- `reservation_conflict_detected`
- `customer_contacted`
- `approval_requested`
- `approval_granted`
- `approval_rejected`
- `agent_action_failed`

Event payloads, triggering conditions, and persistence rules are **UNRESOLVED**.

---

## 2.6 Relationship to interaction primitives

**Status: DEFINED, approved via cross-functional reconciliation review.**

The Product Ontology above describes entities Contera knows about and operates on. It does not describe how agent behavior is expressed to, or controlled by, a human — that is a separate concern, addressed in the companion document `behaviors.md`, which defines a set of interaction primitives (Finding, Evidence Inspection, Recommendation, Prepared Action, Approval, Escalation, Correction, Progress, Resolution Alternatives) as a distinct interaction-layer vocabulary.

Finding and Prepared Action are interaction primitives, not Core Objects of this ontology, and this specification does not add them as such. An Agent Action's capability tier may be *expressed through* an interaction primitive — Observe through Finding, Recommend through Recommendation, Prepare through Prepared Action, Execute through execution/progress behavior — but that expression is an interaction-layer concern. Primitive-level identifiers used there for rendering, state-tracking, or audit linkage (e.g., a `findingId` or `preparedActionId` in the machine-readable component documentation) do not, by themselves, make those primitives first-class persisted objects of this ontology.

**Approval is the one exception.** It is both a Core Object of this ontology (2.2, 2.3), representing recorded human authorization, and an interaction primitive in the companion document, representing the human authorization experience. The two are the same underlying concept viewed from two angles — the record and the experience of creating that record — not two independent things, and not a case of a UI-layer primitive lacking an ontology counterpart.

This section does not define a persistence architecture for Finding or Prepared Action. Whether they are implemented as views over Agent Action, as independent application-layer records referencing Agent Action, or as some other structure is an Engineering decision outside the scope of this specification.

---

# 3. Agent capability model v0.1

**Status: DEFINED as a conceptual model; specific action mappings remain partly UNRESOLVED.**

Capability describes what kind of work the Operations Agent is technically/product-wise capable of performing. Capability does **not** determine whether the agent is permitted to perform that action autonomously.

## Observe

The agent may identify, classify, compare, summarize, or structure information without committing a consequential change to product or world state.

Examples:

- identify a potential reservation conflict
- detect a visible dent in a return image
- compare checkout and return evidence
- summarize maintenance history
- identify that a maintenance interval has been exceeded

## Recommend

The agent may suggest an action or next step but does not prepare or execute the action.

Examples:

- recommend contacting a current renter
- recommend a secondary equipment inspection
- recommend manager review

## Prepare

The agent may assemble the information or artifact needed for an action but does not commit the consequential action itself.

Examples:

- identify the relevant customer and contact channel
- draft an operational SMS
- assemble before/after damage evidence
- prepare a damage report
- gather the rental agreement and repair estimate
- prepare alternatives for an inventory or safety conflict

A prepared action should reduce human work to review, correction where necessary, and approval/execution.

## Execute

The agent commits an action that changes product or world state.

Examples could include:

- send a customer communication
- modify a reservation
- change equipment availability
- create a financial transaction

Whether any specific execution is allowed depends on Governance, Permission, Risk, and product policy. No specific execution should be assumed to be permitted merely because it is technically possible.

---

# 4. Governance and permission model v0.1

## 4.1 Capability versus governance

**Status: DEFINED**

Agent capability and governance are separate dimensions.

An agent may be capable of preparing or executing an action while governance determines that the action requires approval, escalation, or is prohibited.

Scenario 002 invalidated the earlier idea that `Observe -> Recommend -> Prepare -> Execute -> Escalate` should be treated as one linear authority ladder. An agent may, for example, **Prepare** an action and then the product may require that action to be **Escalated** for human review.

## 4.2 Governance outcomes

**Status: DEFINED conceptually**

### Permitted
The action may proceed under the current actor's authority and applicable product rules.

### Approval Required
An authorized human must review and explicitly approve the prepared action before execution.

### Escalation Required
The situation or proposed action must be reviewed by a specific role or higher-authority actor before proceeding.

### Prohibited
The actor is not allowed to perform the action under the applicable product policy.

## 4.3 Permission model

**Status: WORKING HYPOTHESIS**

Permission should answer:

> Which actor is allowed to perform which action under which conditions?

Permission is not treated as a Low/Moderate/High risk scale.

The following table contains only examples discussed during scenario analysis. It is **not** an approved comprehensive RBAC policy.

| Action | Operations Agent | Counter Agent | Branch Manager | Owner / higher authority |
|---|---|---|---|---|
| Detect possible damage | Permitted to observe | Permitted | Permitted | Permitted |
| Draft damage report | Permitted to prepare | Likely permitted | Permitted | Permitted |
| Contact renter | UNRESOLVED / conditional | Likely permitted | Permitted | Permitted |
| Send predicted-return-conflict confirmation request (Feature 001) | Execute; Approval Required (approved via Feature 001 cross-functional review) | Not addressed by this decision | Not addressed by this decision | Not addressed by this decision |
| Determine customer liability for disputed/suspected damage | Prohibited under current Scenario 002 decision | UNRESOLVED | Requires human determination; exact role unresolved | UNRESOLVED |
| Assess/collect ~$1,500 damage charge | Prohibited for agent in Scenario 002 | Not permitted in Scenario 002 working decision | Manager review required in Scenario 002 | UNRESOLVED |
| Remove safety-critical equipment from service | Agent may flag/block ordinary progression only as a WORKING HYPOTHESIS; final authority unresolved | UNRESOLVED | UNRESOLVED | UNRESOLVED |

The "Send predicted-return-conflict confirmation request (Feature 001)" row is scoped to that specific action and does not resolve the general "Contact renter" row or the broader autonomous-communication policy in 7.2.

## 4.4 Delegated agent authority

**Status: UNRESOLVED / future design area**

The team has identified temporary or scoped delegation as an important future interaction problem. Example:

> "Automatically send routine return reminders for the next four hours."

No delegation model, duration rules, revocation behavior, audit requirements, or delegation limits have been defined yet.

---

# 5. Risk model v0.1

**Status: WORKING HYPOTHESIS**

The risk model exists to help the team reason about appropriate agent autonomy and human intervention. It does not independently determine product policy.

## 5.1 Consequence

Question:

> How harmful would an incorrect action or conclusion be?

### Low
An incorrect action would create negligible customer, operational, financial, legal, or safety harm.

### Moderate
An incorrect action could create meaningful customer friction, operational disruption, or financial loss.

### High
An incorrect action could create substantial financial, customer, legal, safety, or business harm.

**Important:** Consequence is severity, not probability. A low-probability event may still have High consequence.

## 5.2 Irreversibility

Question:

> How difficult would the outcome be to undo?

### Low
Easily undone with little residual effect.

### Moderate
Can be undone, but requires meaningful effort or leaves consequences after reversal.

### High
Cannot practically be undone, or creates lasting consequences even if a formal reversal is possible.

Examples discussed:

- drafting an SMS: Low
- sending an SMS: potentially Moderate because it cannot literally be unsent
- charging a credit card: potentially Moderate because it can be refunded but customer impact may remain
- making a consequential external accusation/report: potentially High

These examples are illustrative, not final policy.

## 5.3 Evidentiary uncertainty

Question:

> How well does available evidence support the system's understanding or proposed action?

### Low
Relevant facts are available, consistent, and sufficiently reliable.

### Moderate
Some information is missing, ambiguous, inferred, or conflicting, but a reasonable conclusion may still be possible.

### High
Critical evidence is missing, unreliable, or contradictory enough that a consequential conclusion cannot safely be reached.

The model should distinguish human certainty from evidentiary certainty. Two humans may each feel certain while available evidence remains conflicting.

## 5.4 Time sensitivity

Question:

> How quickly must intervention occur to prevent or materially reduce the potential consequence?

### Low
Delay is unlikely to materially change the outcome.

### Moderate
Action is required within a meaningful operational window.

### High
Delay could imminently create or materially increase harm.

Time sensitivity emerged from Scenario 003 and is related to, but distinct from, potential impact.

## 5.5 Probability / likelihood

**Status: UNRESOLVED**

The team explicitly separated probability from consequence but has not yet determined whether probability should be a first-class risk dimension, how it should be calculated, or whether it should be surfaced to users.

---

# 6. Experience Constitution v0.1

These rules are **DEFINED working product principles**. They may be revised through future scenario evaluation and cross-functional approval.

## Rule 001 — Resolve material uncertainty before consequential action

When missing or conflicting information could materially change a consequential outcome, seek the strongest available evidence before recommending or executing that outcome.

This rule evolved from the earlier formulation "resolve uncertainty at its source," which proved too person-centric in Scenario 002.

## Rule 002 — Separate potential impact from intervention urgency

Potential consequence and required intervention timing are independent dimensions. Do not use one generic severity value to represent both.

A situation may have high potential customer or business impact while still allowing time for measured intervention.

## Rule 003 — Prefer inspectable evidence over opaque confidence

When practical, expose the observations, evidence, limitations, and assumptions supporting an AI inference rather than relying on an unexplained numerical confidence score.

The team has not prohibited confidence scores, but numerical confidence must not substitute for inspectable reasoning/evidence.

## Rule 004 — Reduce autonomy as consequence and irreversibility increase

Agent authority should consider the potential impact of an incorrect action and how easily that action can be reversed.

This rule is directional rather than a complete decision algorithm.

## Rule 005 — Preserve the distinction between observation, inference, recommendation, and human decision

The system must not collapse different epistemic stages into a stronger claim than the evidence supports.

Example chain:

`Observation -> Comparison -> Inference -> Recommendation -> Human determination -> Business action`

Example from Scenario 002:

- Observation: return image contains a visible dent.
- Comparison: dent is not clearly visible in checkout evidence.
- Inference: damage may have occurred during the rental.
- Recommendation: conduct secondary inspection.
- Human determination: determine whether damage occurred during rental.
- Business action: assess or waive a charge according to policy.

The AI must not silently transform "possible new damage" into "customer damaged equipment."

## Rule 006 — Apply asymmetric thresholds to high-consequence uncertainty

When plausible outcomes have materially different severity, the evidentiary threshold for proceeding should reflect the more consequential failure mode.

A system does not necessarily need proof that a high-consequence failure will occur before requiring additional review or temporarily preventing ordinary progression.

This rule emerged from Scenario 003's possible hydraulic-line safety issue.

## Rule 007 — When AI introduces friction, help resolve the consequences

If the system blocks, delays, or escalates an action, it should proactively identify safe paths forward where possible rather than merely stopping the user.

Examples may include finding substitute equipment, nearby inventory, transfer options, schedule alternatives, or other safe resolutions.

## Rule 008 — Do not substitute assumptions for missing product policy

**Status: DEFINED following the first external AI specification-readiness test.**

When required product behavior, policy, permissions, evidence, or domain information is undefined, the system must identify the gap and request human resolution rather than silently inventing a rule.

This rule applies both to AI inside Contera and to AI assisting the product team in maintaining Contera's product specification.

## Rule 009 — Revalidate mutable state before consequential execution

**Status: DEFINED, approved via Feature 001 cross-functional review**

An agent must confirm that the facts and conditions supporting a prepared action remain valid immediately before execution when relevant state may have changed.

This rule establishes the general principle. It does not by itself specify which fields or conditions must be revalidated for any particular action — that remains to be defined per action as it arises (see Section 9, Agent execution).

Rule 010 — Prioritize interventions according to urgency and consequence

Status: DEFINED, proposed via Feature 001 experience evaluation

Intelligent interventions should be placed according to the urgency and consequence of the user decision, not merely according to the information architecture of the underlying data.

When an intervention is time-sensitive and its usefulness materially decays with delay, it may temporarily supersede the normal hierarchy of the surrounding experience and occupy a primary attention region.

Use the least interruptive treatment sufficient for the intervention window and potential consequence.

Rule 011 — Use progressive disclosure to minimize decision burden

Status: DEFINED, proposed via Feature 001 experience evaluation

Show only the information necessary to understand the situation and make the immediate decision.

Supporting evidence, reasoning, provenance, uncertainty details, and prepared-action metadata should remain inspectable when relevant, but need not be simultaneously visible.

Disclosure depth should increase when additional information is necessary to evaluate uncertainty, consequence, or the proposed action.

---

# 7. Known permission assumptions and boundaries

This section deliberately distinguishes established decisions from assumptions that arose while discussing scenarios.

## 7.1 Established scenario-specific boundaries

### Suspected damage
**Status: DEFINED for Scenario 002 working behavior**

The Operations Agent may:

- observe possible damage
- compare checkout and return evidence
- recommend secondary inspection
- prepare supporting evidence and a draft damage report

The Operations Agent may not:

- determine customer liability
- autonomously assess or collect the proposed ~$1,250–$1,700 damage charge in Scenario 002

Manager review is required before consequential customer action in that scenario.

### Safety-critical concern
**Status: WORKING HYPOTHESIS from Scenario 003**

When evidence indicates a plausible safety-critical concern, the Operations Agent should be able to prevent ordinary checkout progression long enough to require appropriate human review, without claiming that the equipment has conclusively been determined unsafe.

The exact actor authorized to clear, fail, or return equipment to service is **UNRESOLVED**.

### Predicted rental conflict outreach (Feature 001)
**Status: DEFINED for Feature 001 working behavior, approved via cross-functional review; lifecycle and revalidation detail clarified via reconciliation review.**

When the Operations Agent predicts that an active Rental's Estimated Ready Time may jeopardize a downstream Reservation for the same Equipment, and no equivalent equipment is available, the outreach is a single Agent Action (2.3) that progresses through two capability phases before it has any customer-facing effect:

1. **Prepare.** The agent assembles the renter-outreach communication — a confirmation-request message, per Scenario 001's working decision — as a Prepared Action (behaviors.md, primitive 4), linked to the Finding/Recommendation that identified the predicted conflict. This phase's governance outcome is Permitted: assembling the draft does not itself require review.
2. **Execute.** Sending/committing the assembled communication is the consequential step. This phase's governance outcome is **Approval Required**: an authorized human must review and explicitly approve the Prepared Action (behaviors.md, primitive 5) before this Agent Action's capability classification advances to Execute and the communication is actually sent.

This resolves an ambiguity in the prior wording of this section, which labeled the agent's capability "Execute" while simultaneously describing the action as merely "prepared, ready-to-send" — conflating the Prepare and Execute phases into one line. Modeling this as a single Agent Action whose capability classification progresses from Prepare to Execute, gated by Approval Required, is consistent with the rest of the Product System and does not require any new ontology surface:

- Section 3's own capability examples already draw this line — "draft an operational SMS" is Prepare-tier, "send a customer communication" is Execute-tier.
- Section 4.1 already separates capability from governance, so an Approval Required gate between the two phases of one action is expected, not exceptional.
- The Progress interaction primitive (behaviors.md, primitive 8) already tracks a single Agent Action's capability tier as a value that changes over that action's lifecycle, together with its governance outcome, as two independent values — this is exactly the mechanism this lifecycle relies on.
- The Prepared Action / Approval primitive split (behaviors.md, primitives 4–5) already models Approval as the gate between a Prepared Action and its execution, not as part of the artifact itself.

This is modeled as one Agent Action moving through two capability phases, not as two separate persisted Agent Action objects — the ontology's Agent Action (2.3) already carries a capability classification as a single record attribute, and Progress already tracks that classification changing over time, so introducing a second Agent Action instance per outreach would add ontology surface this document does not propose. Whether an Agent Action's capability classification is generally mutable over its lifecycle, beyond this feature, is not resolved here; this entry is scoped to Feature 001's outreach action only.

- Autonomous (unreviewed) execution of the Execute phase may be reconsidered once sufficient product evidence demonstrates that predictive operational outreach is appropriate and useful.

**Equivalent equipment, for Feature 001:** equipment that satisfies the functional requirements of the downstream reservation and can be made available at the required location before the scheduled pickup time. This definition is scoped to Feature 001. The general question of what constitutes an equivalent replacement item across other features remains **UNRESOLVED** (see Section 9).

**Revalidation (Rule 009), scoped to Feature 001.** Immediately before the Execute phase — i.e., immediately before the approved communication is actually sent — the following mutable-state dependencies must be revalidated, because a change in any of them could invalidate or materially alter the prepared outreach:

- **Current renter's Expected Return Time** — a direct input, together with Required Turnaround Time, to Estimated Ready Time (2.2); a materially different expected return time can change or dissolve the predicted conflict the outreach exists to address.
- **Downstream reservation pickup time** — the value Estimated Ready Time is compared against (2.2); if the downstream reservation's pickup time changes, or the reservation is cancelled, the predicted conflict may no longer hold.
- **Equipment assignment** — whether the current Rental and the downstream Reservation still resolve to the same Equipment or equipment type (2.3, Derived conflict relationship); a reassignment on either side means the derived conflict relationship this outreach was prepared for may no longer apply.
- **Equipment availability/status** — specifically, whether an equivalent replacement (as defined above) has since become available; Feature 001's trigger condition explicitly requires that none be available, so this becoming true removes the outreach's entire rationale.
- **Required Turnaround Time** — the other input to Estimated Ready Time (2.2); a revised turnaround estimate changes Estimated Ready Time and can change or dissolve the predicted conflict.

This list is scoped to this Agent Action only, per Rule 009's own conditional wording ("when relevant state may have changed") and Section 9's note that per-action revalidation requirements are defined per action as they arise. It does not generalize a revalidation checklist to any other action type, and other candidate inputs not listed here (e.g., customer contact-detail changes unrelated to timing or equipment) were not included because a change in them would not, on its own, invalidate or materially alter this specific prediction.

**Prototype/fixture note.** For prototype purposes, some inputs to this feature may be supplied as labeled fixture/mock data rather than production values, without that fixture data resolving the corresponding open policy question. In particular: Required Turnaround Time's production calculation method remains **UNRESOLVED** (2.2); Customer communication channel selection remains **UNRESOLVED** (7.2, general policy, unaffected by this note). See `components.md` for how such fixture data is labeled in the machine-readable documentation. Fixture data used this way is not, and must not be read as, a resolution of these open policy questions.

This entry resolves the "Contact renter" ambiguity in the 4.3 permission table only for this specific action. It does not resolve the broader autonomous-communication policy in 7.2.

## 7.2 Customer communication

**Status: UNRESOLVED**

The team has not established whether the Operations Agent may autonomously send routine operational communication.

Questions still requiring policy include:

- Is human approval always required before agent-generated communication is sent?
- Are routine reminders eligible for autonomous execution?
- What customer consent/opt-out rules apply?
- What channels are allowed?
- What happens if a human has recently contacted the customer?
- What happens if product state changes after a message is prepared but before it is sent?
- Are there account states, disputes, or customer segments where automated contact is prohibited?

## 7.3 Financial actions

**Status: UNRESOLVED except for Scenario 002 boundary**

No general monetary thresholds have been established for Counter Agents, Branch Managers, owners, or the Operations Agent.

## 7.4 Safety authority

**Status: UNRESOLVED**

The organization has not yet defined which human roles may:

- remove equipment from service
- override a safety hold
- approve equipment after a flagged inspection
- determine when a qualified mechanic is required

## 7.5 Overrides and exceptions

**Status: UNRESOLVED**

No complete override hierarchy or exception policy has been defined.

---

# 8. Evaluation scenarios 001–003

These scenarios are not merely feature examples. They are behavioral tests used to reveal weaknesses in the product model and Experience Constitution.

## Scenario 001 — Predicted inventory collision

### Situation
**Status: DEFINED evaluation scenario**

Time: 8:00 AM.

Bob's Construction currently has:

- Equipment: Bobcat T66 #4421
- Scheduled return: 9:00 AM

Another customer has reserved a Bobcat T66:

- Pickup: 11:00 AM

No equivalent T66 is currently available.

Historical data shows Bob's Construction returns equipment an average of 1 hour 47 minutes late.

No communication has occurred yet.

### Initial AI opportunity

The Operations Agent can identify a potential downstream inventory conflict that conventional software might require a human to notice manually.

### Important epistemic distinctions

Known facts include:

- current renter
- equipment identity
- scheduled return
- next reservation time
- lack of equivalent available equipment

Predictive evidence includes:

- historical lateness behavior

Potential inference:

- the current rental may return late enough to threaten the downstream reservation

### Missing information discovered

The scenario revealed that return time alone is insufficient. Contera may need an Equipment Turnaround Requirement or equivalent operational data representing inspection, cleaning, refueling, or other work required before the next rental.

For illustration, if expected return were 10:47 AM and expected turnaround were 30 minutes, estimated readiness would be 11:17 AM. However, the 30-minute value was illustrative and is not established policy/data.

### Working decision

- Surface the situation: Yes.
- Potential impact: High customer impact if unresolved.
- Intervention priority: Action needed, not necessarily urgent at 8:00 AM because the conflict is predicted rather than actual.
- Recommended action: Contact the current renter to confirm expected return time.
- Agent capability: Prepare.
- Initial governance: human review before sending communication, pending unresolved communication policy.

### Evidence a human should be able to inspect

- current renter identity and preferred contact information
- downstream customer/reservation identity where appropriate
- equipment identity
- scheduled return time
- anticipated return time and the basis for that prediction
- next reservation time
- equivalent replacement inventory
- equipment turnaround requirement, if available

### Lessons produced

1. Potential impact and intervention urgency must be separate.
2. Predictions must not be presented as known facts.
3. Resolve material uncertainty before unnecessarily involving downstream affected parties.
4. The ontology was missing turnaround requirements.
5. Opaque confidence percentages may be less useful than exposing the evidence and assumptions driving the prediction.

---

## Scenario 002 — Suspected new equipment damage

### Situation
**Status: DEFINED evaluation scenario**

Time: 4:15 PM.

Bob's Construction returns Bobcat T66 #4421.

At checkout, Contera stored eight photographs of the equipment. During return, the Yard Associate photographs the required angles again.

The Operations Agent compares checkout and return evidence and detects what appears to be a new dent and scrape on the right rear panel.

Known contextual information:

- Checkout photos: no obvious damage detected in that area.
- Return photos: visible dent/scrape.
- Rental agreement: customer is responsible for damage occurring during the rental.
- Estimated repair cost based on similar repairs: $1,250–$1,700.
- Customer security deposit: $2,000.

Complication:

The checkout photograph of the relevant panel was taken in poor lighting and part of the area is obscured by mud.

### Working risk assessment

- Consequence: High because of financial impact and dispute potential.
- Intervention priority: Action needed; not necessarily immediate/urgent.
- Evidentiary uncertainty: Material/Moderate because checkout evidence is incomplete.

### Working behavior

The Operations Agent may:

- Observe: identify visible damage in return evidence.
- Compare: identify that the damage is not clearly visible in checkout evidence.
- Infer: state that damage may have occurred during the rental.
- Recommend: request a secondary human inspection.
- Prepare: assemble evidence, relevant rental information, repair estimate, and a draft damage report.

The Operations Agent may not:

- conclude that the customer caused the damage
- determine customer liability
- autonomously assess or collect the proposed charge

Governance:

- Manager review required before consequential customer action in this scenario.

### Evidence presentation requirement

The system should expose:

- checkout evidence
- return evidence
- timestamps
- highlighted or otherwise inspectable visual difference where useful
- inspection records
- known prior damage history if available
- relevant rental agreement
- repair estimate
- evidence-quality limitations

### Human controls identified

Potential human outcomes include:

- confirm damage
- mark as pre-existing
- request more evidence
- dismiss AI finding
- escalate dispute

Exact UI controls are not yet designed.

### Lessons produced

1. Rule 001 evolved from "resolve uncertainty at its source" to "resolve material uncertainty before consequential action."
2. Capability and governance cannot be represented as one linear ladder.
3. Prepare and Escalate may occur together.
4. Reversibility/irreversibility matters to agent autonomy.
5. Observation, inference, recommendation, human determination, and business action must remain distinct.
6. Evidence limitations must be visible.

---

## Scenario 003 — Possible safety-critical equipment issue

### Situation
**Status: DEFINED evaluation scenario**

Time: 7:40 AM.

A construction company is scheduled to pick up a Bobcat T66 at 8:00 AM.

Contera shows T66 #2188 as:

- Available
- Reservation assigned
- Fueled
- Inspection complete

The Operations Agent notices a potentially important combination of information.

During yesterday's return inspection, the Yard Associate dictated:

> "Hydraulic line looks a little worn. Probably fine for another rental but someone should look at it."

The inspection was nevertheless marked Passed.

Maintenance records show:

- hydraulic hose operating hours: 1,842
- manufacturer inspection/replacement recommendation: 1,800 hours

No qualified mechanic is currently at the branch.

No equivalent T66 is available.

Customer arrives in 20 minutes for a job where workers may be waiting for the machine.

### Competing consequences

If Contera blocks or delays the rental:

- customer impact may be High
- revenue/operational impact may be High

If Contera allows the rental and the hydraulic line fails:

- potential safety impact may be High

### Working risk assessment

- Consequence: High on both paths, with safety potentially more severe.
- Irreversibility: allowing a potentially unsafe rental could have High irreversibility if failure causes injury; blocking/delaying the rental is more reversible but still has residual customer/business cost.
- Evidentiary uncertainty: Moderate. There are two signals of risk, but no qualified mechanic has determined the hose unsafe.
- Time sensitivity: High because pickup occurs in 20 minutes.

### Working behavior

The Operations Agent should:

- Observe: identify the combination of wear note and exceeded maintenance interval.
- Explain: expose the supporting inspection note, operating hours, and manufacturer recommendation.
- Avoid claiming: "Equipment unsafe" unless a qualified determination supports that statement.
- Indicate instead: "Safety review required" or equivalent behavioral meaning.
- As a WORKING HYPOTHESIS, prevent ordinary checkout progression until appropriate human review occurs.
- Prepare safe operational alternatives where possible, such as equivalent equipment at nearby branches, estimated transfer time, substitute equipment classes, customer schedule flexibility, upgrade options, or delivery alternatives.

The exact human role authorized to clear or fail the equipment is UNRESOLVED.

### Lessons produced

1. Safety can require asymmetric evidentiary thresholds.
2. High-consequence uncertainty may justify temporary intervention before proof of failure exists.
3. Time sensitivity is distinct from consequence and evidentiary uncertainty.
4. Permission is separate from risk.
5. When AI introduces friction, it should help resolve the operational consequences.

---

# 9. Open questions and unresolved policies

This list is intentionally explicit. AI analyzing Contera must not resolve these items by invention.

## Product ontology / domain model

- What is the authoritative equipment-turnaround model?
- Are inspection, cleaning, refueling, and maintenance separate required objects/states or attributes of turnaround?
- How are safety status and operational availability represented?
- What constitutes an equivalent replacement item? (Partially resolved for Feature 001 only — see Section 7.1, "Predicted rental conflict outreach." The general definition across other features remains unresolved.)
- How is prior equipment damage recorded and reconciled?

## Customer communication

- May the Operations Agent ever autonomously send operational communication? (For Feature 001 specifically, this is Execute + Approval Required, not autonomous — see Section 7.1. The general policy across other communication types remains unresolved.)
- Which communication types require approval?
- What consent, opt-out, channel, and timing rules apply?
- How should duplicate/recent human communication suppress agent action?
- What revalidation is required immediately before sending a prepared message? (Rule 009 now establishes the general principle that mutable state must be revalidated before consequential execution; the specific fields/conditions to revalidate for this action type remain unresolved.)

## Permissions and RBAC

- What are the complete permissions for Counter Agent, Yard Associate, Branch Manager, Fleet Manager, and owner/higher authority?
- What financial thresholds apply to each role?
- Which actions require dual approval?
- Can humans temporarily delegate scoped authority to the Operations Agent?
- How are delegated permissions revoked or expired?

## Financial actions

- Who may assess damage charges?
- Who may collect charges?
- Who may waive or refund charges?
- What thresholds trigger manager or owner approval?
- How should active disputes affect financial execution?

## Damage and liability

- Which human role determines customer liability?
- What minimum evidence is required?
- Is a secondary inspection mandatory for AI-flagged damage?
- What happens when evidence remains inconclusive?
- What customer dispute process exists?

## Safety and maintenance

- Who can place equipment on a safety hold?
- Who can remove a safety hold?
- When is a qualified mechanic required?
- Which manufacturer recommendations are advisory versus mandatory policy?
- Can AI temporarily block checkout based on a safety signal, and under exactly what conditions?

## Risk model

- Should likelihood/probability become a formal dimension?
- Should risk dimensions map algorithmically to governance, or remain inputs to human-defined policy?
- Are Low/Moderate/High sufficient for all dimensions?
- How should multiple simultaneous consequences be represented?
- How should safety/legal risk override customer/revenue considerations?

## Confidence and evidence

- Should numerical confidence ever be shown to users?
- What evidence-provenance metadata must be retained?
- How should conflicting sources be represented?
- How should model-generated interpretations be corrected and propagated?

## Agent execution

- What actions are eligible for autonomous execution?
- What state must be revalidated immediately before execution? (Rule 009 establishes the general principle. Per-action revalidation requirements remain unresolved.)
- What happens when execution partially fails?
- Which actions require rollback support?
- How should agent action history and auditability work?

## Evaluation

- What constitutes a passing behavioral test?
- Which scenarios should block release if they fail?
- How should AI output quality be evaluated separately from deterministic product behavior?
- Which scenarios require human usability testing versus automated behavioral evaluation?

---

# 10. Change governance

## 10.1 Core principle

**Status: DEFINED**

AI may analyze and propose changes to the Contera product specification. AI must not silently redefine product policy.

Product, Design, Engineering, and relevant domain/business stakeholders retain authority over specification changes.

## 10.2 Proposed AI-assisted change workflow

**Status: WORKING HYPOTHESIS**

For a proposed feature or product change:

1. **Feature/problem input**  
   A human or system provides the proposed change, problem, or opportunity.

2. **System analysis**  
   AI reviews the existing Contera specification before proposing changes.

3. **Impact analysis**  
   AI identifies affected:
   - actors
   - objects
   - relationships
   - states
   - events
   - experience rules
   - permissions
   - agent capabilities
   - governance outcomes
   - risk dimensions
   - user experiences
   - evaluation scenarios

4. **Gap/conflict detection**  
   AI identifies:
   - conflicts with existing rules
   - missing policy
   - contradictory behavior
   - insufficient evidence
   - undefined permissions
   - assumptions required by the request

5. **Proposed behavioral diff**  
   AI may propose:
   - new rules
   - modifications to existing rules
   - deprecated/redundant rules
   - ontology changes
   - state/event changes
   - permission/governance changes
   - new evaluation scenarios

6. **Cross-functional review**  
   AI should explicitly separate decisions requiring:
   - Product judgment
   - Design judgment
   - Engineering judgment
   - Domain/business stakeholder judgment

7. **Human approval**  
   Humans accept, reject, or modify proposed specification changes.

8. **Specification update**  
   Only approved changes become part of the working source of truth.

9. **Experience / implementation generation**  
   AI may then use the approved specification and design system to generate candidate experience and implementation.

10. **Evaluation**  
    Generated behavior is tested against relevant evaluation scenarios and human review.

11. **System correction**  
    When a failure reflects an incomplete or incorrect system rule, the team should update the underlying specification rather than only patching the local interface.

## 10.3 Behavioral diff expectation

**Status: WORKING HYPOTHESIS**

AI-proposed changes should be reviewable as a product-behavior diff analogous to a code diff. The team should be able to understand:

- what changed
- why it changed
- which existing behavior is affected
- which assumptions are being introduced
- which scenarios validate the change

No formal diff schema has been established yet.

## 10.4 Specification completeness

**Status: DEFINED principle; implementation UNRESOLVED**

Before performing product-system analysis, AI should verify that required referenced sections and dependencies are actually present.

If the specification references a permission model, ontology, risk definition, or evaluation scenario whose substantive content is missing, AI should stop and identify the missing dependency rather than fabricate it.

This requirement emerged from the first external AI-readiness test, in which an AI correctly refused to reason against a document that contained headings and summaries without the substantive specification.

---

# 11. Current evaluation objective

The next planned experiment is to provide this specification to an external AI acting as a product-system analyst and ask it to first evaluate whether the specification is sufficiently complete and internally coherent to support feature impact analysis.

If it identifies gaps, contradictions, or ambiguities, those findings should be reviewed by humans before issuing the first feature request.

Once readiness is sufficient, the planned first feature request is:

> Contera should automatically contact the current renter when the system predicts that their late return may jeopardize an upcoming reservation for the same equipment and no equivalent replacement equipment is available. The goal is to reduce inventory conflicts and prevent customers with upcoming reservations from arriving to find their reserved equipment unavailable.

The external AI should analyze the request against this specification rather than being given the team's previous conclusions as an answer key.

---

# 12. Version notes

## v0.2

Approved via cross-functional review of Feature Request 001 (Predicted Rental Conflict). Summary of changes:

- Added Rule 009 (revalidate mutable state before consequential execution).
- Added the Estimated Ready Time derived value under Equipment Turnaround Requirement, and required conflict detection to use it in place of raw return time.
- Resolved, for Feature 001 only, the agent capability and governance for predicted-return-conflict outreach (Execute; Approval Required), and defined "equivalent equipment" for that feature's scope.
- Documented a deliberate decision not to add a permanent Rental → downstream Reservation relationship or a complete Reservation state model for Feature 001; a derived/computed relationship is used instead.
- Updated related open questions in Section 9 to reflect what is now partially resolved versus still unresolved.

No other unresolved items were changed. All Feature-001-scoped decisions are explicitly marked as scoped and do not resolve the corresponding general policy questions.

### v0.2 — addendum (ontology/interaction-primitive layering)

Approved via cross-functional reconciliation review of the interaction-primitives, shadcn-implementation-analysis, and component-documentation artifacts. Summary of changes:

- Added Section 2.6, documenting that the Product Ontology, the Agent Capability model, and the Interaction Primitives (defined in `behaviors.md`) operate at three distinct layers, with an explicit Observe→Finding / Recommend→Recommendation / Prepare→Prepared Action / Execute→Progress mapping.
- Clarified that Finding and Prepared Action are not, and do not become, Core Objects of this ontology merely because they carry their own identifiers in interaction-layer/component documentation.
- Clarified Approval's dual status: a Core Object of this ontology (unchanged from v0.2) and, separately, an interaction primitive representing the authorization experience — the same underlying concept from two angles, not two independent things.
- Did not add Finding or Prepared Action as Core Objects, and did not specify a persistence architecture for either; both remain Engineering decisions outside this document's scope.
- Renamed this document's stored filename from `product-system-v0.1.md` to `product-system-v0.2.md` so it matches the version already stated in this header; no other document previously cited a real file under the `v0.2.md` name, so this closes a pre-existing dangling-reference problem rather than creating one for `behaviors.md` and `components.md`, both of which cite this file by its now-correct name. (This document has since been renamed again, to `product.md`, as part of the project's move from Gearbox to Contera and to GitHub-based version tracking — see that migration's own notes rather than this entry.) Note: `readiness-assessment-v0.1.md` and `feature-001-predicted-rental-conflict-analysis.md`, which predate this rename, still cite the retired `product-system-v0.1.md` filename and were not updated as part of this pass (see the reconciliation report for this detail).

No other unresolved item in Section 9, and no rule, permission, or governance decision, was changed by this addendum.

### v0.2 — addendum 2 (Feature 001 lifecycle and revalidation detail)

Approved via cross-functional reconciliation review, prompted by a second preflight audit. Summary of changes, all confined to Section 7.1's Feature 001 entry:

- Resolved an internal contradiction where Feature 001's outreach was labeled Agent capability "Execute" while being described as merely "prepared, ready-to-send." The entry now explicitly models the outreach as a single Agent Action progressing through a Prepare phase (Permitted) and an Execute phase (Approval Required), consistent with Section 3's own Prepare/Execute examples, Section 4.1, and the Progress and Prepared Action/Approval interaction primitives. No new Agent Action ontology object was introduced.
- Added a Feature-001-scoped list of Rule 009 mutable-state dependencies (current renter Expected Return Time, downstream reservation pickup time, equipment assignment, equipment availability/status, Required Turnaround Time) that must be revalidated immediately before the Execute phase. This list is explicitly scoped to this Agent Action and does not generalize a revalidation checklist to other actions.
- Added a prototype/fixture note clarifying that Required Turnaround Time's production calculation and customer communication channel selection may be represented with labeled fixture data for prototyping, without that data resolving either open policy question (2.2, 7.2). Detailed in `components.md`.

No other unresolved item in Section 9, and no rule, permission, or governance decision outside this scoped clarification, was changed.

## v0.1

Created from the first three Contera behavioral-design scenarios and subsequent cross-functional-model discussion.

Key discoveries represented in this version:

- product behavior should be modeled separately from screens
- agent capability and governance are separate dimensions
- permission is not a risk scale
- consequence is separate from probability
- irreversibility affects appropriate autonomy
- evidentiary uncertainty should focus on evidence quality rather than subjective confidence
- time sensitivity is distinct from consequence
- observation, inference, recommendation, human determination, and business action must remain distinguishable
- high-consequence uncertainty may require asymmetric intervention thresholds
- AI-created friction should be paired with resolution paths
- missing policy must remain explicit rather than being silently invented
- AI may help maintain the product behavioral system, but humans govern changes to that system