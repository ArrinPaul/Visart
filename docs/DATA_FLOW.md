# Data Flow

## 1. Listing Generation (Real Mode)

```
Input            Artisan fills ProductForm (typed or voice-dictated) + optional photo
  ↓
Validation       Client: required-field check (material/cost/time/location).
                 Server: VisartInputSchema.safeParse() in POST /api/generate → 400 on failure.
  ↓
Processing       generateVisartListing(): build prompt + optional inline image →
                 Gemini generateContent() with structured responseSchema →
                 model-cascade retry (up to 2 attempts × up to 5 candidate models)
  ↓
Transformation   JSON.parse(response.text) → VisartGenerationSchema.parse() (re-validates AI output) →
                 merge product.imageUrl/location from original input
  ↓
Storage          saveProduct(): writes to memory Map + localStorage/sessionStorage (browser) +
                 best-effort INSERT into Supabase `artisans` (if artisan name given) and `products`
  ↓
Response         VisartGeneration JSON returned to the browser
  ↓
UI               router.push("/workspace?id=<id>") → WorkspaceContainer renders editable panels
```
Sources: [`app/api/generate/route.ts`](../app/api/generate/route.ts#L1), [`lib/ai/visart.ts#generateVisartListing`](../lib/ai/visart.ts#L249), [`lib/supabase/products.ts#saveProduct`](../lib/supabase/products.ts#L63).

## 1b. Listing Generation (Demo Mode — the default)

```
Input            Artisan fills ProductForm
  ↓
Validation       Client-side required-field check only (no server round-trip at all)
  ↓
Processing       getMockGeneration(input) called directly in the browser — deterministic,
                 template-based, NOT an AI call, after an artificial 2s delay
  ↓
Storage          saveProduct() — same as real mode
  ↓
UI               Same redirect to /workspace
```
Sources: [`lib/frontend/generationClient.ts#generateListing`](../lib/frontend/generationClient.ts#L62), [`lib/ai/visart.ts#getMockGeneration`](../lib/ai/visart.ts#L173).

**Note**: `/api/generate` and Gemini are entirely bypassed in this path. See [ARCHITECTURE.md](ARCHITECTURE.md#demo-mode-vs-real-mode).

## 2. Authenticity Verification

```
Input            Buyer opens /product/[id]
  ↓
Processing       (Server Component, no client fetch) getProductById(id) →
                 getProductFeedback(id) → generateAuthenticityAudit(product, feedbacks)
  ↓
AI Call          Gemini forensics prompt (claimed material/technique/origin/cost/duration/price +
                 up to 5 feedback comments) → model-cascade retry → JSON parse
                 (falls back to getMockAuthenticityAudit on missing key / all-models-failed,
                 independent of demo-mode setting)
  ↓
Transformation   communityTrustScore computed in code from feedbacks (NOT from the AI call):
                 round(positiveRatings / totalFeedbackCount × 100), default 96 with no feedback
  ↓
Response         AuthenticityAudit object — NOT cached or persisted; regenerated on every page load
  ↓
UI               AuthenticityInspector renders scores/verdict/markers/spot-a-fake guide
```
Sources: [`app/product/[id]/page.tsx`](../app/product/[id]/page.tsx#L38), [`lib/ai/authenticity.ts#generateAuthenticityAudit`](../lib/ai/authenticity.ts#L223).

## 3. Buyer Feedback Submission

```
Input            Buyer fills feedback form (rating, authenticityRating, comment, craftChecks,
                 optional suspectedCounterfeitReason) on /product/[id]
  ↓
Validation       Client: form-level checks (verify exact rules in ProductFeedbackSection.tsx).
                 Server: manual presence check in POST /api/feedback (NOT Zod) — 400 if
                 productId/comment/rating/authenticityRating missing.
  ↓
Processing       submitProductFeedback(): keyword-heuristic risk scan always runs first →
                 analyzeFeedbackWithGemini() (Gemini call, or heuristic-only if no API key) →
                 flaggedAsFake = buyer's own verdict is SUSPICIOUS/FAKE OR riskScore > 60
  ↓
Storage          Dual-write: memory + localStorage always; best-effort INSERT into
                 Supabase `product_feedback`
  ↓
Response         201 { success, feedback }
  ↓
UI               Feedback list re-renders with the new review (and, indirectly, the next
                 authenticity-audit page load will factor this review into its prompt and
                 into the recomputed communityTrustScore)
```
Sources: [`app/api/feedback/route.ts`](../app/api/feedback/route.ts#L1), [`lib/supabase/feedback.ts#submitProductFeedback`](../lib/supabase/feedback.ts#L205), [`lib/ai/authenticity.ts#analyzeFeedbackWithGemini`](../lib/ai/authenticity.ts#L352).

## Cross-Cutting Notes

- **No caching layer** anywhere in this system (no Redis, no in-memory TTL cache, no `fetch` cache directives observed for the AI/DB calls) — every authenticity audit and every generation call, in real mode, is a fresh Gemini API call.
- **Server vs. browser store split**: functions in `lib/supabase/*.ts` behave differently depending on whether they execute on the Next.js server (Server Components, Route Handlers) or in the browser (client components) — see [features/artisan-workspace.md](features/artisan-workspace.md) for a concrete example of the resulting SSR/client hydration workaround.
- **No write ever hard-fails on a Supabase error** — every Supabase call in the write paths above is wrapped in try/catch with a `console.warn`, not a thrown error. This makes the app resilient to a missing/misconfigured Supabase project, at the cost of silently degrading to non-durable, single-browser-only storage with no user-visible warning that this happened.
