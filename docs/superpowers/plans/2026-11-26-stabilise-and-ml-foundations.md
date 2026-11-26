# Stabilise and ML Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make admin access real, then build every part of the verification flow that needs no trained model.

**Architecture:** Admin API routes check a database session. A new Next.js route sends a product photo to a FastAPI service, applies the claim check and stores results with the service-role key. The classifier and embeddings return `null` until later plans supply models.

**Tech Stack:** Next.js 16, TypeScript, Node's built-in TypeScript test run, Supabase + pgvector, Python 3.12, FastAPI, Pillow, NumPy, pytest.

**Spec:** `docs/superpowers/specs/2026-11-26-craft-verification-engine-design.md`

## Global Constraints
- Never claim to prove authenticity; never auto-reject; a check that did not run is "not checked".
- Classes: `pottery`, `wood`, `textile`, `metal`, `bamboo`; plus `uncertain`.
- Embeddings are 512 numbers. Images are at most 8 MB, JPEG/PNG/WebP.
- Fetch images only from the configured Supabase storage host or a `data:` URL.
- Verification never blocks publishing. Demo mode does no verification.
- Testable TypeScript modules use relative `.ts` imports (no `@/`).
- No change to a live database; migrations are applied by the owner.

## Review Focus
- Missing service-role key or `APP_ORIGIN`: admin routes refuse (401/403), pages show an error, nothing crashes.
- ML service down or slow: status `failed`, listing unaffected.
- Image URL pointing elsewhere (`http://169.254.169.254/`, look-alike host): refused.
- Material words inside other words ("steelblue", "claymore") do not match.
- Repeat calls for an already checked product do not recompute.

---

### Task 1: Admin API guard
**Files:** Create `lib/auth/requireAdmin.ts`, `lib/auth/requireAdmin.test.mts`; modify the six `app/api/admin/{activity,products,reviews,settings,stats,users}/route.ts`, `package.json`.
**Produces:** `requireAdmin(req: NextRequest, validate?): Promise<Response | null>` (null means allowed).
- [ ] Test: no cookie → 401; invalid session → 401; valid GET → null; valid PATCH with wrong/missing Origin → 403; valid PATCH with `APP_ORIGIN` → null; validator throws → 401. Run, expect failure.
- [ ] Implement; call first in every exported handler. Run tests, `tsc`. Commit.

### Task 2: Real login on the admin screen
**Files:** Create `app/api/admin/auth/session/route.ts`; rewrite `components/admin/AdminLoginPage.tsx`; modify `app/admin/page.tsx`.
**Produces:** `GET /api/admin/auth/session` → 200 `{success:true,email}` or 401.
- [ ] Page starts as "checking", loads data only when authenticated; logout posts to `/api/admin/auth/logout`.
- [ ] Remove demo credentials, key/PIN mode, one-click login and `visart_admin_session` localStorage use.
- [ ] Verify with a running build: session 401 without cookie, admin APIs 401, `/admin` shows the form. Commit.

### Task 3: Claim check
**Files:** Create `lib/ml/claim.ts`, `lib/ml/claim.test.mts`.
**Produces:** `type CraftClass`, `type ClaimResult = "match"|"mismatch"|"cannot_tell"`, `checkClaim(material: string, predicted: CraftClass | "uncertain" | null): ClaimResult`.
- [ ] Test: ("Teak wood","wood") match; ("Terracotta clay","textile") mismatch; ("brass","uncertain"), ("brass",null), ("resin","wood") and ("claymore","pottery") cannot_tell; ("Cotton and brass","metal") match. Fail, implement with whole-word matching, pass, commit.

### Task 4: Safe image loading
**Files:** Create `lib/ml/imageSource.ts`, `lib/ml/imageSource.test.mts`.
**Produces:** `loadImage(url: string, supabaseUrl: string, fetcher?: typeof fetch): Promise<{bytes: Uint8Array; mimeType: string}>`, throws `ImageSourceError`.
- [ ] Test: valid data URL; allowed storage URL; refused: other host, look-alike host, `http:` on https project, non-storage path, wrong type, over 8 MB, redirect. Fail, implement (`redirect: "error"`, 10 s timeout), pass, commit.

### Task 5: ML tables
**Files:** Create `supabase/migrations/0003_create_ml_tables.sql`; update `supabase/migrations/README.md`.
**Produces:** tables `listing_checks` (primary key `product_id`), `image_embeddings`; function `match_image_embeddings(query vector(512), exclude_product text, min_similarity float)` returning `product_id, similarity`.
- [ ] RLS on, no policies, `revoke all` from `anon, authenticated`, function execute revoked too. Commit.

### Task 6: ML service
**Files:** Create `ml-service/app.py`, `ml-service/quality.py`, `ml-service/requirements.txt`, `ml-service/README.md`, `ml-service/tests/test_app.py`.
**Produces:** `GET /health`; `POST /analyze` (multipart field `file`, header `x-ml-secret`) → `{model_version, quality:{score,tips}, classification:null, embedding:null}`.
- [ ] Test: no/wrong secret 401; `ML_SERVICE_SECRET` unset 503; non-image 400; oversize 413; dark image tip; blurred tip; small tip; sharp bright large image scores 100 with no tips. Fail, implement, pass, commit.

### Task 7: Verification route
**Files:** Create `lib/ml/verifyListing.ts`, `lib/ml/verifyListing.test.mts`, `lib/ml/serviceStore.ts`, `app/api/verify-listing/route.ts`.
**Consumes:** `checkClaim`, `loadImage`.
**Produces:** `verifyListing(productId, deps): Promise<{status:"checked"|"failed"|"not_found"}>`; `POST /api/verify-listing {productId}` → `{success,status}` only, no scores.
- [ ] Test: unknown product; already checked → no recompute; service error → saves `failed`; success saves quality and claim `cannot_tell` when classification is null; embedding present → saves it and records the best duplicate.
- [ ] Route: trusted origin, body ≤ 1 KB, in-memory rate limit, 503 when unconfigured. Commit.

### Task 8: Trigger, environment and docs
**Files:** Modify `app/create/page.tsx`, `.env.example`, `docs/API.md`, `docs/ENVIRONMENT.md`, `docs/DATABASE.md`, `docs/AUTHENTICATION.md`, `package.json`.
- [ ] After a product is saved, call the route without awaiting it, only outside demo mode.
- [ ] Add `ML_SERVICE_URL`, `ML_SERVICE_SECRET`. Run all tests, `tsc`, lint, build. Commit.

## Later plans (need images or models first)
Image collection and manifest, classifier training, CLIP embeddings, artisan quality tips, admin review queue, Grad-CAM.
