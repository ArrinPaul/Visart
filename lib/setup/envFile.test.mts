// Run: node --experimental-strip-types lib/setup/envFile.test.mts
import assert from "node:assert/strict";
import { getEnvValue, setEnvValue, keyProblem } from "./envFile.ts";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const file = "# comment\r\nA=1\r\nKEY=\r\n# old project: KEY=zzz\r\n";

check("reads values and ignores comments", () => {
  assert.equal(getEnvValue(file, "A"), "1");
  assert.equal(getEnvValue(file, "KEY"), "");
  assert.equal(getEnvValue(file, "MISSING"), "");
});
check("replaces one line and keeps everything else", () => {
  assert.equal(setEnvValue(file, "KEY", "v$1"), "# comment\r\nA=1\r\nKEY=v$1\r\n# old project: KEY=zzz\r\n");
});
check("appends a missing name", () => {
  assert.equal(setEnvValue("A=1\n", "B", "2"), "A=1\nB=2\n");
  assert.equal(setEnvValue("A=1", "B", "2"), "A=1\nB=2\n");
});
check("catches keys pasted into the wrong prompt", () => {
  const publishable = "sb_publishable_" + "x".repeat(20);
  const secret = "sb_secret_" + "x".repeat(20);
  assert.equal(keyProblem("publishable", publishable), null);
  assert.equal(keyProblem("secret", secret), null);
  assert.match(keyProblem("publishable", secret)!, /sb_publishable_/);
  assert.match(keyProblem("secret", publishable)!, /sb_secret_/);
  assert.match(keyProblem("secret", "sb_secret_ a b")!, /spaces/);
});

console.log(`\n${passed} passed, 0 failed`);
