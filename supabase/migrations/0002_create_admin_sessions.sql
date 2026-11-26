--
-- Purpose: back custom admin session issuance/validation/logout (app/api/admin/auth/*,
-- lib/auth/session.ts) with a real, revocable, database-backed session store. Only a
-- SHA-256 hash of each session token is ever stored here — the raw token is never
-- persisted anywhere, only held in the browser's HttpOnly cookie (see lib/auth/cookie.ts).
--
-- Follows the migration convention established in 0001_create_admin_users.sql /
-- supabase/migrations/README.md: a single hand-written, manually-applied SQL file.
-- Not applied to any database as part of this change.
--
-- Security posture (do not weaken without a documented reason):
--   - RLS is enabled with ZERO policies, same as admin_users. Default-deny for anon and
--     authenticated. Only a service-role connection (lib/auth/supabaseServiceClient.ts) or a
--     direct SQL-editor/postgres-role session can read or write this table.
--   - admin_user_id cascades on delete from admin_users, so deleting an admin account also
--     removes its sessions (defense in depth alongside the application-level session
--     revocation in lib/auth/session.ts when is_active is false).
--   - This migration does not touch admin_users' columns, or any policy on products,
--     artisans, product_feedback, or storage.objects.
--
-- ==============================================================================

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.admin_users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

-- Every validation does an exact lookup by token_hash (lib/auth/session.ts:
-- validateSessionToken) — this unique index both enforces "one row per hash" and is the
-- index that lookup query actually uses.
create unique index if not exists admin_sessions_token_hash_idx
  on public.admin_sessions (token_hash);

-- Supports: (a) revoking/listing all sessions for a given admin when is_active flips to
-- false (lib/auth/session.ts), and (b) a future housekeeping job deleting rows past
-- expires_at without a full table scan.
create index if not exists admin_sessions_admin_user_id_idx
  on public.admin_sessions (admin_user_id);

create index if not exists admin_sessions_expires_at_idx
  on public.admin_sessions (expires_at);

-- Enable RLS with no policies: default-deny for anon and authenticated roles.
alter table public.admin_sessions enable row level security;

-- Defense in depth, same as admin_users.
revoke all on public.admin_sessions from anon, authenticated;
