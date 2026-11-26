// Server-only, authentication-only Supabase service-role client.
//
// SCOPE: this module exists exclusively to back lib/auth/session.ts and the
// app/api/admin/auth/* routes (login/logout/session validation against admin_users and
// admin_sessions). It must never be used for products/artisans/feedback/storage/analytics or
// any other admin business operation — those stay on the existing public anon-key path
// (lib/supabase/*) until a later, separately-authorized batch. Do not import this module from
// lib/supabase/admin.ts or any other general-purpose/browser-importable module, and do not add
// generic CRUD helpers here.
//
// This repository has no "server-only" package installed (confirmed absent from package.json;
// not added here per the "ask before installing" instruction). The existing convention for
// keeping a secret server-side in this codebase (see lib/ai/visart.ts and GEMINI_API_KEY) is:
// read it from a non-"NEXT_PUBLIC_"-prefixed environment variable (so webpack's NEXT_PUBLIC_
// inlining never embeds it in a client bundle) and only import the module from server contexts
// (Route Handlers, server components). This module follows that same convention, plus one extra,
// explicit runtime guard below that throws immediately if this module is ever evaluated in a
// browser — a second, independent line of defense in case it is ever accidentally imported from
// a "use client" file.
if (typeof window !== "undefined") {
  throw new Error(
    "lib/auth/supabaseServiceClient must never be imported into client-side code. " +
      "This indicates a server-only module was accidentally bundled for the browser."
  );
}

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `${name} is not configured. Admin authentication is unavailable until it is set ` +
        `(fail-closed by design).`
    );
  }
  return value;
}

/**
 * Returns a cached, server-only Supabase client authenticated with the service-role key,
 * restricted by convention (see module comment above) to admin_users/admin_sessions access.
 *
 * Fails closed: throws if the required environment variables are missing or malformed, rather
 * than silently falling back to the public anon key or any other reduced-privilege client.
 */
export function getAuthServiceClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  // The project URL is not a secret (it is already the public NEXT_PUBLIC_SUPABASE_URL used
  // throughout lib/supabase/*) — reusing it here does not weaken anything. Only the service-role
  // key itself must come from a non-public variable, which is the actual sensitive value.
  const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl.startsWith("http")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is malformed (does not start with http/https). " +
        "Admin authentication is unavailable until it is corrected."
    );
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
