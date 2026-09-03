# API Reference

All endpoints are Next.js App Router Route Handlers under `app/api/`. Base path in local dev: `http://localhost:3000/api`.

**Authentication: none of these endpoints check authentication or authorization.** See [AUTHENTICATION.md](AUTHENTICATION.md) and [SECURITY.md](SECURITY.md). This is stated once here and not repeated per-endpoint below, except to flag the admin endpoints, which are especially exposed because they perform writes (delete product, change publish status, moderate reviews, change platform settings) with zero server-side gatekeeping.

---

## POST /api/generate

[app/api/generate/route.ts](../app/api/generate/route.ts#L1)

**Purpose**: Runs the Gemini listing-generation pipeline for one artisan product. Does not persist anything — the caller ([app/create/page.tsx:119](../app/create/page.tsx#L119) via [lib/supabase/products.ts:63](../lib/supabase/products.ts#L63) `saveProduct`) is responsible for saving the result separately.

**Auth**: None.

**Request body** (validated with `VisartInputSchema`, [lib/validation/visart.ts:3](../lib/validation/visart.ts#L3)):
```json
{
  "productName": "string, optional",
  "material": "string, required",
  "productionCost": "number, required, > 0",
  "timeRequired": "string, required",
  "location": "string, required",
  "specialDetails": "string, optional",
  "imageUrl": "string, optional",
  "imageBase64": "string, optional (base64, no data: prefix)",
  "mimeType": "string, optional (e.g. image/jpeg)"
}
```

**Validation**: Zod `safeParse`. On failure → `400 { error: "Invalid input data", details: <zod flatten() output> }`.

**Processing**: See [features/ai-listing-generation.md](features/ai-listing-generation.md) for the full pipeline. Summary: builds a text prompt + optional inline image, tries a cascade of Gemini model names ([lib/ai/visart.ts:249](../lib/ai/visart.ts#L249) `generateVisartListing`) with retry/backoff on transient errors, parses and re-validates the JSON response against `VisartGenerationSchema` ([lib/validation/visart.ts:17](../lib/validation/visart.ts#L17)), and — only if `NEXT_PUBLIC_VISART_DEMO_MODE !== "false"` — falls back to a deterministic mock generation ([lib/ai/visart.ts:173](../lib/ai/visart.ts#L173) `getMockGeneration`) on any failure (missing key, exhausted models, thrown error).

**Response `200`**: a `VisartGeneration` object ([types/visart.ts:24](../types/visart.ts#L24)) — `{ product, pricing, marketing, translations: { hindi, kannada }, story, readiness }`.

**Error responses**:
- `400` — invalid input payload (see above).
- `500` — `{ error: string, message: string }`. In real mode (demo mode off) this happens whenever Gemini fails and there is no fallback (e.g. `GEMINI_API_KEY` missing, or all candidate models return non-transient errors).

**Database interaction**: none.

**Note**: in the actual product UI (`/create`), when `NEXT_PUBLIC_VISART_DEMO_MODE` is not explicitly `"false"`, the browser never calls this endpoint at all — [lib/frontend/generationClient.ts:68](../lib/frontend/generationClient.ts#L68) calls `getMockGeneration()` client-side ([lib/frontend/generationClient.ts:81](../lib/frontend/generationClient.ts#L81)). This endpoint is only reached in "real mode."

---

## GET /api/verify-authenticity

[app/api/verify-authenticity/route.ts](../app/api/verify-authenticity/route.ts#L1)

**Purpose**: Runs the Gemini-backed (or mock) authenticity forensics audit for a product, incorporating existing buyer feedback into the prompt.

**Auth**: None.

**Query params**: `productId` (required).

**Processing**: `getProductById(productId)` ([lib/supabase/products.ts:188](../lib/supabase/products.ts#L188)) → 404 if not found → `getProductFeedback(productId)` ([lib/supabase/feedback.ts:149](../lib/supabase/feedback.ts#L149)) → `generateAuthenticityAudit(product, feedbacks)` ([lib/ai/authenticity.ts:218](../lib/ai/authenticity.ts#L218)). Falls back to `getMockAuthenticityAudit` ([lib/ai/authenticity.ts:138](../lib/ai/authenticity.ts#L138)) if no `GEMINI_API_KEY` or if every candidate model fails, **regardless of demo-mode setting**.

**Response `200`**: `{ "audit": AuthenticityAudit }` ([types/feedback.ts:18](../types/feedback.ts#L18)) — includes `overallScore`, `verdict`, three integrity sub-scores, `authenticMarkers`, `counterfeitWarningSigns`, `spotAFakeGuide`, and a `communityTrustScore` computed from the ratio of positive-vs-total buyer feedback ratings (not AI-generated — computed in code).

**Errors**: `400` missing `productId`; `404` product not found; `500` unexpected error.

**Database interaction**: reads `products` (and joined `artisans`) and `product_feedback` via `lib/supabase/products.ts` / `lib/supabase/feedback.ts`. No writes — the audit is regenerated on every call, not cached or persisted.

---

## GET /api/feedback

[app/api/feedback/route.ts](../app/api/feedback/route.ts#L1)

**Purpose**: Fetch all buyer reviews for a product.

**Auth**: None.

**Query params**: `productId` (required).

**Response `200`**: `{ "feedbacks": CustomerFeedback[] }` ([types/feedback.ts:45](../types/feedback.ts#L45)).

**Errors**: `400` missing `productId`; `500` unexpected error.

**Database interaction**: reads `product_feedback`, preferring the in-memory/localStorage cache over Supabase (see [DATABASE.md](DATABASE.md)).

---

## POST /api/feedback

[app/api/feedback/route.ts](../app/api/feedback/route.ts#L25)

**Purpose**: Submit a buyer review, including their own authenticity verdict and "craft checks," and trigger the Gemini (or heuristic) counterfeit-risk classifier against it.

**Auth**: None. Anyone can post a review for any `productId` under any `userName` with no verification of purchase (`isVerifiedBuyer` is hardcoded `true` in [lib/supabase/feedback.ts:201](../lib/supabase/feedback.ts#L201) `submitProductFeedback`, not actually verified).

**Request body** (`SubmitFeedbackInput`, hand-checked, not Zod-validated):
```json
{
  "productId": "string, required",
  "userName": "string, optional (defaults to 'Verified Craft Collector')",
  "userLocation": "string, optional",
  "rating": "number 1-5, required",
  "authenticityRating": "GENUINE_HANDCRAFTED | LIKELY_GENUINE | SUSPICIOUS_QUALITY | CONFIRMED_FAKE_REPLICA, required",
  "comment": "string, required",
  "craftChecks": {
    "materialHonest": "boolean",
    "handmadeIrregularitiesPresent": "boolean",
    "finishQualityHigh": "boolean",
    "packagingSustainable": "boolean"
  },
  "suspectedCounterfeitReason": "string, optional"
}
```

**Validation**: manual check that `productId`, `comment`, `rating`, `authenticityRating` are present (`400` otherwise). No Zod schema, no range check on `rating`, no length limit on `comment`.

**Processing**: looks up the product, runs `analyzeFeedbackWithGemini` ([lib/ai/authenticity.ts:343](../lib/ai/authenticity.ts#L343), keyword-heuristic fallback if no API key), computes `flaggedAsFake` from the buyer's own verdict OR a Gemini/heuristic risk score `> 60`, then dual-writes to memory/localStorage and (best-effort) Supabase.

**Response `201`**: `{ "success": true, "feedback": CustomerFeedback }`.

**Errors**: `400` missing required fields; `500` unexpected error.

**Database interaction**: writes to `product_feedback`. The Supabase insert is wrapped in try/catch and only logged on failure — a failed DB write does **not** fail the request; the review still "succeeds" from the caller's perspective, backed only by the server's in-memory store (lost on restart) and, in the browser, `localStorage`.

---

## Admin API — `app/api/admin/*`

All six routes below share these properties, verified directly in their source (no route contains any header check, cookie check, or session check):

- **No authentication.** Anyone with network access to the server can call every endpoint below directly (e.g. with `curl`), bypassing `/admin`'s client-side login screen entirely.
- **No authorization / role check.**
- Most underlying data is read from and written to `localStorage` inside `lib/supabase/admin.ts`, which only exists in the browser — so **calling these routes from a non-browser client (curl, a server-to-server call) reads/writes only the server's transient in-memory fallback**, not the same data an admin sees in their own browser tab. This is a data-consistency footgun as well as a security one; see [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md).

### GET /api/admin/activity
[app/api/admin/activity/route.ts:4](../app/api/admin/activity/route.ts#L4)
Query: `limit` (optional, default 100). Returns `{ success, logs: ActivityLog[] }`.

### GET /api/admin/products
[app/api/admin/products/route.ts:13](../app/api/admin/products/route.ts#L13)
Returns `{ success, products: AdminProductSummary[] }` — all products with computed readiness/authenticity/review aggregates.

### PATCH /api/admin/products
[app/api/admin/products/route.ts:26](../app/api/admin/products/route.ts#L26)
Body: `{ productId, isPublished?: boolean, patch?: Partial<VisartGeneration> }`. Toggles publish state or applies a partial edit to `generated_data`. Returns `{ success, product }`.

### DELETE /api/admin/products?id=<productId>
[app/api/admin/products/route.ts:61](../app/api/admin/products/route.ts#L61)
Deletes a product (localStorage + best-effort Supabase). Returns `{ success: boolean }`.

### GET /api/admin/reviews
[app/api/admin/reviews/route.ts:4](../app/api/admin/reviews/route.ts#L4)
Returns `{ success, reviews: ReviewModerationItem[] }` — every review across every product, with a moderation `status`.

### PATCH /api/admin/reviews
[app/api/admin/reviews/route.ts:20](../app/api/admin/reviews/route.ts#L20)
Body: `{ reviewId, status: "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED" }`. Returns `{ success: boolean }`. Status is stored in `localStorage` only — **not written to `product_feedback` in Supabase at all** (there is no `status` column in the schema).

### GET /api/admin/settings
[app/api/admin/settings/route.ts:6](../app/api/admin/settings/route.ts#L6)
Returns `{ success, settings: AdminSystemSettings }` (site title, maintenance mode, active Gemini model, moderation thresholds, etc.). Stored in `localStorage`; the returned "active Gemini model" setting is **not actually wired into [lib/ai/visart.ts:249](../lib/ai/visart.ts#L249)'s model cascade** — changing it in the admin UI has no effect on which Gemini model is used (the cascade reads `process.env.GEMINI_MODEL` plus hardcoded fallbacks, not this setting).

### PUT /api/admin/settings
[app/api/admin/settings/route.ts:19](../app/api/admin/settings/route.ts#L19)
Body: any subset of `AdminSystemSettings`. Merges and returns the updated settings.

### GET /api/admin/stats
[app/api/admin/stats/route.ts:7](../app/api/admin/stats/route.ts#L7)
Returns `{ success, stats: AdminDashboardStats, health: SystemHealthMetrics, performance: PerformanceMetrics }`. **`performance` and parts of `health`/`stats` are hardcoded or randomized**, not measured — see [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) for the exact fields, e.g. [growthRates](../lib/supabase/admin.ts#L308), [geminiAi](../lib/supabase/admin.ts#L579), [generationLatency](../lib/supabase/admin.ts#L598), [conversionRate/cacheHitRate](../lib/supabase/admin.ts#L608) are static numbers.

### GET /api/admin/users?type=all|artisans|customers
[app/api/admin/users/route.ts:13](../app/api/admin/users/route.ts#L13)
Returns artisans and/or customer leads.

### PATCH /api/admin/users
[app/api/admin/users/route.ts:44](../app/api/admin/users/route.ts#L44)
Body: `{ artisanId, status }`. Updates an artisan's status (memory-only, not persisted to the `artisans` Supabase table).

### POST /api/admin/users
[app/api/admin/users/route.ts:67](../app/api/admin/users/route.ts#L67)
Body: a `CustomerLead` minus `id`/`lastActive`. Adds a customer lead (localStorage only — there is no `customers`/`leads` table in the schema at all; this data never reaches Postgres under any configuration).
