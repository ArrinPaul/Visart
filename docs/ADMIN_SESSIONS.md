# Admin sessions (Phase 1, Batch 2)

This batch adds database-backed admin session issuance, validation, and logout on top of the
Batch 1 credential store (`admin_users`, `lib/auth/{email,password}.ts`). It does **not** yet:

- Protect any of the six existing `/api/admin/*` business routes (`activity`, `products`,
  `reviews`, `settings`, `stats`, `users`) — they remain exactly as unauthenticated as Phase 0
  found them. That rewiring, and the admin dashboard UI rewiring the Batch 0.5 validation pass
  identified as also necessary, is Batch 3+.
- Replace or remove the old client-side-only `localStorage`/`AdminLoginPage.tsx` gate —
  `app/admin/page.tsx` and `app/admin/layout.tsx` are untouched.
- Add rate limiting or broad CSRF middleware (explicitly deferred to a later security batch).
- Manage admin accounts (create/deactivate) — Batch 1's manual provisioning procedure
  (`docs/ADMIN_PROVISIONING.md`) is still the only way to create or change an admin account.

**Do not consider this batch "admin authentication is live."** It is the session plumbing that a
later batch will wire the actual `/admin` surface up to.

## What exists after this batch

- `POST /api/admin/auth/login` — verifies email+password against `admin_users`, issues a
  session.
- `POST /api/admin/auth/logout` — deletes the session and clears the cookie.
- `lib/auth/session.ts` — `validateSessionToken` / `getAdminIdentityFromRequest`, reusable by a
  future batch's route guards.
- `admin_sessions` table (migration `0002_create_admin_sessions.sql`, **not yet applied to any
  database** — see `supabase/migrations/README.md`).

## Required environment configuration

| Variable | Secret? | Purpose |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Yes — never `NEXT_PUBLIC_`-prefixed | Used only by `lib/auth/supabaseServiceClient.ts`, only for `admin_users`/`admin_sessions` access. |
| `NEXT_PUBLIC_SUPABASE_URL` | No (already public, pre-existing) | Reused as-is; the project URL is not sensitive. |
| `APP_ORIGIN` | No, but required | Canonical origin (e.g. `http://localhost:3000` or `https://your-domain.example`) checked against the browser's `Origin` header on login/logout. No default — missing or malformed configuration causes every login/logout request to be rejected (fail closed), not silently allowed. |

See `.env.example` for placeholders. **Never put a real service-role key in `.env.example`,
documentation, a migration file, or Git history.**

## Migration application

Requires `0001_create_admin_users.sql` already applied. See
`supabase/migrations/README.md` for `0002_create_admin_sessions.sql`'s exact application and
verification steps. **Not applied to any database as part of this change.**

## Session lifetime

Fixed at 7 days (`lib/auth/sessionExpiry.ts: SESSION_LIFETIME_SECONDS`), chosen as "a reasonable
fixed session lifetime" per this batch's own instructions — there was no pre-existing session
mechanism in this repository to match. No rolling/sliding extension: a session's `expires_at` is
set once, at creation, and never pushed forward by later requests (`last_used_at` is updated for
observability only, and does not affect expiry).

## Cookie behavior

- Name: `visart_admin_session_token` — deliberately different from the pre-existing, unrelated
  `visart_admin_session` **localStorage** key used by the old client-side gate, so the two are
  never confused while both exist.
- `HttpOnly`, `SameSite=Strict`, `Path=/`, `Secure` when `NODE_ENV=production` (not forced in
  development, so local HTTP `http://localhost` continues to work without TLS).
- `maxAge` matches the 7-day session lifetime on login; logout sets `maxAge=0` with the same
  other attributes to clear it.
- The raw token lives only in this cookie. It is never stored (only its SHA-256 hash is, in
  `admin_sessions.token_hash`), never logged, and never accepted from a query string or request
  body.

## Login endpoint contract

`POST /api/admin/auth/login`, body `{ "email": string, "password": string }` (max 256 chars
each, max 2KB total body).

