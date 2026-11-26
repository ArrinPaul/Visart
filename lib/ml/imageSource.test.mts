// Run: node --experimental-strip-types lib/ml/imageSource.test.mts
import assert from "node:assert/strict";
import { loadImage, ImageSourceError, MAX_IMAGE_BYTES } from "./imageSource.ts";

let passed = 0;
async function check(name: string, fn: () => Promise<void>) {
  await fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const BASE = "https://abc.supabase.co";
const GOOD = `${BASE}/storage/v1/object/public/product-images/products/1.jpg`;
const calls: Array<{ url: string; init: any }> = [];
const serve = (type: string, size = 4) =>
  (async (url: any, init: any) => {
    calls.push({ url: String(url), init });
    return new Response(new Uint8Array(size), { headers: { "content-type": type } });
  }) as typeof fetch;
const refused = (url: string, fetcher = serve("image/jpeg")) =>
  assert.rejects(loadImage(url, BASE, fetcher), ImageSourceError);

await check("reads a data URL", async () => {
  const img = await loadImage("data:image/png;base64,aGVsbG8=", BASE, serve("image/png"));
  assert.equal(img.mimeType, "image/png");
  assert.equal(img.bytes.length, 5);
});
await check("fetches from our storage and forbids redirects", async () => {
  calls.length = 0;
  assert.equal((await loadImage(GOOD, BASE, serve("image/jpeg"))).bytes.length, 4);
  assert.equal(calls[0].init.redirect, "error");
});
await check("refuses other hosts, schemes and paths without fetching", async () => {
  calls.length = 0;
  await refused("http://169.254.169.254/latest/meta-data/");
  await refused("https://abc.supabase.co.evil.example/storage/v1/object/public/x.jpg");
  await refused(GOOD.replace("https:", "http:"));
  await refused(`${BASE}/rest/v1/admin_users`);
  await refused(`${BASE}/storage/v1/object/public/../../../rest/v1/products`);
  await refused("not a url");
  assert.equal(calls.length, 0);
});
await check("refuses wrong types", async () => {
  await refused(GOOD, serve("text/html"));
  await refused("data:image/svg+xml;base64,aGVsbG8=");
});
await check("refuses images over the limit", async () => {
  await refused(GOOD, serve("image/jpeg", MAX_IMAGE_BYTES + 1));
  await refused(`data:image/jpeg;base64,${Buffer.alloc(MAX_IMAGE_BYTES + 1).toString("base64")}`);
});
await check("turns fetch failures into ImageSourceError", async () => {
  await refused(GOOD, (async () => {
    throw new TypeError("redirect");
  }) as typeof fetch);
});

console.log(`\n${passed} passed, 0 failed`);
