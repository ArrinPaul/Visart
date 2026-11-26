// Run: node --experimental-strip-types lib/auth/sessionExpiry.test.mts
// (wired up as part of `npm run test:auth`)

import assert from "node:assert/strict";
import {
  SESSION_LIFETIME_SECONDS,
  computeExpiryDate,
  isExpired,
} from "./sessionExpiry.ts";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

check("session lifetime is documented as 7 days", () => {
  assert.equal(SESSION_LIFETIME_SECONDS, 60 * 60 * 24 * 7);
});

check("computeExpiryDate adds exactly the session lifetime", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");
  const expiry = computeExpiryDate(now);
  assert.equal(expiry.getTime() - now.getTime(), SESSION_LIFETIME_SECONDS * 1000);
});

check("a future expiry is not expired", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");
  const future = new Date(now.getTime() + 1000).toISOString();
  assert.equal(isExpired(future, now), false);
});

check("a past expiry is expired", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");
  const past = new Date(now.getTime() - 1000).toISOString();
  assert.equal(isExpired(past, now), true);
});

check("an expiry exactly at `now` is treated as expired", () => {
  const now = new Date("2026-01-01T00:00:00.000Z");
  assert.equal(isExpired(now.toISOString(), now), true);
});

check("a malformed expiry string is treated as expired (fail closed)", () => {
  assert.equal(isExpired("not-a-date"), true);
});

console.log(`\n${passed} passed, 0 failed`);
