import { VisartGeneration } from "@/types/visart";
import { ProductFormData } from "@/types/frontend";
import { getMockGeneration } from "@/lib/ai/visart";

export async function generateListing(input: ProductFormData): Promise<VisartGeneration> {
  const isDemoMode = process.env.NEXT_PUBLIC_VISART_DEMO_MODE !== "false";
  const start = performance.now();

  console.log(`[VISART DEBUG] generationClient mode = ${isDemoMode ? "DEMO" : "REAL"}`);

  if (isDemoMode) {
    console.log("[VISART DEBUG] [Demo Mode] Generating dynamic simulated listing for:", {
      productName: input.productName,
      material: input.material,
      location: input.location,
      productionCost: input.productionCost,
      timeRequired: input.timeRequired,
    });

    // Simulate realistic 2.0s network delay for processing state preview
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const numericCost = Number(input.productionCost.replace(/[^0-9.]/g, "")) || 500;
    const dynamicMock = getMockGeneration({
      productName: input.productName || undefined,
      material: input.material,
      productionCost: numericCost,
      timeRequired: input.timeRequired,
      location: input.location,
      specialDetails: input.specialStory || undefined,
      imageUrl: input.imagePreviewUrl || undefined,
    });

    const end = performance.now();
    console.log(`[VISART DEBUG] [Demo Mode] Generation complete in ${(end - start).toFixed(2)}ms`);
    return dynamicMock;
  }

  // Real Mode — POST to Member B's API
  console.log("[VISART DEBUG] calling /api/generate with sanitized input:", {
    productName: input.productName,
    material: input.material,
    location: input.location,
    productionCost: input.productionCost,
    timeRequired: input.timeRequired,
  });

  const numericCost = Number(input.productionCost.replace(/[^0-9.]/g, "")) || 0;
  const payload = {
    productName: input.productName || undefined,
    material: input.material,
    productionCost: numericCost,
    timeRequired: input.timeRequired,
    location: input.location,
    specialDetails: input.specialStory || undefined,
    imageUrl: input.imagePreviewUrl || undefined,
  };

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const end = performance.now();

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || errorData.error || "Failed to generate listing from AI. Please try again.";
    console.error(`[VISART DEBUG] [Real Mode] Generation failed after ${(end - start).toFixed(2)}ms:`, message);
    throw new Error(message);
  }

  const data: VisartGeneration = await response.json();
  console.log(`[VISART DEBUG] [Real Mode] Generation complete in ${(end - start).toFixed(2)}ms. Title: "${data.product.title}"`);
  return data;
}
