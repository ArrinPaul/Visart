# Admin setup

There is no demo login and no public sign-up. Do this once per Supabase project.

**Shortcut:** after step 1, run `npm run setup` in your own terminal. It asks for the keys and your
admin email and password, writes `.env.local` and creates the account, replacing steps 2 to 4.

1. In the Supabase SQL editor run `supabase/schema.sql` (if not already applied), then the files in
   `supabase/migrations/` in number order. See `supabase/migrations/README.md`.
2. Run `npm run provision:admin` and enter an email and password. It runs locally and prints an
   `insert` statement containing a password hash.
3. Paste that statement into the SQL editor and run it. Do not save or commit the output.
4. Set these in `.env.local`:
   - `SUPABASE_SERVICE_ROLE_KEY` (server only, never prefix it with `NEXT_PUBLIC_`)
   - `APP_ORIGIN`, for example `http://localhost:3000`
5. Restart the app and sign in at `/admin`.

Sessions last 7 days. To block an admin, set `is_active = false` on their row in `admin_users`.
