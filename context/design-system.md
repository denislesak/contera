# Contera Threshold Design System

**Context System provenance:** This document is the canonical, authoritative presentation/visual-semantics layer — see `context/manifest.md` §2 (subordinate to `context/product.md` and `context/behaviors.md` for anything behavioral; must not introduce behavioral rules). It was originally migrated from `source/design-system.md`; that origin is historical provenance only (`context/manifest.md` §1) — `source/design-system.md` is not resynchronized with this document and carries no current authority. Only what is DEFINED or WORKING HYPOTHESIS below is implemented guidance — where the source material did not support a complete token architecture, that gap is carried into `context/data/design-tokens.json` explicitly rather than filled in.

**Version:** 0.4
**Status:** Working design specification
**Purpose:** Source of truth for Contera's visual presentation layer — color, type, elevation, and the governance-tier visual language. Governs *how things look*, never *what the product does*. It does not modify, and is not modified by, `product.md`, `behaviors.md`, `shadcn-implementation-analysis-v0.1.md`, or `components.md`. Where those documents define governance tiers, capability, or behavior, this document only defines how that meaning is rendered.

This document uses the same status vocabulary as the Product System, for the same reason: **DEFINED** — settled and implemented. **WORKING HYPOTHESIS** — adopted so it can be tried against real screens, expected to change as we learn. **UNRESOLVED** — a real open question, not yet decided; do not invent an answer to it.

---

## 1. Color

**Status: DEFINED**

### Neutral ramp — does almost all structural work

| Token | Hex |
|---|---|
| `gray-950` | `#101014` |
| `gray-900` | `#17181C` |
| `gray-800` | `#232429` |
| `gray-700` | `#3A3B42` |
| `gray-600` | `#53555E` |
| `gray-500` | `#6B6D76` |
| `gray-400` | `#8C8E97` |
| `gray-300` | `#A8AAB3` |
| `gray-200` | `#D2D3D9` |
| `gray-100` | `#E9EAEE` |
| `gray-50` | `#F5F5F7` |
| `white` | `#FFFFFF` |

`canvas` `#F0F0F7` (page background — a small, deliberate influence of `accent-500` blended into gray-50, selected via Baseline Reservation Detail Convergence review so white cards are perceptibly separated from the page without decorative elevation) · `surface` `#FFFFFF` (cards) · `surface-sunken` `#F5F5F7` (recessed areas — muted panels, footers)

### Accent — one hue, spent deliberately

| Token | Hex | Where it's allowed |
|---|---|---|
| `accent-50` | `#F1F0FE` | Reserved, not yet assigned a use |
| `accent-200` | `#C7C4F5` | The Prepared-tier thread, and (as of this revision) the tier-signal icon and label that accompany it. See §3. |
| `accent-500` | `#5E54F2` | Exactly two things, anywhere in the product: the Approve/Send action's fill, and the Approval tier's label color. Nothing else may use it at full strength — that scarcity is what makes it mean something. |
| `accent-on-dark` | `#8B85F7` | Supplementary text/icon accents on a dark (Approval-tier) surface, where accent-500 itself would be reserved for the label per the rule above. |

### Resolved-state glyphs — never fills

`ok` `#4B8768` · `err` `#B15454`

These render as icon/text color only. A colored background chip is not a valid use of either token, in any tier, including outside the four governance tiers (e.g. ordinary status badges). If a status needs a fill, it uses the neutral ramp; the color carries the meaning, not the background.

---

## 2. Type

**Status: DEFINED**

Three materials, not one voice with size variations. The point of separating them is that a reader should be able to tell *what kind of thing* they're looking at — a name, a sentence, or a value — without reading it.

