// Minimal verification script — see email.test.mts for why this isn't a Jest/Vitest test.
// Run: node --experimental-strip-types lib/auth/password.test.mts
// (also wired up as `npm run test:auth`). Exits non-zero on any failed assertion.
//
// Does not log any password, salt, or derived key value, including on failure.

import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "./password.ts";

let passed = 0;

async function check(name: string, fn: () => Promise<void> | void) {
  await fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

await check("hash generation produces the expected self-describing format", async () => {
  const hash = await hashPassword("correct horse battery staple");
  const parts = hash.split("$");
  assert.equal(parts.length, 8);
  assert.equal(parts[0], "scrypt");
});

await check("correct password verifies successfully", async () => {
  const hash = await hashPassword("a-real-admin-password-123");
  const ok = await verifyPassword("a-real-admin-password-123", hash);
  assert.equal(ok, true);
});

await check("incorrect password is rejected", async () => {
  const hash = await hashPassword("a-real-admin-password-123");
  const ok = await verifyPassword("a-different-password", hash);
  assert.equal(ok, false);
});

await check("same password hashed twice produces different salts and different hashes", async () => {
  const hashA = await hashPassword("same-password-both-times");
  const hashB = await hashPassword("same-password-both-times");
  assert.notEqual(hashA, hashB);
  const saltA = hashA.split("$")[6];
  const saltB = hashB.split("$")[6];
  assert.notEqual(saltA, saltB);
  // ...but both still verify correctly against the one password that produced them.
  assert.equal(await verifyPassword("same-password-both-times", hashA), true);
  assert.equal(await verifyPassword("same-password-both-times", hashB), true);
});

await check("malformed hash (wrong segment count) is rejected, not thrown", async () => {
  const ok = await verifyPassword("anything", "scrypt$1$16384$8$1$64$onlysixparts");
  assert.equal(ok, false);
});

await check("unsupported algorithm tag is rejected", async () => {
  const hash = await hashPassword("whatever-password");
  const tampered = "md5" + hash.slice("scrypt".length);
  const ok = await verifyPassword("whatever-password", tampered);
  assert.equal(ok, false);
});

await check("unsupported version is rejected", async () => {
  const hash = await hashPassword("whatever-password");
  const parts = hash.split("$");
  parts[1] = "99";
  const ok = await verifyPassword("whatever-password", parts.join("$"));
  assert.equal(ok, false);
});

await check("non-base64-decodable salt/hash segments are rejected safely", async () => {
  const ok = await verifyPassword(
    "whatever-password",
    "scrypt$1$16384$8$1$64$not-valid-base64!!!$not-valid-base64!!!"
  );
  assert.equal(ok, false);
});

await check("absurdly large embedded N is rejected before being passed to scrypt", async () => {
  const hash = await hashPassword("whatever-password");
  const parts = hash.split("$");
  parts[2] = String(1 << 30); // far above MAX_N
  const ok = await verifyPassword("whatever-password", parts.join("$"));
  assert.equal(ok, false);
});

await check("empty password is rejected by hashPassword", async () => {
  await assert.rejects(() => hashPassword(""));
});

await check("empty password is rejected by verifyPassword (no throw)", async () => {
  const hash = await hashPassword("some-password");
  const ok = await verifyPassword("", hash);
  assert.equal(ok, false);
});

await check("empty stored hash is rejected by verifyPassword (no throw)", async () => {
  const ok = await verifyPassword("some-password", "");
  assert.equal(ok, false);
});

console.log(`\n${passed} passed, 0 failed`);
