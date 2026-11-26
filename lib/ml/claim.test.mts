// Run: node --experimental-strip-types lib/ml/claim.test.mts
import assert from "node:assert/strict";
import { checkClaim } from "./claim.ts";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

check("agreeing material matches", () => assert.equal(checkClaim("Teak wood", "wood"), "match"));
check("disagreeing material mismatches", () => assert.equal(checkClaim("Terracotta clay", "textile"), "mismatch"));
check("no usable prediction cannot be told", () => {
  assert.equal(checkClaim("brass", "uncertain"), "cannot_tell");
  assert.equal(checkClaim("brass", null), "cannot_tell");
});
check("unknown material cannot be told", () => assert.equal(checkClaim("resin", "wood"), "cannot_tell"));
check("words inside words do not count", () => assert.equal(checkClaim("claymore steelblue", "pottery"), "cannot_tell"));
check("any named material may match", () => assert.equal(checkClaim("Cotton and brass", "metal"), "match"));

console.log(`\n${passed} passed, 0 failed`);