| Voice | Typeface | Used for |
|---|---|---|
| **Display** | Inter Tight, weight 600 | The one hero title per screen — the thing the record *is* (equipment name, etc.). Not card titles. |
| **Section label** | Inter Tight, weight 500 | Card/section titles. Deliberately restrained relative to Display — the gap between them is what makes Display read as a hero rather than "a slightly bigger label." |
| **Body** | Inter, weight 400 | Prose: descriptions, instructions, rationale, anything a human wrote as a sentence. |
| **Eyebrow / field label** | Inter, uppercase, tracking-wide, small | Structural labels — "Category," "Scheduled return," the connective words in "Rental — from Reservation." Never the value itself. |
| **Systematic** | IBM Plex Mono, tabular numerals | Every value that is data rather than prose. See below. |

### The Systematic test

**Status: WORKING HYPOTHESIS**, revised via Baseline Reservation Detail Convergence review (v0.3) — supersedes the datatype checklist this subsection previously stated; see Version notes.

Systematic typography communicates semantic precision, not datatype. Use it when a value is an exact system reference; a precise operational value whose accuracy materially affects a decision, state, sequence, or consequence; or an audit/evidentiary value where precise reconstruction or comparison matters. Use Body when the value is contextual, descriptive, or meant for ordinary comprehension — including values that share a datatype with a Systematic one. The same datatype can take either voice depending on what it's *for*: on the Reservation Detail baseline, Scheduled Return (feeds downstream conflict detection) is Systematic; Pickup Time (contextual/historical on this surface) is Body — both are times.

**UNRESOLVED.** This test tells a reader which voice applies once a value's semantic role is already known. It does not establish how an AI implementation agent derives that role from Product/Behavior Context alone for a field not yet classified — whether a value is operationally consequential, evidentiary, or merely contextual isn't currently derivable from `product.md`'s ontology, risk model, or governance model without a human decision to anchor it. Not resolved here; do not infer a general classification mechanism from the examples below.

Baseline instances validated by Convergence review — illustrative, not an exhaustive registry: **Systematic** — Rental/Reservation/Unit IDs, meter reading, the header's Scheduled Return (Hero Stat), Activity timestamps. **Body** — phone number, Rental Start, Pickup Time, ordinary product-summary currency (Rate, Deposit, totals). **Context-dependent, unresolved** — currency in a reconciliation/verification context; no such context exists in this baseline to validate against.

A label stays in the Eyebrow voice even when the value next to it is Systematic — the pairing (quiet sans label → mono value) is itself part of what makes data legible as data.

### Scale

**Status: DEFINED** — implemented and exercised across every screen type in the prototype (Reservation Detail baseline, Feature 001 Generations 1–3, Design Exploration A/B/C, Compare).

Display should read as a clear step up from everything else on the page — meaningfully larger and heavier than a Section label, with tightened tracking. Section labels, Body, and Eyebrow stay at their current sizes; the contrast comes from widening the gap upward, not shrinking everything else down. In practice: `text-2xl font-semibold tracking-tight` for Display (up from the prior `text-xl font-medium`), Section labels unchanged.

### Point-size scale

**Status: WORKING HYPOTHESIS**, selected via a controlled Figma comparison against real FEATURE-001 content, for rapid comprehension on operational surfaces. Not yet DEFINED — pending implementation in code and validation on a second, differently-shaped screen.

| Voice | Size | Note |
|---|---|---|
| Display | 24px | Unchanged, DEFINED — see Scale above. |
| Section label | 14px | Unchanged, DEFINED. |
| Body / primary content | 16px | |
| Secondary / supporting content | 14px | |
| Metadata / caption | 12px | |
| Eyebrow | 11px | Held constant in the comparison; not independently validated against 16px neighbors. |
| Systematic | inherits the role it plays | Not an independent tier — sized to whichever role above it substitutes for. |
| Hero Stat | 20px | Unchanged for now; its step-up over Body content has compressed against the new 16px baseline — recheck before promoting. |

**Operational density principle (WORKING HYPOTHESIS):** Contera's operational surfaces optimize for rapid comprehension before maximum density. Compact scales may still suit expert/technical surfaces where density carries more task value. Which surfaces qualify as which is not yet enumerated.

---

## 3. The governance-tier visual language

**Status: DEFINED**, revised this pass.

