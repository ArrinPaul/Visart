# User Flows

These are the concrete UI/code paths that exist today, based on the actual pages and components read for this documentation pass. There are no user accounts, so "artisan" and "buyer" below are roles-by-context, not authenticated identities.

## 1. New Artisan Creates a Listing

```
Landing page (/)
  ↓  clicks "Create my listing"
/create — ProductForm
  ↓  types or voice-dictates: material, production cost, time required, location, optional details
  ↓  (optional) drags/selects a photo in ImageUploader
  ↓  clicks "Create my listing" (submit)
ProcessingState (animated multi-stage loader)
  ↓  concurrently: generateListing() [demo: mock, ~2s delay | real: POST /api/generate]
  ↓                uploadProductImage() [Supabase Storage, or base64 data-URL fallback]
  ↓  saveProduct() persists the combined result
  ↓  router.push("/workspace?id=<id>")
/workspace?id=<id> — WorkspaceContainer
  ↓  (client-side hydration corrects the product if the server-rendered version fell back to a seed —
  ↓   see features/artisan-workspace.md)
  ↓  artisan reviews/edits Listing / Pricing / Marketing / Reach / Readiness tabs
  ↓  edits saved via updateProductData()
(Listing is now visible at /product/<id> if is_published, which defaults to true on creation)
```
Sources: [`app/create/page.tsx`](../app/create/page.tsx#L63), [`lib/frontend/generationClient.ts`](../lib/frontend/generationClient.ts#L62), [`lib/supabase/products.ts#saveProduct`](../lib/supabase/products.ts#L63).

On error (generation or save fails): `ProcessingState` shows an error message with a retry option; the artisan stays on `/create`, no listing is created.

## 2. Buyer Views a Product and Checks Authenticity

```
Buyer navigates to /product/<id>  (e.g. from a shared link, or discovered via the landing catalogue)
  ↓  (Server Component render)
getProductById(id) → 404 page if not found
  ↓
getProductFeedback(id) + generateAuthenticityAudit(product, feedbacks)  [runs on every request, uncached]
  ↓
ProductView renders (all sections inlined directly in ProductView.tsx, not via the separate
ProductHero.tsx / ProductDetails.tsx / ArtisanStory.tsx components, which exist but are unused):
  - Title, description, price range, material, technique, story narrative + "Listen" button
    (AudioPlayerControl → browser SpeechSynthesis)
  - LanguageSwitcher — toggles displayed title/description between English/Hindi/Kannada
    (only these two fields are actually translated — see features/translation.md)
  - AuthenticityInspector — overall score, verdict, material/technique/pricing integrity scores,
    authentic markers, counterfeit warning signs, "spot a fake" tactile/visual/material checks
  - ProductFeedbackSection — existing buyer reviews + community trust score
```
Sources: [`app/product/[id]/page.tsx`](../app/product/[id]/page.tsx#L38), [`components/product/ProductView.tsx`](../components/product/ProductView.tsx#L37).

## 3. Buyer Leaves Feedback / Reports Suspected Counterfeit

```
On /product/<id>, in ProductFeedbackSection
  ↓  buyer enters: name (free text), rating (1-5), authenticity verdict (own judgment),
  ↓                comment, craft checks (material honest? irregularities present? finish quality?
  ↓                packaging sustainable?), optional "suspected counterfeit reason"
  ↓  submits
POST /api/feedback
  ↓  required-field check → submitProductFeedback()
  ↓  keyword heuristic scan + Gemini (or heuristic-only) risk classification
  ↓  flaggedAsFake computed from buyer's own verdict OR AI/heuristic risk score
  ↓  dual-write memory/localStorage + best-effort Supabase insert
  ↓  201 response
ProductFeedbackSection re-renders with the new review appended
(Next authenticity-audit regeneration for this product — e.g. on the next page load —
 will factor this review's comment and verdict into its prompt and recompute communityTrustScore)
```
Sources: [`app/api/feedback/route.ts`](../app/api/feedback/route.ts#L1), [`lib/supabase/feedback.ts#submitProductFeedback`](../lib/supabase/feedback.ts#L205).

## 4. Admin Reviews/Moderates the Catalogue

```
Admin navigates to /admin
  ↓  (client-side auth gate — default-authenticated; see AUTHENTICATION.md)
AdminSidebar → selects a view (Dashboard / Products / Artisans / Customers / Reviews / Analytics /
                Performance / Activity / Settings)
  ↓
View fetches its backing GET /api/admin/* endpoint on mount
  ↓
Admin takes an action, e.g. in Reviews: approve/flag a review
  ↓
PATCH /api/admin/reviews  { reviewId, status }
  ↓  updateReviewStatus() — writes to localStorage only (not to product_feedback in Supabase)
  ↓  logAdminActivity() appends an entry to the (localStorage-only) activity log
View re-fetches / optimistically updates
```
Sources: [`app/admin/page.tsx`](../app/admin/page.tsx#L50), [`app/api/admin/reviews/route.ts`](../app/api/admin/reviews/route.ts#L1).

See [features/admin-cms.md](features/admin-cms.md) for which of these views reflect real, persisted data versus seed/simulated data.
