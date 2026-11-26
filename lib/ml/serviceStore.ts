// Server-only. Real implementations of VerifyDeps. Uses its own service-role client, because
// lib/auth/supabaseServiceClient.ts is restricted to the admin tables.
import { createClient } from "@supabase/supabase-js";
import { loadImage } from "./imageSource.ts";
import type { VerifyDeps } from "./verifyListing.ts";

if (typeof window !== "undefined") {
  throw new Error("lib/ml/serviceStore must never be imported into client-side code.");
}

/** Returns null when verification is not configured, so the route can say so. */
export function createVerifyDeps(env: NodeJS.ProcessEnv = process.env): VerifyDeps | null {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const mlUrl = env.ML_SERVICE_URL;
  const mlSecret = env.ML_SERVICE_SECRET;
  if (!url?.startsWith("http") || !key || !mlUrl || !mlSecret) return null;

  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const fail = (what: string, error: { message: string } | null) => {
    if (error) throw new Error(`${what}: ${error.message}`);
  };

  return {
    async getProduct(id) {
      const { data, error } = await db.from("products").select("image_url, input_data").eq("id", id).maybeSingle();
      fail("read product", error);
      return data ? { imageUrl: data.image_url ?? "", material: String(data.input_data?.material ?? "") } : null;
    },
    async getCheckStatus(id) {
      const { data, error } = await db.from("listing_checks").select("status").eq("product_id", id).maybeSingle();
      fail("read check", error);
      return data?.status ?? null;
    },
    loadImage: (imageUrl) => loadImage(imageUrl, url),
    async analyze(image) {
      const form = new FormData();
      form.append("file", new Blob([new Uint8Array(image.bytes)], { type: image.mimeType }), "photo");
      const res = await fetch(new URL("/analyze", mlUrl), {
        method: "POST",
        headers: { "x-ml-secret": mlSecret },
        body: form,
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(`ML service returned ${res.status}`);
      return res.json();
    },
    async findDuplicate(id, embedding, minSimilarity) {
      const { data, error } = await db.rpc("match_image_embeddings", {
        query: JSON.stringify(embedding),
        exclude_product: id,
        min_similarity: minSimilarity,
      });
      fail("match embeddings", error);
      const match = data?.[0];
      return match ? { productId: match.product_id, similarity: match.similarity } : null;
    },
    async saveEmbedding(id, embedding, modelVersion) {
      const { error } = await db
        .from("image_embeddings")
        .upsert({ product_id: id, embedding: JSON.stringify(embedding), model_version: modelVersion });
      fail("save embedding", error);
    },
    async saveCheck(id, record) {
      const { error } = await db
        .from("listing_checks")
        .upsert({ product_id: id, ...record, updated_at: new Date().toISOString() });
      fail("save check", error);
    },
  };
}
