// Server-only by convention (not enforced by a bundler guard — see lib/ai/* for the same
// existing pattern in this repo). Must be imported only from server-side code (API routes,
// Route Handlers, or the provisioning script), never from a "use client" component.
//
// This exact transformation (trim, then lowercase) must stay in lockstep with the database-level
// uniqueness index in supabase/migrations/0001_create_admin_users.sql
// (`lower(trim(email))`), so the application's notion of "the same email" and the database's
// agree. If this function ever changes, that index must change with it.

export function normalizeEmail(email: string): string {
  if (typeof email !== "string") {
    throw new TypeError("normalizeEmail: email must be a string");
  }
  return email.trim().toLowerCase();
}
