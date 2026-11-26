// Run: node --experimental-strip-types lib/ai/gemini.test.mts
import assert from "node:assert/strict";
import { generateWithFallback, getCandidateModels, isTransientError } from "./gemini.ts";

let passed = 0;
async function check(name: string, fn: () => Promise<void> | void) {
  await fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

console.warn = () => {};
delete process.env.GEMINI_MODEL;
const [first, second] = getCandidateModels();

/** Fake client: `script` returns the text for each call, or throws. */
function fake(script: (model: string, call: number) => string) {
  const calls: string[] = [];
  const ai = {
    models: {
      generateContent: async ({ model }: { model: string }) => {
        calls.push(model);
        return { text: script(model, calls.length) };
      },
    },
  } as any;
  return { ai, calls };
}
const run = (ai: any, attempts = 2) =>
  generateWithFallback(ai, { contents: ["p"], config: {} }, { attempts, delayMs: 0, label: "t" });

await check("GEMINI_MODEL goes first without duplicates", () => {
  process.env.GEMINI_MODEL = second;
  const models = getCandidateModels();
  assert.equal(models[0], second);
  assert.equal(new Set(models).size, models.length);
  delete process.env.GEMINI_MODEL;
});
await check("recognises transient errors", () => {
  assert.equal(isTransientError("503 Service Unavailable"), true);
  assert.equal(isTransientError("API key not valid"), false);
});
await check("returns the first text", async () => {
  const { ai, calls } = fake(() => "ok");
  assert.equal((await run(ai)).response?.text, "ok");
  assert.deepEqual(calls, [first]);
});
await check("retries the same model on a transient error", async () => {
  const { ai, calls } = fake((_m, call) => {
    if (call === 1) throw new Error("503");
    return "ok";
  });
  await run(ai);
  assert.deepEqual(calls, [first, first]);
});
await check("moves to the next model on another error", async () => {
  const { ai, calls } = fake((model) => {
    if (model === first) throw new Error("bad request");
    return "ok";
  });
  await run(ai);
  assert.deepEqual(calls, [first, second]);
});
await check("reports the last error when every model fails", async () => {
  const { ai, calls } = fake(() => {
    throw new Error("503");
  });
  const result = await run(ai, 1);
  assert.equal(result.response?.text, undefined);
  assert.match((result.lastError as Error).message, /503/);
  assert.equal(calls.length, getCandidateModels().length);
});

console.log(`\n${passed} passed, 0 failed`);
