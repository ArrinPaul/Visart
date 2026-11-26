// Server-only. Admin session cookie naming and attributes, shared by the login and logout
// routes so the two can never drift out of sync with each other (logout must clear the cookie
// using the exact same name/path/sameSite/secure/httpOnly attributes login set it with).

import { SESSION_LIFETIME_SECONDS } from "./sessionExpiry.ts";

// The "_token" suffix keeps this HttpOnly cookie distinct from older localStorage keys.
export const ADMIN_SESSION_COOKIE_NAME = "visart_admin_session_token";

export { SESSION_LIFETIME_SECONDS };

export type SessionCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "strict";
  path: "/";
  maxAge: number;
};

/**
 * Cookie attributes for setting a live session. `secure` is derived from NODE_ENV rather than a
 * new environment variable, matching the batch's "Secure in production" / dev-friendly-over-HTTP
 * requirement with no extra configuration surface.
 */
export function buildSessionCookieOptions(
  maxAgeSeconds: number = SESSION_LIFETIME_SECONDS
): SessionCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Cookie attributes for clearing the session cookie on logout. Must use the exact same
 * httpOnly/secure/sameSite/path as buildSessionCookieOptions — only maxAge differs (0, so the
 * browser discards it immediately).
 */
export function buildClearedSessionCookieOptions(): SessionCookieOptions {
  return buildSessionCookieOptions(0);
}
