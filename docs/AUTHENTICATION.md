# Authentication

## Summary

- **Public site** (`/`, `/create`, `/workspace`, `/product/[id]`): no accounts, login or sessions. Anyone can create a listing, view any product and submit feedback under any name.
- **Admin** (`/admin`, `/api/admin/*`): database-backed sessions. See [ADMIN_SESSIONS.md](ADMIN_SESSIONS.md) and [ADMIN_PROVISIONING.md](ADMIN_PROVISIONING.md).
- **Supabase Auth is not used.**

## Admin login

1. `/admin` asks `GET /api/admin/auth/session` and shows the login form on anything but 200.
2. `POST /api/admin/auth/login` checks the origin and the scrypt password hash, then sets an HttpOnly, SameSite=Strict session cookie.
3. Every `/api/admin/*` data route calls `requireAdmin` (`lib/auth/requireAdmin.ts`): 401 without a valid session, 403 for a write from another origin.
4. Logout deletes the session row and clears the cookie.

It needs migrations `0001` and `0002`, an admin account, `SUPABASE_SERVICE_ROLE_KEY` and `APP_ORIGIN`. Without them nobody can sign in. There is no demo login.

## What is still not protected

- **The `/admin` screen reads and writes data from the browser** through `lib/supabase/*` with the public anon key. It does not go through `/api/admin/*`. The login controls what the screen shows, not who can change data.
- **Row Level Security is still public** ([`supabase/schema.sql`](../supabase/schema.sql)), so anyone holding the anon key can change products and feedback directly. See [SECURITY.md](SECURITY.md).
- The login route has no rate limiting.
- There are no roles beyond "admin".

## Next steps

Move the admin screen's data access behind the guarded API routes, then replace the public RLS policies. Doing only one of the two does not close the gap.
