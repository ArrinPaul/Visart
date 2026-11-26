// Run: node --experimental-strip-types lib/auth/origin.test.mts
// (wired up as part of `npm run test:auth`)

import assert from "node:assert/strict";
import { isTrustedOrigin } from "./origin.ts";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const originalAppOrigin = process.env.APP_ORIGIN;

check("matching origin is trusted", () => {
  process.env.APP_ORIGIN = "https://visart.example";
  assert.equal(isTrustedOrigin("https://visart.example"), true);
});

check("matching origin is trusted even with a request path/trailing slash variant", () => {
  process.env.APP_ORIGIN = "https://visart.example/";
  assert.equal(isTrustedOrigin("https://visart.example"), true);
});

check("mismatched host is rejected", () => {
  process.env.APP_ORIGIN = "https://visart.example";
  assert.equal(isTrustedOrigin("https://evil.example"), false);
});

check("mismatched scheme is rejected", () => {
  process.env.APP_ORIGIN = "https://visart.example";
  assert.equal(isTrustedOrigin("http://visart.example"), false);
});

check("mismatched port is rejected", () => {
  process.env.APP_ORIGIN = "https://visart.example";
  assert.equal(isTrustedOrigin("https://visart.example:8443"), false);
});

check("missing Origin header is rejected", () => {
  process.env.APP_ORIGIN = "https://visart.example";
  assert.equal(isTrustedOrigin(null), false);
  assert.equal(isTrustedOrigin(undefined), false);
  assert.equal(isTrustedOrigin(""), false);
});

check("malformed Origin header is rejected, not thrown", () => {
  process.env.APP_ORIGIN = "https://visart.example";
  assert.equal(isTrustedOrigin("not a url"), false);
});

check("missing APP_ORIGIN configuration fails closed (rejects)", () => {
  delete process.env.APP_ORIGIN;
  assert.equal(isTrustedOrigin("https://visart.example"), false);
});

check("malformed APP_ORIGIN configuration fails closed (rejects)", () => {
  process.env.APP_ORIGIN = "not-a-valid-origin";
  assert.equal(isTrustedOrigin("not-a-valid-origin"), false);
});

if (originalAppOrigin === undefined) {
  delete process.env.APP_ORIGIN;
} else {
  process.env.APP_ORIGIN = originalAppOrigin;
}

console.log(`\n${passed} passed, 0 failed`);
