// Run: node --experimental-strip-types lib/auth/requireAdmin.test.mts
import assert from "node:assert/strict";
import { requireAdmin } from "./requireAdmin.ts";

let passed = 0;
async function check(name: string, fn: () => Promise<void>) {
  await fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const req = (method: string, cookie?: string, origin?: string) =>
  ({
    method,
    cookies: { get: () => (cookie ? { value: cookie } : undefined) },
    headers: new Headers(origin ? { origin } : {}),
  }) as any;
const valid = async (token: string | null | undefined) =>
  token === "good" ? { id: "1", email: "a@b.co" } : null;

process.env.APP_ORIGIN = "http://localhost:3000";

await check("no cookie is 401", async () => {
  assert.equal((await requireAdmin(req("GET"), valid))?.status, 401);
});
await check("invalid session is 401", async () => {
  assert.equal((await requireAdmin(req("GET", "bad"), valid))?.status, 401);
});
await check("valid session may read", async () => {
  assert.equal(await requireAdmin(req("GET", "good"), valid), null);
});
await check("write without or with wrong Origin is 403", async () => {
  assert.equal((await requireAdmin(req("PATCH", "good"), valid))?.status, 403);
  assert.equal((await requireAdmin(req("DELETE", "good", "https://evil.example"), valid))?.status, 403);
});
await check("write from the app origin is allowed", async () => {
  assert.equal(await requireAdmin(req("PATCH", "good", "http://localhost:3000"), valid), null);
});
await check("validator failure is 401", async () => {
  const boom = async () => { throw new Error("db down"); };
  assert.equal((await requireAdmin(req("GET", "good"), boom))?.status, 401);
});

console.log(`\n${passed} passed, 0 failed`);
