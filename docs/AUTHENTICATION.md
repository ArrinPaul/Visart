# Authentication

## Summary

**There is no real authentication system anywhere in this application.**

- **Public site** (`/`, `/create`, `/workspace`, `/product/[id]`): no accounts, no login, no sessions, no concept of "the current user" at all. Anyone can create a listing, view any product, and submit feedback as any name they type in.
- **Admin portal** (`/admin`): has a login *screen*, but it is a client-side-only gate with hardcoded credentials shipped in the JavaScript bundle, and it defaults to letting you in anyway. It provides zero real access control. Treat `/admin` as a public, unauthenticated page for security purposes.
- **Supabase Auth is not used.** `@supabase/supabase-js` is used only for database/storage access via the anonymous key — there is no `supabase.auth.*` call anywhere in the codebase.

## Public Site

No sign-up, sign-in, or session mechanism exists. "Artisan" identity in `/create` is hardcoded to the literal string `"Local Artisan"` ([`app/create/page.tsx:124`](../app/create/page.tsx#L124)) — the form never actually collects or verifies who the artisan is. Buyer identity for feedback (`/api/feedback` POST) is a free-text `userName` field with no verification.

## Admin Portal Login Flow (as implemented)

1. [`app/admin/page.tsx:56`](../app/admin/page.tsx#L56) initializes `isAuthenticated` state to **`true`** by default. It only becomes `false` if `localStorage.getItem("visart_admin_session")` is exactly the string `"unauthenticated"` — which nothing in the app ever sets. In practice, **the admin UI renders unauthenticated-gate-free on first load for anyone**, until/unless something explicitly writes that sentinel value.
2. If the login screen is reached, [`components/admin/AdminLoginPage.tsx:27`](../components/admin/AdminLoginPage.tsx#L27) exports hardcoded credentials directly in source:
   ```ts
   export const ADMIN_CREDENTIALS = {
     email: "admin@visart.in",
     password: "visart@2026",
     adminKey: "VISART-ADMIN-2026",
     pin: "2026",
   };
   ```
   These strings ship as-is inside the client JavaScript bundle — anyone can read them via browser devtools or `view-source`, no reverse engineering required.
3. Login accepts **any of several bypasses** on top of the "real" credentials: email `"admin"` + password `"admin"` or `"2026"` also succeed; the "key" login mode also accepts the literal string `"admin"`.
4. On success, the only effect is `localStorage.setItem("visart_admin_session", "authenticated")` plus a display name. There is no token, no cookie, no server round-trip, no expiry.
5. **The server never checks any of this.** Every [`app/api/admin/*`](../app/api/admin) route handler (verified by reading all six route files) performs the requested action unconditionally — no `Authorization` header check, no cookie check, no session lookup. Calling `curl -X DELETE http://.../api/admin/products?id=<id>` succeeds with no credentials at all.

## What This Means in Practice

- The `/admin` login screen is a UX affordance, not a security boundary. It can be bypassed by:
  - Navigating to `/admin` when `localStorage` has never been touched (default-authenticated).
  - Using any of the several accepted bypass credentials.
  - Calling the `/api/admin/*` endpoints directly, skipping the UI and the login screen entirely.
- There are no roles (no ADMIN vs ARTISAN vs BUYER distinction is enforced anywhere at runtime — `role` fields exist only in display/log data like `ActivityLog.actor.role`, which is client-supplied string data, not an authorization mechanism).
- If this application is ever exposed on a public network as-is, the entire admin CMS — including deleting products, editing all listing content, and changing platform settings — is reachable by anyone.

## Modification Guide

Introducing real authentication would require, at minimum: a server-verified session (e.g. Supabase Auth with a proper `users`/roles table, or NextAuth/an equivalent), an auth check added to every [`app/api/admin/*`](../app/api/admin) route handler (currently none exist), and replacing the RLS "allow all" policies in [`supabase/schema.sql:37`](../supabase/schema.sql#L37) with policies scoped to authenticated roles. See [SECURITY.md](SECURITY.md) for the full list of related gaps (RLS, storage policies) that would also need to change together — fixing only the admin login screen without fixing the API routes and RLS policies would not close the gap.
