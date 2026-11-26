# Supabase migrations

This directory did not exist before Phase 1, Batch 1. Prior to this, the entire
schema lived in a single hand-maintained file, [`supabase/schema.sql`](../schema.sql)
(see [`docs/DATABASE.md`](../../docs/DATABASE.md) and
[`docs/DEPLOYMENT.md`](../../docs/DEPLOYMENT.md)). There is no Supabase CLI
migration runner wired into this project and none is introduced by this change —
these files are applied the same way `schema.sql` always has been: manually.

## Convention

- Each migration is a single `.sql` file, numbered in application order
  (`0001_`, `0002_`, ...), named after what it does.
- Migrations are additive and reviewed individually; none of them are applied
  automatically by any script, build step, or CI job.
- After a migration is applied to a given Supabase project, update
  [`types/database.ts`](../../types/database.ts) by hand to match, exactly as
  described for `schema.sql` in `docs/DATABASE.md`.

## How to apply `0001_create_admin_users.sql`

1. Open the target Supabase project's **SQL Editor** (or connect via `psql`/the
   Supabase CLI's `db execute` against that project — either way, this is a
   manual, one-time step for each environment, the same as `schema.sql`).
2. Paste the full contents of `0001_create_admin_users.sql` and run it.
3. Confirm the table exists with RLS enabled and no policies:
   ```sql
   select relrowsecurity from pg_class where relname = 'admin_users';
   -- expect: t (true)

   select policyname from pg_policies where tablename = 'admin_users';
   -- expect: zero rows
   ```
4. Do **not** run this against a production project until the owner has
   reviewed and approved this batch.

This migration has **not** been applied to any database as part of this change —
applying it is an explicit, separate operational step for the project owner.

## How to apply `0002_create_admin_sessions.sql`

Requires `0001_create_admin_users.sql` to already be applied (this migration's
`admin_user_id` column references `admin_users(id)`).

1. Open the target Supabase project's **SQL Editor**.
2. Paste the full contents of `0002_create_admin_sessions.sql` and run it.
3. Confirm the table exists with RLS enabled and no policies:
   ```sql
   select relrowsecurity from pg_class where relname = 'admin_sessions';
   -- expect: t (true)

   select policyname from pg_policies where tablename = 'admin_sessions';
   -- expect: zero rows
   ```
4. Confirm the foreign key and indexes exist:
   ```sql
   select indexname from pg_indexes where tablename = 'admin_sessions';
   -- expect: admin_sessions_pkey, admin_sessions_token_hash_idx,
   --         admin_sessions_admin_user_id_idx, admin_sessions_expires_at_idx
   ```
5. Do **not** run this against a production project until the owner has
   reviewed and approved this batch.

This migration has **not** been applied to any database as part of this change —
applying it is an explicit, separate operational step for the project owner.

## How to apply `0003_create_ml_tables.sql`

Requires `supabase/schema.sql` and `0001_create_admin_users.sql` to be applied first. Run the full
file in the SQL Editor, then confirm that both tables have RLS enabled and no policies:

```sql
select relname, relrowsecurity from pg_class where relname in ('listing_checks', 'image_embeddings');
select tablename, policyname from pg_policies where tablename in ('listing_checks', 'image_embeddings');
-- expect: both true, and zero policy rows
```

This migration has **not** been applied to or run against any database yet.
