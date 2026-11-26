--
-- Purpose: introduce a dedicated `admin_users` table to back custom admin
-- authentication (replacing the hardcoded, client-side-only credentials in
-- components/admin/AdminLoginPage.tsx — that replacement happens in a later,
-- separately reviewed batch; this migration only adds the table).
--
-- This repository has no migration tool and no `supabase/migrations/` convention prior to this
-- file. This migration follows the same manual-application model; see supabase/migrations/README.md
-- for the exact application procedure.
--
-- Security posture (do not weaken without a documented reason):
--   - RLS is enabled with ZERO policies defined below. This means every role
--     subject to RLS (anon, authenticated) is denied all access by default.
--     Only a service-role connection (which bypasses RLS) or a direct
--     Supabase SQL editor / postgres-role session can read or write this table.
--   - No SELECT/INSERT/UPDATE/DELETE policy is defined for anon or authenticated
--     roles. Do not add one for this table without an explicit, reviewed reason —
--     admin_users.password_hash must never be reachable via the public anon key.
--   - This migration does not touch any policy on products, artisans,
--     product_feedback, or storage.objects. Existing public workflows are
--     unaffected.
--
-- ==============================================================================

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Case-insensitive, whitespace-insensitive uniqueness. This must stay in agreement
-- with lib/auth/email.ts's normalizeEmail() (trim + lowercase) — both sides apply
-- the exact same two transformations (trim, then lowercase), so an email that the
-- application treats as a duplicate is also rejected at the database level even if
-- application-level normalization is ever bypassed or has a bug.
create unique index if not exists admin_users_normalized_email_idx
  on public.admin_users (lower(trim(email)));

-- Enable RLS with no policies: default-deny for anon and authenticated roles.
alter table public.admin_users enable row level security;

-- Defense in depth: explicitly strip any default schema-level grants, so a
-- misconfigured project default (e.g. default privileges granting SELECT to
-- anon/authenticated on new tables) cannot expose this table even before RLS
-- is considered. This does not change grants on any other existing table.
revoke all on public.admin_users from anon, authenticated;
