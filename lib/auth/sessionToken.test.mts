// Run: node --experimental-strip-types lib/auth/sessionToken.test.mts
// (wired up as part of `npm run test:auth`)

import assert from "node:assert/strict";
import { generateSessionToken, hashSessionToken, SESSION_TOKEN_BYTES } from "./sessionToken.ts";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

check("token has at least 32 bytes of underlying entropy", () => {
  assert.ok(SESSION_TOKEN_BYTES >= 32);
});

check("generated token is a non-empty, URL-safe string", () => {
  const token = generateSessionToken();
  assert.ok(token.length > 0);
  assert.doesNotMatch(token, /[+/=]/); // base64url has no +, /, or = padding
});

check("two generated tokens are different", () => {
  const a = generateSessionToken();
  const b = generateSessionToken();
  assert.notEqual(a, b);
});

check("hashing the same token twice is deterministic", () => {
  const token = generateSessionToken();
  assert.equal(hashSessionToken(token), hashSessionToken(token));
});

check("hashing two different tokens produces different hashes", () => {
  const a = generateSessionToken();
  const b = generateSessionToken();
  assert.notEqual(hashSessionToken(a), hashSessionToken(b));
});

check("hash output is a 64-character lowercase hex string (SHA-256)", () => {
  const hash = hashSessionToken(generateSessionToken());
  assert.match(hash, /^[0-9a-f]{64}$/);
});

console.log(`\n${passed} passed, 0 failed`);
