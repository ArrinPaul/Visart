// Server-only. Database-backed admin session lifecycle: create, validate, delete.
//
// Every function here is "fail closed": any database error, missing configuration, or
// unexpected shape is treated as "no valid session" / "operation did not succeed," never as
// "allow access" or "assume success." Nothing in this file trusts admin identity from anywhere
// other than a successful admin_sessions lookup by hashed token (never from request bodies,
// headers, query strings, localStorage, or client-side state).
if (typeof window !== "undefined") {
  throw new Error(
    "lib/auth/session must never be imported into client-side code. This indicates a " +
      "server-only module was accidentally bundled for the browser."
  );
}

import type { SupabaseClient } from "@supabase/supabase-js";
// Type-only import: erased at compile time, so this file has no runtime dependency on the
// Next.js server runtime and remains plain-Node-testable (see session.test.mts).
import type { NextRequest } from "next/server";
import { getAuthServiceClient } from "./supabaseServiceClient.ts";
import { generateSessionToken, hashSessionToken } from "./sessionToken.ts";
import { computeExpiryDate, isExpired } from "./sessionExpiry.ts";
import { ADMIN_SESSION_COOKIE_NAME } from "./cookie.ts";

export type AdminIdentity = {
  id: string;
  email: string;
};

export type CreatedSession = {
  rawToken: string;
  expiresAt: Date;
};

type AdminSessionRow = {
  id: string;
  admin_user_id: string;
  expires_at: string;
};

type AdminUserRow = {
  id: string;
  email: string;
  is_active: boolean;
};

/**
 * Issues a new session for an already-authenticated admin (the caller — the login route — is
 * responsible for verifying the password first; this function does not re-verify credentials).
 * Stores only the SHA-256 hash of the newly generated token; the raw token is returned so the
 * caller can set it as the HttpOnly cookie value, and is never written anywhere by this function.
 */
export async function createSessionForAdmin(
  adminUserId: string,
  client: SupabaseClient = getAuthServiceClient()
): Promise<CreatedSession> {
  const rawToken = generateSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = computeExpiryDate();

  const { error } = await client.from("admin_sessions").insert({
    admin_user_id: adminUserId,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error("Failed to create admin session.");
  }

  return { rawToken, expiresAt };
}

/**
 * Validates a raw session token (as read from the admin session cookie) against the database.
 * Returns the minimal trusted admin identity on success, or null for every failure case: missing
 * token, no matching session, expired session, missing admin account, inactive admin account, or
 * a database error. Callers must treat null as "unauthenticated" with no further detail.
 */
export async function validateSessionToken(
  rawToken: string | null | undefined,
  client?: SupabaseClient
): Promise<AdminIdentity | null> {
  if (!rawToken || typeof rawToken !== "string" || rawToken.trim().length === 0) {
    return null;
  }

  let resolvedClient: SupabaseClient;
  try {
    resolvedClient = client ?? getAuthServiceClient();
  } catch {
    return null;
  }

  const tokenHash = hashSessionToken(rawToken);

  const { data: session, error: sessionError } = await resolvedClient
    .from("admin_sessions")
    .select("id, admin_user_id, expires_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (sessionError || !session) {
    return null;
  }

  const sessionRow = session as AdminSessionRow;

  if (isExpired(sessionRow.expires_at)) {
    return null;
  }

  const { data: admin, error: adminError } = await resolvedClient
    .from("admin_users")
    .select("id, email, is_active")
    .eq("id", sessionRow.admin_user_id)
    .maybeSingle();

  if (adminError || !admin) {
    return null;
  }

  const adminRow = admin as AdminUserRow;

  if (!adminRow.is_active) {
    // Best-effort revocation of every session belonging to this now-inactive admin. This is a
    // cleanup side effect, not the source of truth for the rejection — the function rejects this
    // request regardless of whether the revoke call below succeeds.
    try {
      await resolvedClient.from("admin_sessions").delete().eq("admin_user_id", adminRow.id);
    } catch {
      // Intentionally swallowed: this is best-effort cleanup, not part of the fail-closed
      // decision being made (the caller still gets `null` either way).
    }
    return null;
  }

  // Best-effort activity timestamp; never affects the validation outcome in either direction.
  try {
    await resolvedClient
      .from("admin_sessions")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", sessionRow.id);
  } catch {
    // Intentionally swallowed, see above.
  }

  return { id: adminRow.id, email: adminRow.email };
}

/**
 * Convenience wrapper for future protected server handlers (Batch 3+): reads the admin session
 * cookie directly off a NextRequest and validates it. Deliberately does not read a token from
 * query strings, headers, or the request body — only the designated HttpOnly cookie is ever a
 * valid source of the session token.
 */
export async function getAdminIdentityFromRequest(
  req: NextRequest,
  client?: SupabaseClient
): Promise<AdminIdentity | null> {
  const rawToken = req.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? null;
  return validateSessionToken(rawToken, client);
}

/**
 * Deletes the session matching the given raw token, if any. Always returns a result object
 * rather than throwing, so callers (the logout route) can clear the browser cookie
 * unconditionally while still knowing, for server-side diagnostics only, whether the database
 * deletion actually succeeded.
 */
export async function deleteSessionByToken(
  rawToken: string | null | undefined,
  client?: SupabaseClient
): Promise<{ ok: boolean }> {
  if (!rawToken || typeof rawToken !== "string" || rawToken.trim().length === 0) {
    return { ok: true };
  }

  let resolvedClient: SupabaseClient;
  try {
    resolvedClient = client ?? getAuthServiceClient();
  } catch (err) {
    console.error(
      "[VISART ADMIN AUTH] logout: service client unavailable, cookie will still be cleared:",
      err instanceof Error ? err.message : String(err)
    );
    return { ok: false };
  }

  const tokenHash = hashSessionToken(rawToken);

  const { error } = await resolvedClient.from("admin_sessions").delete().eq("token_hash", tokenHash);

  if (error) {
    console.error(
      "[VISART ADMIN AUTH] logout: failed to delete session row, cookie will still be cleared:",
      error.message
    );
    return { ok: false };
  }

  return { ok: true };
}