Unchanged from the prior revision: Finding/Recommendation (white, 1px gray-100 border, no shadow, no color), Approval (surface inverts to gray-950, deep shadow, accent-500 spent on the label and the Approve button — see §1), Execution/Progress resolved (gray-50, reduced opacity, `ok`/`err` glyph only, never a fill).

**Revised — Prepared Action.** The muted accent-200 thread on the left edge was correct in principle but too quiet to register as deliberate. As of this revision:

- The thread widens from 2px to 3px.
- The tier's leading icon and any tier-specific label also take `accent-200` (not accent-500 — that stays exclusive to Approval, per §1).
- The card surface itself stays neutral white. Nothing here becomes a fill.

The rule is still "muted, not a fill" — we're extending *where* accent-200 is allowed to appear (icon, label, thread), not loosening *how* it's allowed to appear (never a background).

**Accessibility — contrast (added this pass).** A tier color used as text or icon *foreground* must meet WCAG AA contrast (4.5:1 for normal text; 3:1 for large text or icons ≥24px) against the surface it actually renders on. A tier color used as a non-text element — a border, thread, or fill — is not held to that threshold, but per §4, must never be the sole carrier of meaning. This applies to all four tiers, not only Prepared Action.

**Known gap, flagged rather than fixed by this pass.** `accent-200` as the Prepared-tier icon/label foreground measures roughly 1.5:1 against `surface`/`surface-sunken` — it fails the invariant above. The 3px thread may keep `accent-200` as-is, since a border is a non-text element. The icon and label need a WCAG-compliant foreground substitute; this document does not specify one — the replacement value is an implementation/token decision, not resolved here. `ok` (~4.2:1 on white) is a secondary, lower-priority watch item — marginal for small body text, passing for large text/UI components; not flagged as a failure.

---

## 4. Icons

**Status: DEFINED**

Two roles, not one uniform decoration:

- **Structural icons** (card/section headers, general UI chrome): `size-4`, `gray-500`, never colored. They orient, they don't signal.
- **Tier-signal icons** (the leading icon inside a Finding/Prepared/Approval/Resolved surface): `size-5`, and *do* carry the tier's color — neutral for Finding/Resolved, `accent-200` for Prepared (§3), `accent-on-dark` for Approval, `ok`/`err` for a Resolved outcome glyph.

An icon never carries meaning alone. It always sits beside a text label; removing the icon should never remove information, only emphasis.

---

## 5. Hero stat pattern

