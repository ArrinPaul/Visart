# Error Handling

## API Route Handlers
Every route handler under `app/api/**` follows the same pattern: a single top-level `try/catch` (e.g. [app/api/generate/route.ts:43](../app/api/generate/route.ts#L43)), `console.error` on catch, and a JSON error body with an appropriate status. There is no shared/centralized error-handling middleware or error-response helper — each route builds its own `NextResponse.json({...}, { status })` inline, which is why the exact error-body shape differs slightly between routes (compare `{ error, details }` on [/api/generate's 400](../app/api/generate/route.ts#L21) vs. `{ success: false, error }` on the admin routes vs. `{ error }` on `/api/feedback` and `/api/verify-authenticity`). See [API.md](API.md) for the exact shape per route.

```
Failure Origin              Error Handler                    API Response              Frontend Handler                 User Feedback
─────────────────           ─────────────────                ────────────              ──────────────────                ─────────────
Zod validation failure  →   safeParse() branch in route.ts →  400 + details        →   caller reads .error/.message  →  inline form error /
                                                                                                                          toast, per component
Gemini API error          → try/catch in lib/ai/*.ts        →  demo mode: swallowed,    generateListing() throws     →  errorMessage state,
  (missing key, all         (mode-dependent: see             real mode: propagated       (real mode only)               shown in ProcessingState
  models exhausted,         ARCHITECTURE.md "Demo Mode")      as 500                                                     with a retry button
  malformed response)
Supabase read/write error → try/catch, console.warn only    →  (none — write "succeeds" from the caller's perspective using the local
                              (see note below)                  cache; read falls through to the next fallback source in the chain)
Missing required field    → manual check or Zod             →  400                  →  caller-specific handling      →  varies by page/component
  (feedback, generate)
Product not found          → explicit null check             →  404                  →  product/[id]/page.tsx renders a
                                                                                          "Product Listing Not Found" empty state
Unhandled exception        → outer try/catch in route.ts     →  500, message =         →  generic error surfaced
                                                                  err.message or
                                                                  "Internal Server Error"
```

## The Supabase "Never Throw" Pattern
Every Supabase write in [lib/supabase/products.ts](../lib/supabase/products.ts#L174) (e.g. `saveProduct`'s insert), `feedback.ts`, and `admin.ts` is wrapped in its own try/catch that only logs (`console.warn`) on failure — it never re-throws. This is a deliberate resilience choice (see [ARCHITECTURE.md](ARCHITECTURE.md) and [DATABASE.md](DATABASE.md)) that keeps the app usable with no/broken Supabase connectivity, but it means **the caller and the end user have no way to know a database write silently failed** — a product or review that "saved successfully" from the UI's perspective may only exist in the current browser's `localStorage`, not in Postgres. There is no retry queue, no "sync pending" indicator, and no reconciliation job.

## Empty / Loading States
- `ProcessingState` ([components/create/ProcessingState.tsx](../components/create/ProcessingState.tsx#L1)) — multi-stage animated loader during generation; also renders the error+retry UI described above.
- [app/product/\[id\]/page.tsx:42](../app/product/[id]/page.tsx#L42) — explicit "Product Listing Not Found" panel with a link back to `/workspace` when `getProductById` returns `null`.
- Admin views generally fetch on mount with a `loading` state flag (verify per-component in `components/admin/*.tsx`); no shared skeleton/error-boundary component was found — each view manages its own loading UI.
- No global React Error Boundary was found in [app/layout.tsx](../app/layout.tsx#L1) or elsewhere — an unhandled render-time exception in a client component would fall through to Next.js's default error handling (i.e. its built-in `error.tsx` convention, if present — none exists in this repo, so Next.js's framework-default error UI would apply).

## Frontend Error Surfacing Style
Inconsistent by design of the codebase (not a deliberate pattern): some flows show inline error banners (`/create`), some rely on console logging only (many admin mutations do not surface failure to the user beyond a failed optimistic update), and none use a global toast/notification system — no toast library is a dependency in `package.json`.
