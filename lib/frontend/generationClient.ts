import { VisartGeneration } from "@/types/visart";
import { ProductFormData } from "@/types/frontend";
import { demoProduct } from "@/lib/demo/demoProduct";

export async function generateListing(input: ProductFormData): Promise<VisartGeneration> {
  const isDemoMode = process.env.NEXT_PUBLIC_VISART_DEMO_MODE !== "false";

  if (isDemoMode) {
    // Simulate realistic 2.5s network delay for processing state preview
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Customize demo fixture with provided form inputs if available
    return {
      ...demoProduct,
      product: {
        ...demoProduct.product,
        title: input.productName || demoProduct.product.title,
        material: input.material || demoProduct.product.material,
        location: input.location || demoProduct.product.location,
        imageUrl: input.imagePreviewUrl || demoProduct.product.imageUrl,
      },
      pricing: {
        ...demoProduct.pricing,
        min: input.productionCost ? Math.round(Number(input.productionCost.replace(/[^0-9]/g, '')) * 1.8) : demoProduct.pricing.min,
        recommended: input.productionCost ? Math.round(Number(input.productionCost.replace(/[^0-9]/g, '')) * 2.2) : demoProduct.pricing.recommended,
        max: input.productionCost ? Math.round(Number(input.productionCost.replace(/[^0-9]/g, '')) * 2.6) : demoProduct.pricing.max,
      }
    };
  }

  // Real Mode — POST to Member B's API
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to generate listing from AI. Please try again.");
  }

  const data: VisartGeneration = await response.json();
  return data;
}
