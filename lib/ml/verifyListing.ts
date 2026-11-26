// The verification steps for one listing. Storage and the ML service are passed in so this can be
// tested without either.
import { z } from "zod";
import { checkClaim } from "./claim.ts";
import type { LoadedImage } from "./imageSource.ts";

// Starting value; choose the real threshold from measurements once embeddings exist.
export const DUPLICATE_SIMILARITY = 0.95;

const AnalysisSchema = z.object({
  model_version: z.string().min(1),
  quality: z.object({ score: z.number().min(0).max(100), tips: z.array(z.string()) }),
  classification: z
    .object({
      label: z.enum(["pottery", "wood", "textile", "metal", "bamboo", "uncertain"]),
      confidence: z.number().min(0).max(1),
    })
    .nullable(),
  embedding: z.array(z.number()).length(512).nullable(),
});

export type CheckRecord = Record<string, unknown> & { status: "checked" | "failed" };

export type VerifyDeps = {
  getProduct(id: string): Promise<{ imageUrl: string; material: string } | null>;
  getCheckStatus(id: string): Promise<"pending" | "checked" | "failed" | null>;
  loadImage(url: string): Promise<LoadedImage>;
  analyze(image: LoadedImage): Promise<unknown>;
  findDuplicate(id: string, embedding: number[], minSimilarity: number): Promise<{ productId: string; similarity: number } | null>;
  saveEmbedding(id: string, embedding: number[], modelVersion: string): Promise<void>;
  saveCheck(id: string, record: CheckRecord): Promise<void>;
};

export async function verifyListing(
  productId: string,
  deps: VerifyDeps
): Promise<{ status: "pending" | "checked" | "failed" | "not_found" }> {
  const product = await deps.getProduct(productId);
  if (!product) return { status: "not_found" };

  // The public route never recomputes: that would let anyone spend server time repeatedly.
  const existing = await deps.getCheckStatus(productId);
  if (existing) return { status: existing };

  try {
    const analysis = AnalysisSchema.parse(await deps.analyze(await deps.loadImage(product.imageUrl)));

    let duplicate: { productId: string; similarity: number } | null = null;
    if (analysis.embedding) {
      duplicate = await deps.findDuplicate(productId, analysis.embedding, DUPLICATE_SIMILARITY);
      await deps.saveEmbedding(productId, analysis.embedding, analysis.model_version);
    }

    await deps.saveCheck(productId, {
      status: "checked",
      model_version: analysis.model_version,
      quality: analysis.quality,
      predicted_class: analysis.classification?.label ?? null,
      confidence: analysis.classification?.confidence ?? null,
      claim_result: checkClaim(product.material, analysis.classification?.label ?? null),
      duplicate_of: duplicate?.productId ?? null,
      similarity: duplicate?.similarity ?? null,
    });
    return { status: "checked" };
  } catch (err) {
    console.error("[VISART ML] verification failed:", err instanceof Error ? err.message : String(err));
    await deps.saveCheck(productId, { status: "failed" });
    return { status: "failed" };
  }
}
