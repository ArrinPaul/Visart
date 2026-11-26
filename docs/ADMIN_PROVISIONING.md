# Initial admin account provisioning (manual, one-time)

Phase 1, Batch 1 introduces the `admin_users` table (`supabase/migrations/0001_create_admin_users.sql`)
and a server-only password-hashing utility (`lib/auth/password.ts`), but **does not** create any
login/session endpoint yet (that is Batch 2) and **does not** create a default or bootstrap admin
account automatically — there is no public registration endpoint, and none is planned.

The owner-approved procedure for creating the first admin account is manual:

## Procedure

1. **Apply the migration.** Follow `supabase/migrations/README.md` to run
   `0001_create_admin_users.sql` against the target Supabase project's SQL editor. Confirm RLS is
   enabled and no policies exist on `admin_users` (the verification query is in that README).

2. **Generate a password hash locally.** From the repository root, run:
   ```
   node --experimental-strip-types scripts/provision-admin.mts
   ```
   (equivalently `npm run provision:admin`). This prompts for an email and a password
   interactively — the password is never echoed to the terminal, never accepted as a
   command-line argument, never written to any file, and never logged. It runs entirely on your
   own machine; it does not connect to Supabase or anywhere else over the network.

3. **Insert the record.** The script prints a ready-to-paste `insert into public.admin_users (...)`
   statement containing the normalized email and the computed password hash (not the plaintext
   password — the hash is one-way and not reversible). Paste that statement into the Supabase SQL
   editor for the target project and run it.

4. **Verify without exposing the hash.** The script also prints a `select id, email, is_active,
   created_at from public.admin_users where ...` statement that confirms the row exists without
   ever selecting `password_hash`. Run that to confirm the insert succeeded.

5. **Do not commit anything from this process.** The terminal output of step 2/3 (email +
   password hash) must not be pasted into a commit message, an issue, a chat log, or any file in
   this repository. Close the terminal session once the insert in step 3 is confirmed. If you
   need a record that an admin account exists, note only the email address and the date — never
   the hash.

## Why this is manual rather than automatic

The owner explicitly selected manual, one-time provisioning over an automatic bootstrap account,
specifically to avoid ever having a default or hardcoded credential in source control or in a
migration file — which was the exact problem with the current `ADMIN_CREDENTIALS` constant this
batch is working to replace (see Phase 0 audit, TD-001/TD-002). A script that silently created a
default admin account would reintroduce the same class of problem in a new form.

## What is still missing after this batch

This batch only creates the credential store. Logging in, issuing a session, and guarding the
`/api/admin/*` routes with that session are Batch 2 and later — until those ship, the existing
client-side-only login screen in `components/admin/AdminLoginPage.tsx` is unchanged and remains
the only (non-)gate in front of `/admin`, and the `admin_users` row created here is not yet
checked by anything at runtime.
