// Minimal verification script — this repository has no test runner configured (no Jest/Vitest
// in package.json; see docs/TESTING.md / Phase 0 audit TD-015). Rather than adding a test
// framework dependency for one small utility, this file is a plain assertion script executed
// directly via Node's built-in TypeScript support:
//
//   node --experimental-strip-types lib/auth/email.test.mts
//
// (also wired up as `npm run test:auth`). It exits non-zero on any failed assertion.

import assert from "node:assert/strict";
import { normalizeEmail } from "./email.ts";

let passed = 0;

function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

check("trims leading/trailing whitespace", () => {
  assert.equal(normalizeEmail("  admin@visart.in  "), "admin@visart.in");
});

check("lowercases mixed-case input", () => {
  assert.equal(normalizeEmail("Admin@Visart.IN"), "admin@visart.in");
});

check("trims and lowercases together", () => {
  assert.equal(normalizeEmail("  Admin@Visart.IN  "), "admin@visart.in");
});

check("is idempotent", () => {
  const once = normalizeEmail("  Admin@Visart.IN  ");
  assert.equal(normalizeEmail(once), once);
});

check("rejects non-string input", () => {
  assert.throws(() => normalizeEmail(null as unknown as string), TypeError);
});

console.log(`\n${passed} passed, 0 failed`);