**Status: WORKING HYPOTHESIS** — tried in exactly one place (the Reservation Detail header's "Scheduled return," shared by every screen that embeds that header). Not yet promoted to DEFINED, per its own rule above: revisit once it's been tried on two or three genuinely different record types, not just the one component reused across several screens.

A primary record screen may promote at most one, occasionally two, of its most decision-relevant figures out of the ordinary field grid into a standalone, larger, Systematic-voice treatment near the top of the record — not buried as one field among many.

Selection test: this is the figure a counter employee scans for *first* when opening this specific record — not "the most important field," but the one the visit is usually *for*. On a rental record that might be balance due, or time-to-return; it will differ by record type and shouldn't be applied mechanically to whatever field happens to be first.

Because this is still a hypothesis, don't apply it retroactively to every screen in one pass — try it somewhere concrete, see whether it actually earns its prominence, and fold the result back into this section.

---

## 6. Spacing and vertical rhythm

**Status: WORKING HYPOTHESIS**, selected via controlled Figma comparisons against real FEATURE-001 content. Not yet DEFINED — pending implementation in code and validation on a second, differently-shaped screen. An early proof-of-concept had a construction artifact that rendered some gaps larger than the values below; the values here are the selected design intent, not a measurement of that proof-of-concept — V3 must visually validate the actual implemented tokens, not assume Figma parity.

### Semantic spacing ladder

Four relationship types, each with its own gap, deliberately distinct so adjacent levels aren't confusable:

| Level | Gap | Relationship |
|---|---|---|
| Related Stack | 4px | Two elements forming one semantic unit (a line qualifies the one above it — not a new fact) |
| Related content | 12px | Separate elements within the same content group |
| Distinct peers | 16px | Peer fields/columns within a row, or stacked cards in a column |
| New/unrelated group | 24px | Start of a genuinely new information group (e.g. after a divider) |

Field label → value gap (2px) is tighter than and separate from this ladder — a label always directly captions its own value, which is a different relationship than any of the four above.

### Selected decisions

- **Field-row/column gap: 16px** (Distinct peers). Selected after a controlled 16px-vs-24px comparison with everything else held constant: 24px produced no meaningful improvement in scanability, wrapping, card height, or field distinction at the tested card width, while consuming additional horizontal space.
- **Surface padding: 24px top/bottom, 20px left/right** (asymmetric). Selected — compact horizontally, calm vertically. Not a step toward general spaciousness; not license to widen other gaps.
- **Related Stack: 4px.** Selected. Confirmed pairing: a payment-method caption and its metadata line ("Held on file — Mastercard ending 7723" / "Sep 3, 2026, 4:05 PM"). Candidate pairings — event + timestamp, status + explanation, person + role, file + metadata, evidence + source, action + supporting context — are not yet validated; each needs its own check before use. Build as an independent nested container with its own gap, not a shared base value plus a compensating adjustment.

### Related key-data cluster (composition pattern)

**Status: WORKING HYPOTHESIS**, selected via Baseline Reservation Detail Convergence review; not yet validated on a second, differently-shaped screen. A set of closely related key facts (e.g. a record header's headline figures) should hug their own content width and left-align, rather than stretch to fill an equal-width grid — stretching a short value into a wide column increases the *perceived* gap between related facts well beyond the nominal spacing value, and forces long values to wrap unevenly against their row-mates instead of on their own line. Use a **32px** gap between fields in this specific composition — a level above Distinct peers (16px) on the ladder above, reserved for this cluster pattern rather than general peer spacing. The structure must tolerate a different number of fields and different value lengths without reverting to a fixed-column grid.

---

## 7. Relationship to the other governing documents

This document is authoritative for presentation the same way `components.md` is authoritative for schema — each owns one layer, neither overrides the other. A governance-tier rule change here (§3's revised Prepared-tier treatment) changes how an existing tier is *rendered*; it does not add, remove, or redefine a tier, a Product System rule, or an interaction primitive. If a presentation question turns out to require a product-behavior answer (for example, whether the Hero Stat pattern implies a new kind of data should exist), that stops here and goes to the Product System documents instead — this document does not invent product policy any more than the code implementing it may.

---

## What this document does not define (gaps, not omissions)

The following are commonly expected parts of a token architecture that this source material does not specify. They are named here explicitly, per `context/manifest.md` §6, so that a missing field in `context/data/design-tokens.json` is read as a documented gap rather than an oversight:

- A DEFINED spacing/sizing scale — see §6 for the current WORKING HYPOTHESIS; not yet promoted.
- Border-radius tokens.
- Elevation/shadow tokens beyond the qualitative "deep shadow" reference for the Approval tier in §3 (no shadow values, blur radii, or elevation scale are specified).
- Motion/transition/animation tokens.
- Breakpoints or responsive layout tokens.
- A dark-mode/light-mode theme pair — see `context/data/themes.json`; the Approval tier's surface inversion to `gray-950` is a component-level governance-tier state within this one presentation system, not a second theme.
- Semantic color roles beyond the neutral ramp, the single accent hue, and the two resolved-state glyphs (e.g., no separate "warning," "info," or additional data-visualization palette is defined).

---

## Version notes

### v0.4

Approved via human review, prompted by a contrast defect observed in the regenerated FEATURE-001 approval boundary (the always-visible Prepared Action block's `accent-200` icon and label). Summary of changes, confined to §3:

- Added an accessibility-contrast invariant: a tier color used as text/icon foreground must meet WCAG AA contrast (4.5:1 normal text, 3:1 large text/icons ≥24px) against its actual rendered background; a tier color used as a non-text element (border, thread, fill) is exempt from that threshold but remains subject to §4's "never the sole carrier of meaning" rule. Applies to all four governance tiers, not only Prepared Action.
- Flagged, not fixed: `accent-200` as the Prepared-tier icon/label foreground fails this invariant (~1.5:1 against `surface`/`surface-sunken`). No replacement value is specified — selecting one is an implementation/token decision left open by this pass. The `accent-200` thread itself is unaffected, since a border is a non-text element.
- Flagged, non-blocking: `ok` (~4.2:1 on white) is marginal for small normal-weight text; not treated as a failure.
- No change to §1, §2, §4, §5, or §6. No product policy resolved; no existing token value changed.

### v0.1

First formal capture of the Threshold system as its own governing document, separated out from chat-only direction. Summary of changes from the informal version implemented in code prior to this document existing:

- Added the full Type section (§2) — three-voice system (Display / Section label / Body / Eyebrow) plus the Systematic (mono, tabular-nums) rule for all data values. **Implemented** across every screen: hero titles bumped to Display scale; dates, times, currency, IDs, meter readings, and phone/email set in `font-mono` throughout the Reservation Detail cards, both notice components, and the Gen 1 primitive panels.
- Revised the Prepared-tier accent treatment (§3) — thread widens 2px → 3px, tier icon and label also take accent-200. **Implemented**, centralized in `GovernanceSurface`'s `governanceIconClass`/`governanceLabelClass` maps so every consumer (Gen 1's Prepared Action panel, the Gen 2/3 and Design Exploration notices) pulls from the same source.
- Added the Icon section (§4), formalizing structural vs. tier-signal icons. **Implemented** — tier-signal icons are `size-5` and tier-colored (Finding gained a leading icon it didn't have before); structural icons unchanged at `size-4`, neutral.
- Added the Hero Stat pattern (§5) as a working hypothesis. **Implemented in one place** — the Reservation Detail header's "Scheduled return" — deliberately not applied elsewhere yet; see §5's status note.
- No change to §1 (Color) or the unrevised parts of §3 — those matched what was already implemented and still do.

Two items from the critique this document is based on were deliberately left unresolved by this pass, not silently dropped: the disclosure text inside "View details" (Feature 001's notices) still mixes label and value in one string, so it wasn't converted to Systematic — doing so would mean restructuring the underlying data shape, not just the styling, which is out of scope for a presentation-only pass. Money/date values embedded inside agent-generated prose (e.g. a Finding's inference sentence) were left as-is for the same reason.

### v0.3

Approved via Baseline Reservation Detail Convergence review (Figma REV 2). Summary of changes:

- **§1 Color:** `canvas` changed from `#FBFBFC` to `#F0F0F7` — a small, deliberate `accent-500` influence blended into gray-50, selected so white cards are perceptibly separated from the page without decorative elevation. No other color changed.
- **§2 Type, "The Systematic test":** replaced the datatype checklist ("always Systematic: dates and times, currency, IDs...") with a semantic-purpose principle — Systematic communicates precision (exact reference, consequential operational value, or audit/evidentiary value), not datatype. Explicitly marked **UNRESOLVED**: the mechanism by which an AI implementation agent derives a field's semantic role from Product/Behavior Context for a field not yet classified. This is a DEFINED-principle/UNRESOLVED-mechanism split, not a fully solved rule — do not treat the baseline instances listed there as a general inference procedure.
- **§6 Spacing:** added "Related key-data cluster," a new WORKING HYPOTHESIS composition pattern — hugged/left-aligned/content-sized fields with a 32px gap, distinct from the existing raw spacing ladder tokens.
- No change to §3, §4, or §5. No product policy resolved; the Systematic-typography mechanism gap is recorded, not closed.

### v0.2

Added a point-size typography scale (§2) and a spacing/vertical-rhythm system (§6, new — renumbers the prior §6 to §7), both WORKING HYPOTHESIS, selected via controlled Figma comparisons against real FEATURE-001 content. Not yet implemented in code or validated on a second screen shape. No change to §1, §3, or §4. No product policy resolved.
