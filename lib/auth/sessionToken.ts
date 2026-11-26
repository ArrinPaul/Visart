// Server-only. Opaque admin session token generation and hashing.
//
// The raw token (generateSessionToken's return value) is what goes in the browser's HttpOnly
// cookie. Only hashSessionToken's output is ever stored in the admin_sessions.token_hash column
// — the raw token itself is never written to the database, logged, or included in any response
// body. See lib/auth/session.ts for how these are used together.

import { randomBytes, createHash } from "node:crypto";

// 32 bytes = 256 bits of entropy, the minimum this batch specifies. base64url keeps the value
// cookie-safe (no characters requiring percent-encoding) with no padding characters.
export const SESSION_TOKEN_BYTES = 32;

export function generateSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
}

// SHA-256 is used here purely as a fast, indexed lookup key for an already-high-entropy random
// token — this is not password storage (scrypt in lib/auth/password.ts is for that), so a fast
// hash is the correct and sufficient choice: the token itself, not a guessable password, is the
// secret, and a 256-bit random value cannot be feasibly brute-forced regardless of hash speed.
export function hashSessionToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}
