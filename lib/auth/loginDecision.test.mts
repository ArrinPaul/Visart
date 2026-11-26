// Run: node --experimental-strip-types lib/auth/loginDecision.test.mts
// (wired up as part of `npm run test:auth`)
//
// This is the test for the "no account enumeration" property: a missing account, an inactive
// account, and a wrong password must all be "rejected" — i.e. must all produce the exact same
// response from app/api/admin/auth/login/route.ts. See lib/auth/loginDecision.ts for why this
// logic is factored out into a pure function instead of being tested by constructing a
// NextRequest against a live database.

import assert from "node:assert/strict";
import { decideLoginOutcome } from "./loginDecision.ts";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

check("unknown account is rejected", () => {
  const outcome = decideLoginOutcome({ adminFound: false, isActive: false, passwordMatches: false });
  assert.equal(outcome, "rejected");
});

check("unknown account is rejected even if passwordMatches is somehow true", () => {
  // Defensive case: adminFound=false should never actually pair with passwordMatches=true in
  // the real route (there's no hash to match against), but the decision must not depend on that.
  const outcome = decideLoginOutcome({ adminFound: false, isActive: false, passwordMatches: true });
  assert.equal(outcome, "rejected");
});

check("inactive account with correct password is rejected", () => {
  const outcome = decideLoginOutcome({ adminFound: true, isActive: false, passwordMatches: true });
  assert.equal(outcome, "rejected");
});

check("active account with wrong password is rejected", () => {
  const outcome = decideLoginOutcome({ adminFound: true, isActive: true, passwordMatches: false });
  assert.equal(outcome, "rejected");
});

check("active account with correct password is authenticated", () => {
  const outcome = decideLoginOutcome({ adminFound: true, isActive: true, passwordMatches: true });
  assert.equal(outcome, "authenticated");
});

check("all three rejection reasons produce the identical outcome value", () => {
  const unknownAccount = decideLoginOutcome({ adminFound: false, isActive: false, passwordMatches: false });
  const inactiveAccount = decideLoginOutcome({ adminFound: true, isActive: false, passwordMatches: true });
  const wrongPassword = decideLoginOutcome({ adminFound: true, isActive: true, passwordMatches: false });
  assert.equal(unknownAccount, inactiveAccount);
  assert.equal(inactiveAccount, wrongPassword);
});

console.log(`\n${passed} passed, 0 failed`);
