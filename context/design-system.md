# Contera Threshold Design System

**Context System provenance:** Canonical context document, migrated from `source/design-system.md` without content changes. This is the presentation/visual-semantics layer — see `context/manifest.md` §2 (subordinate to `context/product.md` and `context/behaviors.md` for anything behavioral; must not introduce behavioral rules). Only what is DEFINED or WORKING HYPOTHESIS below is implemented guidance — where the source material did not support a complete token architecture, that gap is carried into `context/data/design-tokens.json` explicitly rather than filled in.

**Version:** 0.1
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

`canvas` `#FBFBFC` (page background) · `surface` `#FFFFFF` (cards) · `surface-sunken` `#F5F5F7` (recessed areas — muted panels, footers)

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

If a value could be looked up, counted, compared, or copied — set it in mono with tabular numerals. If it's a sentence a human wrote or reads as prose, it's Body. If it names what you're looking at, it's Display or a Section label.

Concretely, always Systematic: dates and times, currency, rental/reservation/unit IDs, meter readings, phone numbers, counts, percentages, evidence/source citations. This applies everywhere these appear — record headers, field grids, activity timestamps, evaluator tooling — not only in hero placements.

A label stays in the Eyebrow voice even when the value next to it is Systematic — the pairing (quiet sans label → mono value) is itself part of what makes data legible as data.

### Scale

**Status: DEFINED** — implemented and exercised across every screen type in the prototype (Reservation Detail baseline, Feature 001 Generations 1–3, Design Exploration A/B/C, Compare).

Display should read as a clear step up from everything else on the page — meaningfully larger and heavier than a Section label, with tightened tracking. Section labels, Body, and Eyebrow stay at their current sizes; the contrast comes from widening the gap upward, not shrinking everything else down. In practice: `text-2xl font-semibold tracking-tight` for Display (up from the prior `text-xl font-medium`), Section labels unchanged.

---

## 3. The governance-tier visual language

**Status: DEFINED**, revised this pass.

Unchanged from the prior revision: Finding/Recommendation (white, 1px gray-100 border, no shadow, no color), Approval (surface inverts to gray-950, deep shadow, accent-500 spent on the label and the Approve button — see §1), Execution/Progress resolved (gray-50, reduced opacity, `ok`/`err` glyph only, never a fill).

**Revised — Prepared Action.** The muted accent-200 thread on the left edge was correct in principle but too quiet to register as deliberate. As of this revision:

- The thread widens from 2px to 3px.
- The tier's leading icon and any tier-specific label also take `accent-200` (not accent-500 — that stays exclusive to Approval, per §1).
- The card surface itself stays neutral white. Nothing here becomes a fill.

The rule is still "muted, not a fill" — we're extending *where* accent-200 is allowed to appear (icon, label, thread), not loosening *how* it's allowed to appear (never a background).

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

## 6. Relationship to the other governing documents

This document is authoritative for presentation the same way `components.md` is authoritative for schema — each owns one layer, neither overrides the other. A governance-tier rule change here (§3's revised Prepared-tier treatment) changes how an existing tier is *rendered*; it does not add, remove, or redefine a tier, a Product System rule, or an interaction primitive. If a presentation question turns out to require a product-behavior answer (for example, whether the Hero Stat pattern implies a new kind of data should exist), that stops here and goes to the Product System documents instead — this document does not invent product policy any more than the code implementing it may.

---

## What this document does not define (gaps, not omissions)

The following are commonly expected parts of a token architecture that this source material does not specify. They are named here explicitly, per `context/manifest.md` §6, so that a missing field in `context/data/design-tokens.json` is read as a documented gap rather than an oversight:

- Spacing/sizing scale (no spacing unit or scale is defined anywhere in this document).
- Border-radius tokens.
- Elevation/shadow tokens beyond the qualitative "deep shadow" reference for the Approval tier in §3 (no shadow values, blur radii, or elevation scale are specified).
- Motion/transition/animation tokens.
- Breakpoints or responsive layout tokens.
- A dark-mode/light-mode theme pair — see `context/data/themes.json`; the Approval tier's surface inversion to `gray-950` is a component-level governance-tier state within this one presentation system, not a second theme.
- Semantic color roles beyond the neutral ramp, the single accent hue, and the two resolved-state glyphs (e.g., no separate "warning," "info," or additional data-visualization palette is defined).

---

## Version notes

### v0.1

First formal capture of the Threshold system as its own governing document, separated out from chat-only direction. Summary of changes from the informal version implemented in code prior to this document existing:

- Added the full Type section (§2) — three-voice system (Display / Section label / Body / Eyebrow) plus the Systematic (mono, tabular-nums) rule for all data values. **Implemented** across every screen: hero titles bumped to Display scale; dates, times, currency, IDs, meter readings, and phone/email set in `font-mono` throughout the Reservation Detail cards, both notice components, and the Gen 1 primitive panels.
- Revised the Prepared-tier accent treatment (§3) — thread widens 2px → 3px, tier icon and label also take accent-200. **Implemented**, centralized in `GovernanceSurface`'s `governanceIconClass`/`governanceLabelClass` maps so every consumer (Gen 1's Prepared Action panel, the Gen 2/3 and Design Exploration notices) pulls from the same source.
- Added the Icon section (§4), formalizing structural vs. tier-signal icons. **Implemented** — tier-signal icons are `size-5` and tier-colored (Finding gained a leading icon it didn't have before); structural icons unchanged at `size-4`, neutral.
- Added the Hero Stat pattern (§5) as a working hypothesis. **Implemented in one place** — the Reservation Detail header's "Scheduled return" — deliberately not applied elsewhere yet; see §5's status note.
- No change to §1 (Color) or the unrevised parts of §3 — those matched what was already implemented and still do.

Two items from the critique this document is based on were deliberately left unresolved by this pass, not silently dropped: the disclosure text inside "View details" (Feature 001's notices) still mixes label and value in one string, so it wasn't converted to Systematic — doing so would mean restructuring the underlying data shape, not just the styling, which is out of scope for a presentation-only pass. Money/date values embedded inside agent-generated prose (e.g. a Finding's inference sentence) were left as-is for the same reason.
