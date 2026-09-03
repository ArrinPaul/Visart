# Feature: Fair Pricing

## Overview
Produces a suggested price range (`min`, `recommended`, `max`, all INR) plus a human-readable `rationale` and `disclaimer`, as part of the single AI listing generation call — there is no separate pricing endpoint or pricing-specific code path.

## Correction vs. Existing README Marketing Copy
The top-level README (prior to this documentation pass) described a fixed formula:

> `Recommended Retail Price = (Raw Materials + Artisan Labor + Tool Depreciation) × Fair Trade Multiplier`

**This formula does not exist in the code.** In real mode, pricing is entirely Gemini-generated free-form guidance produced from a natural-language instruction (`lib/ai/visart.ts`, [prompt section 3, L274](../../lib/ai/visart.ts#L274): *"Fair-trade pricing guidance in INR based on raw material cost and labor time. Currency must be 'INR'."*) — there is no line of code that computes `rawMaterials + artisanLabor + toolDepreciation`, and the Gemini JSON schema (`visartResponseSchema.pricing`) has no such cost-breakdown sub-fields (only `min`, `recommended`, `max`, `rationale[]`, `disclaimer`). The README's JSON example under "AI & Multimodal Neural Pipeline" (a `breakdown` object with `rawMaterials`/`artisanLabor`/`toolDepreciation`/`platformMargin`/`fairTradePremium`) also does not match `VisartGenerationSchema` — no such nested breakdown field exists anywhere in `types/visart.ts` or the Zod schema.

**What is real**: in **demo/mock mode only** ([`getMockGeneration()`](../../lib/ai/visart.ts#L173) in `lib/ai/visart.ts`), pricing is a simple deterministic multiplier of the artisan-entered production cost:
```
min         = round(productionCost × 1.8)   [lib/ai/visart.ts:204]
recommended = round(productionCost × 2.2)   [lib/ai/visart.ts:177]
max          = round(productionCost × 2.8)   [lib/ai/visart.ts:206]
```
This mock formula is what most demo runs of the app will actually show, since demo mode is the default and bypasses the server entirely. The admin settings object (`lib/supabase/admin.ts`) separately exposes a [`defaultPricingMultiplier: 2.2`](../../lib/supabase/admin.ts#L207) field that matches the mock's `recommended` multiplier by coincidence of value, but is **not read by** `getMockGeneration()` or `generateVisartListing()` — changing it in the admin UI has no effect on either pricing path.

Note also [components/landing/FairPricingWidget.tsx](../../components/landing/FairPricingWidget.tsx#L1) on the marketing landing page — it runs a **third**, entirely separate hardcoded formula (hourly-rate × craft-days × technique multiplier) purely for illustrative purposes and is not wired to either pricing path above.

## Inputs
`productionCost` (number, artisan-entered), `timeRequired` (free text, e.g. `"2 days"`), `material`, `location` — all fed into the Gemini prompt as context; in real mode Gemini decides the actual numbers, not a formula.

## Where It's Displayed
[components/workspace/PricingPanel.tsx](../../components/workspace/PricingPanel.tsx#L13) (editable, in `/workspace`) and [components/product/ProductView.tsx](../../components/product/ProductView.tsx#L308) (read-only, in `/product/[id]`, price display inlined directly in this component — note `components/product/ProductDetails.tsx` also has pricing-adjacent rendering code but is currently unused/dead, not imported by any page), and factored into `AuthenticityAudit.pricingIntegrityScore` (see [authenticity-verification.md](authenticity-verification.md)) — the authenticity engine separately re-evaluates whether the *listed* price is plausible for the claimed labor time, which is a different Gemini call than the one that generated the price.

## Modification Guide
To make pricing formula-driven instead of free-form AI guidance, the change belongs in `lib/ai/visart.ts` (real mode) and would need to be mirrored in `getMockGeneration()` for consistency, plus updating `visartResponseSchema`/`VisartGenerationSchema`/`types/visart.ts` if a cost breakdown field is added, per the same multi-file update pattern described in [ai-listing-generation.md](ai-listing-generation.md#modification-guide).

## Known Limitations
- No real-world market-price grounding (no external pricing API, no comparable-listings database) — Gemini's `recommended` price in real mode is a language-model estimate with no verification.
- `disclaimer` field exists precisely because of this — it is surfaced in the UI to set buyer/artisan expectations that this is AI-assisted guidance, not a market quote.
