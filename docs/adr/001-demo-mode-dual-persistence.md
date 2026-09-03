# ADR-001: Dual-Write/Dual-Read Persistence with Demo Mode

## Context

Visart needs to be runnable and fully clickable (create a listing, view it, leave feedback, browse the admin CMS) by a judge/evaluator or new developer with **zero external configuration** — no Gemini API key, no Supabase project. At the same time, when those credentials *are* provided, the app should behave like a normal database-backed product.

## Decision

Every persistence-touching function in `lib/supabase/*.ts` (most visibly [`products.ts`](../../lib/supabase/products.ts), also [`feedback.ts`](../../lib/supabase/feedback.ts) and the localStorage-backed parts of [`admin.ts`](../../lib/supabase/admin.ts)) implements a layered read/write strategy rather than a single database call:

- **Writes** ([`saveProduct`](../../lib/supabase/products.ts#L63), `updateProductData`, etc.) always write to an in-process `Map` (`memoryStore`) and to the browser's `localStorage`/`sessionStorage` first, unconditionally. Only *after* that do they attempt a Supabase insert/update, wrapped in a `try/catch` that swallows failures with a `console.warn`.
- **Reads** ([`getProductById`](../../lib/supabase/products.ts#L188), `getRecentProducts`) check, in order: the in-memory `Map`, then `localStorage`/`sessionStorage`, then a bundled seed dataset ([`lib/data/seed.ts`](../../lib/data/seed.ts)), and only fall through to a live Supabase query last.
- Whether Supabase is even attempted is gated by `isSupabaseConfigured()` / `isSupabaseLive` (see [`lib/supabase/config.ts`](../../lib/supabase/config.ts), [`lib/supabase/client.ts`](../../lib/supabase/client.ts)), which checks that the relevant `NEXT_PUBLIC_SUPABASE_*` env vars are present and don't contain the placeholder `"your-project"`.
- `NEXT_PUBLIC_VISART_DEMO_MODE` similarly governs the Gemini side ([`lib/ai/visart.ts`](../../lib/ai/visart.ts), [`lib/ai/authenticity.ts`](../../lib/ai/authenticity.ts)): missing key or model failure returns a deterministic, input-derived mock generation instead of erroring, whenever demo mode is not explicitly `"false"`.

## Alternatives Considered

Not documented in the repository — no prior ADRs or design notes exist for this decision. This ADR is written retrospectively from the implementation.

## Reason

Inferred from the code's structure and comments (e.g. [`lib/supabase/products.ts:129`](../../lib/supabase/products.ts#L129), "Always store locally for zero-latency workspace preview & offline fallback"): the priority is that the demo/local path is the *primary*, always-executed path, and Supabase is best-effort and additive. This strongly suggests the system was built to guarantee a working demo above guaranteeing durable, consistent server-side state.

## Consequences

- **Positive**: the app works out of the box for any evaluator with no setup, per `.env.example` shipping only the demo-mode flag.
- **Negative — state fragmentation**: a product saved in one browser's `localStorage` is invisible to any other browser/device unless Supabase is also configured and the write succeeded, and even then the local and remote copies can silently diverge (writes to Supabase are fire-and-forget past the `try/catch`; a failed Supabase insert is not surfaced to the user, and the local copy is treated as authoritative for that session).
- **Negative — no source of truth**: reads prefer memory/localStorage over the database, so once real Supabase data exists, any client whose `localStorage` disagrees with the database will not see the current database state for that ID.
- **Negative — the admin CMS's product/review views may not reflect true database contents** if a browser's local state has diverged; see [`docs/features/admin-cms.md`](../features/admin-cms.md).
- This pattern should be understood by anyone modifying `lib/supabase/*.ts` — a "fix" that removes the local-first behavior without also removing demo mode support would break the zero-config demo experience; a "fix" that keeps it without acknowledging the consistency tradeoff will reintroduce confusing bugs (see [`docs/TECHNICAL_DEBT.md`](../TECHNICAL_DEBT.md) TD-004).

## Future Considerations

If Visart moves toward a real multi-user/production deployment, this pattern should be replaced with: Supabase as the sole source of truth, `NEXT_PUBLIC_VISART_DEMO_MODE` used only to select between a real Supabase project and a *separate, clearly-labeled* seeded demo Supabase project — not an in-browser shadow copy of the data.
