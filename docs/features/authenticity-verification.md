# Feature: Anti-Counterfeit Authenticity Verification

## Overview
Public product pages (`/product/[id]`) show an AI-generated "authenticity audit": an overall score, a verdict, three integrity sub-scores (material/technique/pricing), authentic-vs-fake indicators, a "spot a fake" buyer guide, and a community trust score derived from buyer feedback. A related, separate AI call classifies each submitted buyer review for counterfeit-risk signals.

## Entry Points
- `GET /api/verify-authenticity?productId=<id>` ([app/api/verify-authenticity/route.ts](../../app/api/verify-authenticity/route.ts#L1)) → [`generateAuthenticityAudit()`](../../lib/ai/authenticity.ts#L223) in `lib/ai/authenticity.ts`. Also called directly (server-side, same function, no HTTP hop) from [`app/product/[id]/page.tsx:67`](../../app/product/[id]/page.tsx#L67) on every page load.
- `POST /api/feedback` → [`analyzeFeedbackWithGemini()`](../../lib/ai/authenticity.ts#L352) in `lib/ai/authenticity.ts`, invoked from [`lib/supabase/feedback.ts#submitProductFeedback`](../../lib/supabase/feedback.ts#L205) (call site at [L216](../../lib/supabase/feedback.ts#L216)).

## Technical Flow — Authenticity Audit
```
GET /api/verify-authenticity?productId=X   (or direct server-render call)
  ↓
getProductById(X)  → 404 if missing
  ↓
getProductFeedback(X)  → CustomerFeedback[]
  ↓
generateAuthenticityAudit(product, feedbacks)                          [lib/ai/authenticity.ts:223]
  ├─ no GEMINI_API_KEY → getMockAuthenticityAudit(product, feedbacks)  [lib/ai/authenticity.ts:143, deterministic template]
  └─ else: build forensics prompt (claimed material/technique/origin/cost/duration/price,
           + up to 5 feedback comments as signal) → same model-cascade retry as generation
           → JSON.parse response → merge with computed communityTrustScore
  ↓
communityTrustScore = round(positiveRatings / totalFeedbackCount × 100)
   where "positive" = authenticityRating in {GENUINE_HANDCRAFTED, LIKELY_GENUINE}
   (defaults to 96 if there is no feedback yet — NOT AI-generated, computed in code)
  ↓
{ audit: AuthenticityAudit } returned to client / rendered server-side
```
Sources: [`generateAuthenticityAudit`](../../lib/ai/authenticity.ts#L223), [`getMockAuthenticityAudit`](../../lib/ai/authenticity.ts#L143), [`communityTrustScore` computation](../../lib/ai/authenticity.ts#L156).

**Every call regenerates the audit from scratch — it is never cached or persisted.** Two consecutive page loads of the same product can return different Gemini-generated scores/summaries even with no data changing, since the LLM output is not deterministic and nothing is stored.

## Technical Flow — Buyer Feedback Risk Classification
```
POST /api/feedback  { productId, rating, authenticityRating, comment, craftChecks, ... }
  ↓
manual required-field check (not Zod) → 400 if productId/comment/rating/authenticityRating missing
  ↓
submitProductFeedback(input)
  ├─ getProductById(productId)
  ├─ analyzeFeedbackWithGemini(input, product)
  │    ├─ keyword heuristic always computed first: scans comment + suspectedCounterfeitReason
  │    │  for fake-signal words (fake, plastic, synthetic, machine made, powerloom, scam,
  │    │  cheap copy, mold seam, polyester, counterfeit, chemical smell)
  │    ├─ no GEMINI_API_KEY → returns heuristic-only result (risk 85/65/5 based on rating + keywords)
  │    └─ else → Gemini classification call (single attempt per model, no retry loop unlike the
  │       generation/audit paths) → falls back to the same keyword heuristic on any failure
  ├─ flaggedAsFake = (buyer's own authenticityRating is SUSPICIOUS_QUALITY/CONFIRMED_FAKE_REPLICA)
  │                   OR (Gemini/heuristic riskScore > 60)
  └─ dual-write: memory + localStorage always; Supabase best-effort
  ↓
201 { success: true, feedback: CustomerFeedback }
```
Sources: [`submitProductFeedback`](../../lib/supabase/feedback.ts#L205), [`analyzeFeedbackWithGemini`](../../lib/ai/authenticity.ts#L352), [`flaggedAsFake` computation](../../lib/supabase/feedback.ts#L234).

## Frontend Implementation
- [components/product/AuthenticityInspector.tsx](../../components/product/AuthenticityInspector.tsx#L1) — renders the audit (scores, verdict, markers, spot-a-fake guide).
- [components/product/ProductFeedbackSection.tsx](../../components/product/ProductFeedbackSection.tsx#L1) — feedback list + submission form.
- [components/product/ProductView.tsx](../../components/product/ProductView.tsx#L37) — composes the full `/product/[id]` page from server-fetched `product`, `initialFeedbacks`, `initialAudit`.

## Data Flow
See [DATA_FLOW.md](../DATA_FLOW.md).

## Dependencies
`@google/genai`, `lib/supabase/products.ts`, `lib/supabase/feedback.ts`.

## Modification Guide
The audit schema ([`authenticityAuditSchema`](../../lib/ai/authenticity.ts#L55) in `lib/ai/authenticity.ts`) and the `AuthenticityAudit` type (`types/feedback.ts`) must be changed together, same as the generation pipeline's schema-sync requirement — see [ai-listing-generation.md](ai-listing-generation.md#modification-guide).

## Known Limitations
- Audits are not cached/persisted — repeated page views repeatedly call (and pay for) the Gemini API in real mode, and can show inconsistent scores across loads.
- `communityTrustScore` starts at a high default (96) with zero feedback, which could read as "verified" before any buyer has actually weighed in.
- The feedback risk classifier retries only once per model (no backoff loop), unlike the generation and audit pipelines which retry twice per model with backoff — an inconsistency worth knowing if debugging why feedback classification seems less resilient to transient Gemini errors than generation.
- "Verified Buyer" badge on feedback is not a real verification (see [SECURITY.md](../SECURITY.md) finding #5).
