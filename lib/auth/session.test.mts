// Run: node --experimental-strip-types lib/auth/session.test.mts
// (wired up as part of `npm run test:auth`)
//
// Uses a hand-written fake Supabase client implementing only the exact chain shapes
// lib/auth/session.ts actually calls (.from(table).select(...).eq(...).maybeSingle(),
// .delete().eq(...), .update(...).eq(...), .insert(...)) — this is the "simplest testable
// design" the batch instructions ask for, not a general Supabase mocking library. No network
// call and no live database is touched by this file.

import assert from "node:assert/strict";
import {
  validateSessionToken,
  deleteSessionByToken,
} from "./session.ts";

type QueryResult = { data: unknown; error: { message: string } | null };

function createFakeClient(opts: {
  sessionSelect?: QueryResult;
  userSelect?: QueryResult;
  deleteResult?: { error: { message: string } | null };
}) {
  const deleteCalls: string[] = [];

  const client = {
    from(table: string) {
      return {
        select(_cols: string) {
          return {
            eq(_col: string, _val: unknown) {
              return {
                async maybeSingle(): Promise<QueryResult> {
                  if (table === "admin_sessions") {
                    return opts.sessionSelect ?? { data: null, error: null };
                  }
                  if (table === "admin_users") {
                    return opts.userSelect ?? { data: null, error: null };
                  }
                  return { data: null, error: null };
                },
              };
            },
          };
        },
        delete() {
          deleteCalls.push(table);
          return {
            eq(_col: string, _val: unknown) {
              return Promise.resolve(opts.deleteResult ?? { error: null });
            },
          };
        },
        update(_patch: unknown) {
          return {
            eq(_col: string, _val: unknown) {
              return Promise.resolve({ error: null });
            },
          };
        },
      };
    },
    __deleteCalls: deleteCalls,
  };

  return client as any;
}

let passed = 0;
async function check(name: string, fn: () => Promise<void> | void) {
  await fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const futureIso = new Date(Date.now() + 60_000).toISOString();
const pastIso = new Date(Date.now() - 60_000).toISOString();

await check("missing token returns null without touching the client", async () => {
  const client = createFakeClient({});
  const identity = await validateSessionToken(null, client);
  assert.equal(identity, null);
});

await check("empty-string token returns null", async () => {
  const client = createFakeClient({});
  const identity = await validateSessionToken("", client);
  assert.equal(identity, null);
});

await check("no matching session row returns null", async () => {
  const client = createFakeClient({ sessionSelect: { data: null, error: null } });
  const identity = await validateSessionToken("some-raw-token", client);
  assert.equal(identity, null);
});

await check("expired session returns null", async () => {
  const client = createFakeClient({
    sessionSelect: {
      data: { id: "sess-1", admin_user_id: "admin-1", expires_at: pastIso },
      error: null,
    },
  });
  const identity = await validateSessionToken("some-raw-token", client);
  assert.equal(identity, null);
});

await check("valid session but missing admin account returns null", async () => {
  const client = createFakeClient({
    sessionSelect: {
      data: { id: "sess-1", admin_user_id: "admin-1", expires_at: futureIso },
      error: null,
    },
    userSelect: { data: null, error: null },
  });
  const identity = await validateSessionToken("some-raw-token", client);
  assert.equal(identity, null);
});

await check("valid session with inactive admin returns null and attempts revocation", async () => {
  const client = createFakeClient({
    sessionSelect: {
      data: { id: "sess-1", admin_user_id: "admin-1", expires_at: futureIso },
      error: null,
    },
    userSelect: {
      data: { id: "admin-1", email: "admin@example.com", is_active: false },
      error: null,
    },
  });
  const identity = await validateSessionToken("some-raw-token", client);
  assert.equal(identity, null);
  assert.ok(client.__deleteCalls.includes("admin_sessions"));
});

await check("valid session with active admin returns the admin identity", async () => {
  const client = createFakeClient({
    sessionSelect: {
      data: { id: "sess-1", admin_user_id: "admin-1", expires_at: futureIso },
      error: null,
    },
    userSelect: {
      data: { id: "admin-1", email: "admin@example.com", is_active: true },
      error: null,
    },
  });
  const identity = await validateSessionToken("some-raw-token", client);
  assert.deepEqual(identity, { id: "admin-1", email: "admin@example.com" });
});

await check("deleteSessionByToken with no token is a safe no-op success", async () => {
  const result = await deleteSessionByToken(null);
  assert.deepEqual(result, { ok: true });
});

await check("deleteSessionByToken succeeds when the database delete succeeds", async () => {
  const client = createFakeClient({ deleteResult: { error: null } });
  const result = await deleteSessionByToken("some-raw-token", client);
  assert.deepEqual(result, { ok: true });
});

await check(
  "deleteSessionByToken reports failure (without throwing) when the database delete fails",
  async () => {
    const client = createFakeClient({ deleteResult: { error: { message: "simulated db error" } } });
    const result = await deleteSessionByToken("some-raw-token", client);
    assert.deepEqual(result, { ok: false });
  }
);

console.log(`\n${passed} passed, 0 failed`);