- **Any** of the following produces the exact same response — `401 { success: false, error:
  "Invalid email or password." }` — so a client cannot distinguish them: unknown email, inactive
  account, correct email with wrong password. `verifyPassword` is deliberately always invoked
  (against a fixed dummy hash when no account is found) so the response also costs roughly the
  same wall-clock time in all three cases, closing the most obvious timing side-channel.
- A cross-origin request (missing or mismatched `Origin` header, per `APP_ORIGIN`) is rejected
  with `403 { success: false, error: "Request rejected." }` before any credential check happens.
- Malformed/oversized/missing-field request bodies are rejected with `400`.
- On success: `200 { success: true }` plus the session cookie. No password hash, raw token, or
  other account detail is ever included in any response body.
- Any unexpected error (database unreachable, service-role misconfigured, etc.) is logged
  server-side only and surfaced to the client as the same generic `401` — it never falls through
  to "authenticated," and no internal error detail reaches the client.

## Session validation behavior

`lib/auth/session.ts: validateSessionToken(rawToken)` / `getAdminIdentityFromRequest(req)`:
rejects (returns `null`) a missing/empty token, a token with no matching `admin_sessions` row, an
expired session, a session whose `admin_users` row is missing, and a session whose
`admin_users.is_active` is `false` — in the last case, it also makes a best-effort attempt to
delete every session belonging to that admin (revocation-on-detection), but the rejection does not
depend on that cleanup succeeding. Any database error anywhere in this path also results in
`null`, never in treating the request as authenticated.

## Logout behavior

`POST /api/admin/auth/logout`: requires a matching `Origin` header (same check as login),
deletes the `admin_sessions` row matching the cookie's token (if any), and **always** clears the
cookie in the response regardless of whether the database delete succeeded — a failed database
delete is logged server-side only and never prevents the browser from being logged out locally.

## How account deactivation affects existing sessions

Flipping `admin_users.is_active` to `false` (currently only possible via a direct database
update — there is no deactivation endpoint in this batch, by design) does not retroactively
invalidate a session's `admin_sessions` row by itself, but the **next** validated request for
that session will be rejected and will trigger best-effort deletion of all of that admin's
sessions, per "Session validation behavior" above. There is intentionally no immediate
server-push revocation — revocation is detection-on-next-use, which is adequate for the single
fixed 7-day lifetime this batch uses and does not require any new real-time infrastructure.

## How to test this locally

1. Apply `0001_create_admin_users.sql` and `0002_create_admin_sessions.sql` to a test Supabase
   project (never production) per `supabase/migrations/README.md`.
2. Set `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, and `APP_ORIGIN` (e.g.
   `http://localhost:3000`) in `.env.local`.
3. Provision an admin account per `docs/ADMIN_PROVISIONING.md`.
4. Run `npm run dev`, then from the same origin (e.g. the browser devtools console on
   `http://localhost:3000`, not a bare `curl`, since `curl` does not send an `Origin` header and
   will be rejected by design):
   ```js
   await fetch("/api/admin/auth/login", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ email: "admin@example.com", password: "..." }),
   }).then((r) => r.json());
   ```
   A successful call sets the `visart_admin_session_token` cookie (visible in devtools' Application
   tab, but not readable from `document.cookie` — it is `HttpOnly` by design).
5. `await fetch("/api/admin/auth/logout", { method: "POST" }).then((r) => r.json());` clears it.
6. `npm run test:auth` runs the full automated test suite for this and the Batch 1 utilities
   (60 assertions across 8 files as of this batch) without touching any database.

## What is explicitly deferred

- Rate limiting on the login endpoint (brute-force protection) — a later, dedicated security
  batch, per this batch's own instructions.
- Broad CSRF middleware — only the targeted Origin check in `lib/auth/origin.ts` exists; it is
  reusable by Batch 3's route guards but nothing more is implemented here.
- Guarding the six existing `/api/admin/*` business routes, and rewiring the admin dashboard UI
  off its direct client-side Supabase calls (see Batch 0.5's validation report for why both are
  necessary together) — Batch 3.
- Account deactivation/management UI or endpoint.

**This batch does not make the application production-ready.** The admin dashboard itself is
still fully open to anyone, exactly as Phase 0 found it, until Batch 3 lands.
