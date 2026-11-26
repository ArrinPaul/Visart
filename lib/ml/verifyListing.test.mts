// Run: node --experimental-strip-types lib/ml/verifyListing.test.mts
import assert from "node:assert/strict";
import { verifyListing, type VerifyDeps } from "./verifyListing.ts";

let passed = 0;
async function check(name: string, fn: () => Promise<void>) {
  await fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const analysis = {
  model_version: "v1",
  quality: { score: 75, tips: ["dark"] },
  classification: null,
  embedding: null,
};

function fake(over: Partial<VerifyDeps> = {}) {
  const saved = { checks: [] as any[], embeddings: [] as any[], analyzed: 0 };
  const deps: VerifyDeps = {
    getProduct: async () => ({ imageUrl: "data:x", material: "Teak wood" }),
    getCheckStatus: async () => null,
    loadImage: async () => ({ bytes: new Uint8Array(1), mimeType: "image/png" }),
    analyze: async () => {
      saved.analyzed += 1;
      return analysis;
    },
    findDuplicate: async () => null,
    saveEmbedding: async (...args) => void saved.embeddings.push(args),
    saveCheck: async (_id, record) => void saved.checks.push(record),
    ...over,
  };
  return { deps, saved };
}

await check("unknown product", async () => {
  const { deps, saved } = fake({ getProduct: async () => null });
  assert.deepEqual(await verifyListing("p1", deps), { status: "not_found" });
  assert.equal(saved.checks.length, 0);
});

await check("an existing result is not recomputed", async () => {
  const { deps, saved } = fake({ getCheckStatus: async () => "checked" });
  assert.deepEqual(await verifyListing("p1", deps), { status: "checked" });
  assert.equal(saved.analyzed, 0);
});

await check("service failure is recorded as failed", async () => {
  const { deps, saved } = fake({
    analyze: async () => {
      throw new Error("timeout");
    },
  });
  assert.deepEqual(await verifyListing("p1", deps), { status: "failed" });
  assert.deepEqual(saved.checks, [{ status: "failed" }]);
});

await check("a malformed service reply is recorded as failed", async () => {
  const { deps } = fake({ analyze: async () => ({ quality: "great" }) });
  assert.deepEqual(await verifyListing("p1", deps), { status: "failed" });
});

await check("without models, quality is saved and nothing is invented", async () => {
  const { deps, saved } = fake();
  assert.deepEqual(await verifyListing("p1", deps), { status: "checked" });
  assert.deepEqual(saved.checks[0], {
    status: "checked",
    model_version: "v1",
    quality: { score: 75, tips: ["dark"] },
    predicted_class: null,
    confidence: null,
    claim_result: "cannot_tell",
    duplicate_of: null,
    similarity: null,
  });
  assert.equal(saved.embeddings.length, 0);
});

await check("with models, claim and duplicate are recorded", async () => {
  const embedding = new Array(512).fill(0.1);
  const { deps, saved } = fake({
    analyze: async () => ({ ...analysis, classification: { label: "textile", confidence: 0.9 }, embedding }),
    findDuplicate: async () => ({ productId: "p0", similarity: 0.98 }),
  });
  await verifyListing("p1", deps);
  assert.equal(saved.checks[0].claim_result, "mismatch");
  assert.equal(saved.checks[0].duplicate_of, "p0");
  assert.equal(saved.checks[0].similarity, 0.98);
  assert.deepEqual(saved.embeddings, [["p1", embedding, "v1"]]);
});

console.log(`\n${passed} passed, 0 failed`);
