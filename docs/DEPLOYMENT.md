# Deployment

**Deployment Status: not currently documented or configured in this repository.** There is no `Dockerfile`, no `vercel.json`, no `.github/workflows`, no `netlify.toml`, and no deployment script beyond the standard Next.js CLI commands in `package.json`. The statements below describe what the project's own tooling supports, not a claim that any specific hosting is already wired up.

## Build

```bash
npm install
npm run build   # next build (Turbopack, per package.json's stated stack)
npm run start   # next start — serves the production build
```

`npm run dev` runs the Turbopack dev server (`next dev`) for local development.

## Environment Variables Required at Build/Run Time
See [ENVIRONMENT.md](ENVIRONMENT.md). None are strictly required for a working build/start — the app falls back to demo/mock data with none set. For a real deployment intended to use live AI and persistent storage, at minimum set `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and set `NEXT_PUBLIC_VISART_DEMO_MODE=false`.

## Database Setup for a Real Deployment
1. Create a Supabase project.
2. Run the entirety of `supabase/schema.sql` in the Supabase SQL editor (there is no migration runner — this is a one-time manual step, and any future schema change requires manually running new SQL and updating `types/database.ts` by hand).
3. Confirm the `product-images` storage bucket was created (the schema file creates it via `insert into storage.buckets ...`).
4. **Before exposing this publicly, read [SECURITY.md](SECURITY.md)** — the schema as written grants fully public read/write access to all three tables and the storage bucket via RLS policies that are not scoped to any authenticated role.

## Server Requirements
Standard Next.js 16 App Router deployment target — any platform that runs a Node.js server process (or the Node.js/Edge runtime a given host provides for Next.js) can serve this app. No server-side background workers, cron jobs, or queues are used, so no additional infrastructure beyond "run the Next.js server" is required by the current codebase.

## Caveat: In-Memory State Does Not Survive Multiple Instances
Because `lib/supabase/products.ts`, `lib/supabase/feedback.ts`, and `lib/supabase/admin.ts` all keep an in-process `Map`/module-level variable as part of their fallback/cache layer, **any deployment topology with more than one server instance/replica (or a serverless platform that spins up fresh instances per request) will see inconsistent data** between instances for anything not fully persisted to Supabase — and, per [DATABASE.md](DATABASE.md#what-actually-reaches-postgres), a large portion of the admin CMS's data is never persisted to Supabase at all. This is a structural limitation to resolve (moving that state into Supabase or another shared store) before deploying to any multi-instance/serverless environment where consistent behavior across requests matters. See [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md).

## Health Checks
None exist. The "System Health" shown in `/admin` (`GET /api/admin/stats`) is a request-time synchronous check, not a monitoring endpoint suitable for external health-check tooling, and it reports several fields as hardcoded/simulated rather than measured (see [features/admin-cms.md](features/admin-cms.md)).

## Rollback
No deployment-specific rollback tooling exists in this repo; rollback would follow whatever the chosen hosting platform provides for a standard Next.js app (e.g. redeploying a previous build artifact/commit).
