import { VisartGeneration } from "@/types/visart";
import { ProductFormData } from "@/types/frontend";
import { getMockGeneration } from "@/lib/ai/visart";

async function processImageForAI(file: File): Promise<{ imageBase64: string; mimeType: string }> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve({ imageBase64: "", mimeType: "" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = (e.target?.result as string) || "";
      const img = new Image();
      img.onload = () => {
        try {
          const MAX_DIM = 1200;
          let { width, height } = img;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL("image/jpeg", 0.85);
            const base64 = optimized.split(",")[1] || "";
            resolve({ imageBase64: base64, mimeType: "image/jpeg" });
            return;
          }
        } catch (canvasErr) {
          console.warn("[VISART] Canvas resize fallback:", canvasErr);
        }

        const base64 = dataUri.split(",")[1] || "";
        resolve({ imageBase64: base64, mimeType: file.type || "image/jpeg" });
      };

      img.onerror = () => {
        const base64 = dataUri.split(",")[1] || "";
        resolve({ imageBase64: base64, mimeType: file.type || "image/jpeg" });
      };

      img.src = dataUri;
    };

    reader.onerror = () => resolve({ imageBase64: "", mimeType: "" });
    reader.readAsDataURL(file);
  });
}

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

  // Real Mode — Process image base64 if available & POST to Member B's API
  let imageBase64: string | undefined;
  let mimeType: string | undefined;

  if (input.imageFile) {
    try {
      const processed = await processImageForAI(input.imageFile);
      if (processed.imageBase64) {
        imageBase64 = processed.imageBase64;
        mimeType = processed.mimeType;
        console.log(`[VISART DEBUG] Image prepared for multimodal AI analysis (${mimeType}, size: ${imageBase64.length} chars)`);
      }
    } catch (e) {
      console.warn("[VISART DEBUG] Failed to prepare image for AI, proceeding text-only:", e);
    }
  }

  console.log("[VISART DEBUG] calling /api/generate with sanitized input:", {
    productName: input.productName,
    material: input.material,
    location: input.location,
    productionCost: input.productionCost,
    timeRequired: input.timeRequired,
    hasImage: Boolean(imageBase64),
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
    imageBase64: imageBase64 || undefined,
    mimeType: mimeType || undefined,
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
