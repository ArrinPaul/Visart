// Server-only. Pure session-lifetime logic, kept separate from lib/auth/session.ts so it is
// testable without any database/mocking (see lib/auth/sessionExpiry.test.mts).

// 7 days. This repository has no pre-existing session-lifetime requirement to match, so this uses
// the batch instructions' own example of "a reasonable fixed session lifetime." The database
// expires_at value (lib/auth/session.ts: createSessionForAdmin) and the cookie's max-age
// (lib/auth/cookie.ts) are both derived from this single constant so they cannot drift apart.
export const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 7;

export function computeExpiryDate(now: Date = new Date()): Date {
  return new Date(now.getTime() + SESSION_LIFETIME_SECONDS * 1000);
}

export function isExpired(expiresAtIso: string, now: Date = new Date()): boolean {
  const expiresAtMs = new Date(expiresAtIso).getTime();
  if (Number.isNaN(expiresAtMs)) {
    // A malformed/unparseable expiry must never be treated as "not expired" — fail closed.
    return true;
  }
  return expiresAtMs <= now.getTime();
}
