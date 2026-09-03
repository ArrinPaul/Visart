# Security

This document states facts found in the code and their concrete impact. It does not fix anything — fixes belong in [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md)-tracked work, by explicit decision (this documentation pass is not authorized to change application behavior).

## Findings, Most Severe First

### 1. Admin CMS has no server-side authentication or authorization — Critical
**Where**: all 6 files under [`app/api/admin/*/route.ts`](../app/api/admin).
**Fact**: none of these route handlers reference any header, cookie, session, or token. They execute unconditionally.
**Impact**: any network client can read all products/reviews/artisans/customers/activity/settings, delete any product, change any product's publish state or content, moderate (or un-moderate) any review, and overwrite platform settings — with zero credentials. The client-side login screen ([`components/admin/AdminLoginPage.tsx`](../components/admin/AdminLoginPage.tsx)) provides no protection against this because it never gates the API, only a UI route.
**Related**: [AUTHENTICATION.md](AUTHENTICATION.md).

### 2. Admin login is hardcoded and shipped to the client, with a default-open state — Critical
**Where**: [`components/admin/AdminLoginPage.tsx:27`](../components/admin/AdminLoginPage.tsx#L27), [`app/admin/page.tsx:56`](../app/admin/page.tsx#L56).
**Fact**: credentials (`admin@visart.in` / `visart@2026`, plus bypass values `admin`/`admin`, `admin`/`2026`, key `VISART-ADMIN-2026` or `2026`) are literal strings in client-shipped source. `isAuthenticated` defaults to `true` unless `localStorage` explicitly says otherwise.
**Impact**: even if finding #1 were fixed by adding server checks, this client gate is trivially bypassable and provides no real identity assertion (no signed token is produced or verified).

### 3. Fully public, unauthenticated read/write RLS policies on all tables — Critical
**Where**: [`supabase/schema.sql:37`](../supabase/schema.sql#L37), policies on `artisans`, `products`, `product_feedback`.
**Fact**: every policy is `using (true)` / `with check (true)` for `select`/`insert`/`update` (no `delete` policy exists on any table).
**Impact**: the Supabase anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), which is public by design (shipped to every browser), can be used directly — bypassing the Next.js server entirely — to read, insert, or modify any row in any of these three tables from a browser console or any HTTP client. There is no per-row ownership (no `user_id`/auth-linked column) to scope this. Combined with finding #1, this means the "admin-only" data mutations are reachable through at least two independent unauthenticated paths: the Next.js `/api/admin/*` routes, and direct Supabase REST/JS-client calls using the public anon key.

### 4. Public, unauthenticated write access to Supabase Storage bucket — High
**Where**: [`supabase/schema.sql:71`](../supabase/schema.sql#L71), `storage.objects` policies for bucket `product-images`.
**Fact**: public `select`, `insert`, and `update` policies, no size/type restriction enforced at the database/storage-policy level (size/MIME validation exists only client-side in [`lib/supabase/storage.ts:10`](../lib/supabase/storage.ts#L10), which a direct API call would bypass).
**Impact**: anyone can upload arbitrary files to the public bucket directly via the Supabase Storage API, without going through the app's client-side validation.

### 5. No purchase/identity verification behind "Verified Buyer" — Medium
**Where**: [`lib/supabase/feedback.ts:220`](../lib/supabase/feedback.ts#L220) (inside `submitProductFeedback`) — `isVerifiedBuyer: true` is hardcoded on every submitted review; there is no order/purchase table anywhere in the schema.
**Impact**: the "Verified Buyer" badge shown on the public product page is not a real verification signal — it is always true regardless of whether any purchase occurred. This affects the credibility of the authenticity-review system the product positions as an anti-fraud feature.

### 6. No rate limiting on any endpoint — Medium
**Where**: all of `app/api/**`.
**Fact**: no middleware, no per-IP or per-session throttling exists anywhere in the codebase (confirmed: no `middleware.ts` file at the project root).
**Impact**: `/api/generate` and `/api/verify-authenticity` both call the paid Gemini API with no caller-side cost control — a scripted client could drive unbounded Gemini API spend. `/api/feedback` POST has no throttling either, so the review/feedback system has no spam protection beyond nothing.

### 7. Verbose server-side `console.log`/`console.warn` of request data — Low
**Where**: throughout [`lib/ai/visart.ts`](../lib/ai/visart.ts), [`app/api/generate/route.ts`](../app/api/generate/route.ts), [`lib/supabase/products.ts`](../lib/supabase/products.ts), etc. (all guarded mostly by `NODE_ENV === "development"`, but some — e.g. [`saveProduct`](../lib/supabase/products.ts#L63)'s debug logs, the `[VISART DEBUG]` lines in `route.ts` — are unconditional).
**Impact**: low on its own (no secrets logged), but worth flagging because generated product titles/descriptions/prices are logged on every request in production, which is unnecessary log volume and a minor information-exposure surface if logs are shared broadly.

## What Is Handled Reasonably

- **Input validation on `/api/generate`**: proper Zod `safeParse` with a `400` on failure ([`lib/validation/visart.ts`](../lib/validation/visart.ts), [`app/api/generate/route.ts`](../app/api/generate/route.ts)).
- **AI output re-validation**: the Gemini structured-output response is parsed and re-validated against the same `VisartGenerationSchema` before being trusted ([`lib/ai/visart.ts:362`](../lib/ai/visart.ts#L362)), which guards against a malformed/hallucinated response shape reaching the client.
- **Image upload constraints (client-side)**: MIME allowlist (`image/jpeg`, `image/png`, `image/webp`) and an 8MB size cap are enforced in [`lib/supabase/storage.ts:10`](../lib/supabase/storage.ts#L10) before upload — though, per finding #4, this is not enforced at the storage-policy layer, so it only protects users of the app's own UI, not direct API callers.
- **No `dangerouslySetInnerHTML` usage** anywhere in `app/` / `components/` / `lib/` (verified by repo-wide search) — no obvious stored-XSS vector from rendering AI- or user-generated text as raw HTML. React's default JSX escaping is relied on throughout.
- **Secrets stay server-side where it matters most**: `GEMINI_API_KEY` is read only in server-side modules ([`lib/ai/*.ts`](../lib/ai), which are only imported from Route Handlers and the server-rendered [`app/product/[id]/page.tsx`](../app/product/%5Bid%5D/page.tsx)), and is not one of the `NEXT_PUBLIC_*`-prefixed variables that Next.js would inline into client bundles.

### 8. `next.config.mjs` allows Next.js Image Optimization to fetch any remote host — Low/Medium
**Where**: [`next.config.mjs:5`](../next.config.mjs#L5) — `images.remotePatterns` is `[{ protocol: "https", hostname: "**" }, { protocol: "http", hostname: "**" }]`.
**Impact**: the built-in `next/image` optimizer will proxy-fetch (server-side) any URL passed to it, from any hostname, over HTTP or HTTPS. Since AI-generated/artisan-supplied `imageUrl` values flow into product data with no allowlist, this is a wide-open server-side-fetch surface if any `next/image` component ever renders a user/AI-supplied URL — worth narrowing to known hosts (e.g. the Supabase Storage domain) if this becomes internet-facing.

## Environment / Secrets

See [ENVIRONMENT.md](ENVIRONMENT.md) for the full variable list. Nothing resembling a `SUPABASE_SERVICE_ROLE_KEY` is used anywhere in the code — every Supabase call, including from the "admin" library, uses the public anon key. This is consistent with finding #3 (the anon key must be assumed fully public and is treated as such by the RLS policies, however permissively).
