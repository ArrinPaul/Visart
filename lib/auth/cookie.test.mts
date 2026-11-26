// Run: node --experimental-strip-types lib/auth/cookie.test.mts
// (wired up as part of `npm run test:auth`)

import assert from "node:assert/strict";
import {
  ADMIN_SESSION_COOKIE_NAME,
  SESSION_LIFETIME_SECONDS,
  buildSessionCookieOptions,
  buildClearedSessionCookieOptions,
} from "./cookie.ts";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

check("cookie name is distinct from the legacy localStorage key", () => {
  assert.notEqual(ADMIN_SESSION_COOKIE_NAME, "visart_admin_session");
});

check("live session cookie is HttpOnly, SameSite=Strict, Path=/", () => {
  const opts = buildSessionCookieOptions();
  assert.equal(opts.httpOnly, true);
  assert.equal(opts.sameSite, "strict");
  assert.equal(opts.path, "/");
  assert.equal(opts.maxAge, SESSION_LIFETIME_SECONDS);
});

const originalNodeEnv = process.env.NODE_ENV;

check("secure=true when NODE_ENV=production", () => {
  process.env.NODE_ENV = "production";
  assert.equal(buildSessionCookieOptions().secure, true);
});

check("secure=false when NODE_ENV=development", () => {
  process.env.NODE_ENV = "development";
  assert.equal(buildSessionCookieOptions().secure, false);
});

check("secure=false when NODE_ENV is unset", () => {
  delete process.env.NODE_ENV;
  assert.equal(buildSessionCookieOptions().secure, false);
});

process.env.NODE_ENV = originalNodeEnv;

check("cleared-cookie options match live options except maxAge=0", () => {
  process.env.NODE_ENV = "production";
  const live = buildSessionCookieOptions();
  const cleared = buildClearedSessionCookieOptions();
  assert.equal(cleared.httpOnly, live.httpOnly);
  assert.equal(cleared.secure, live.secure);
  assert.equal(cleared.sameSite, live.sameSite);
  assert.equal(cleared.path, live.path);
  assert.equal(cleared.maxAge, 0);
  process.env.NODE_ENV = originalNodeEnv;
});

console.log(`\n${passed} passed, 0 failed`);
