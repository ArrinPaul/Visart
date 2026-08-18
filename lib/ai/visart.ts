import { GoogleGenAI, Type } from "@google/genai";
import { VisartInput, VisartGeneration, VisartGenerationSchema } from "@/lib/validation/visart";

const visartResponseSchema = {
  type: Type.OBJECT,
  properties: {
    product: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        shortDescription: { type: Type.STRING },
        description: { type: Type.STRING },
        category: { type: Type.STRING },
        material: { type: Type.STRING },
        craftTechnique: { type: Type.STRING },
        keywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        tags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        imageUrl: { type: Type.STRING },
        location: { type: Type.STRING },
      },
      required: [
        "title",
        "shortDescription",
        "description",
        "category",
        "material",
        "craftTechnique",
        "keywords",
        "tags",
      ],
    },
    pricing: {
      type: Type.OBJECT,
      properties: {
        currency: { type: Type.STRING, enum: ["INR"] },
        min: { type: Type.NUMBER },
        recommended: { type: Type.NUMBER },
        max: { type: Type.NUMBER },
        rationale: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        disclaimer: { type: Type.STRING },
      },
      required: ["currency", "min", "recommended", "max", "rationale", "disclaimer"],
    },
    marketing: {
      type: Type.OBJECT,
      properties: {
        instagram: { type: Type.STRING },
        whatsapp: { type: Type.STRING },
        shortAd: { type: Type.STRING },
      },
      required: ["instagram", "whatsapp", "shortAd"],
    },
    translations: {
      type: Type.OBJECT,
      properties: {
        hindi: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "description"],
        },
        kannada: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "description"],
        },
      },
      required: ["hindi", "kannada"],
    },
    story: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        body: { type: Type.STRING },
      },
      required: ["title", "body"],
    },
    readiness: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.INTEGER },
        photography: { type: Type.INTEGER },
        description: { type: Type.INTEGER },
        discoverability: { type: Type.INTEGER },
        pricingPresentation: { type: Type.INTEGER },
        marketing: { type: Type.INTEGER },
        topActions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: [
        "overall",
        "photography",
        "description",
        "discoverability",
        "pricingPresentation",
        "marketing",
        "topActions",
      ],
    },
  },
  required: [
    "product",
    "pricing",
    "marketing",
    "translations",
    "story",
    "readiness",
  ],
};

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({ apiKey });
}

export function getMockGeneration(input: VisartInput): VisartGeneration {
  const productNameText = input.productName ? input.productName.trim() : `Handcrafted ${input.location} ${input.material} Craft`;
  const title = input.productName || `Handcrafted ${input.location} ${input.material} Craft`;
  const cost = input.productionCost;
  const recommendedPrice = Math.round(cost * 2.2);

  const specialText = input.specialDetails
    ? ` Notably, this piece features distinct artisan detailing: ${input.specialDetails}.`
    : ` From initial material preparation to final tactile inspection, each step is executed by hand without shortcut industrial processing.`;

  const storyTitle = input.productName
    ? `The Making of ${input.productName} in ${input.location}`
    : `Artisanal ${input.material} Craftsmanship from ${input.location}`;

  const storyBody = `Every ${productNameText} begins with carefully selected ${input.material}, sourced directly within ${input.location}. Over an intensive crafting period of ${input.timeRequired}, the artisan works methodically through each stage of preparation, shaping, and refined finishing. Transforming raw ${input.material} into a finished, durable piece demands dedicated manual effort and intimate familiarity with the medium's natural texture and grain.${specialText} The resulting item captures the genuine touch of authentic craft production, offering buyers a direct connection to everyday regional artisan work in ${input.location}. Designed for both everyday practical utility and enduring aesthetic presence, this ${productNameText} reflects honest materials shaped with focused care.`;

  return {
    product: {
      title,
      shortDescription: `Authentic ${input.material} craft hand-made in ${input.location} taking approximately ${input.timeRequired}.`,
      description: `Handcrafted from sustainable ${input.material} in ${input.location}. Made over ${input.timeRequired}, this item reflects traditional artisanal techniques. ${input.specialDetails ? `Special feature: ${input.specialDetails}` : ""}`,
      category: `${input.material} Handicrafts`,
      material: input.material,
      craftTechnique: `Hand-spun / Hand-shaped ${input.material} work`,
      keywords: [input.material.toLowerCase(), input.location.toLowerCase(), "handmade", "artisan craft", "sustainable decor"],
      tags: [input.location, input.material, "Handmade", "Authentic", "Sustainable"],
      imageUrl: input.imageUrl,
      location: input.location,
    },
    pricing: {
      currency: "INR",
      min: Math.round(cost * 1.8),
      recommended: recommendedPrice,
      max: Math.round(cost * 2.8),
      rationale: [
        `Base production cost of ₹${cost} covering raw ${input.material}`,
        `Fair wage compensation for ${input.timeRequired} of skilled manual labour`,
        `Market comparison for authentic regional artisanal items from ${input.location}`,
      ],
      disclaimer: "AI-assisted estimate based on information provided. Adjust according to direct buyer negotiation.",
    },
    marketing: {
      instagram: `✨ Discover authentic craftsmanship from ${input.location}! Our new ${title} is hand-made using pure ${input.material}. Made over ${input.timeRequired}. Tap the link to view the full product story! 🌿 #${input.location}Craft #${input.material}`,
      whatsapp: `Namaste! Folded with care in ${input.location}, here is our latest ${title}. Handcrafted with ${input.material} over ${input.timeRequired}. Recommended price: ₹${recommendedPrice}. Reply to place an order!`,
      shortAd: `Handcrafted ${input.material} product from ${input.location}. Authentic, sustainable, and made in ${input.timeRequired}. Order directly from the artisan today!`,
    },
    translations: {
      hindi: {
        title: `${input.location} हस्तनिर्मित ${input.material} क्राफ्ट`,
        description: `${input.location} में ${input.material} से तैयार किया गया प्रामाणिक हस्तशिल्प। इसे तैयार करने में ${input.timeRequired} का समय लगता है।`,
      },
      kannada: {
        title: `${input.location} ರ ಹಸ್ತಾಲಂಕೃತ ${input.material} ಕಲಾಕೃತಿ`,
        description: `${input.location} ನಲ್ಲಿ ${input.material} ಬಳಸಿ ತಯಾರಿಸಲಾದ ಸಾಂಪ್ರದಾಯಿಕ ಕೈಯಿಂದ ಮಾಡಿದ ಕಲಾಕೃತಿ.`,
      },
    },
    story: {
      title: storyTitle,
      body: storyBody,
    },
    readiness: {
      overall: 84,
      photography: input.imageUrl ? 85 : 55,
      description: 90,
      discoverability: 82,
      pricingPresentation: 88,
      marketing: 85,
      topActions: [
        "01 Upload a natural-light photograph highlighting texture details.",
        `02 Include a specific phrase about how ${input.material} was sourced in ${input.location}.`,
        "03 Share the WhatsApp direct catalog link with current repeat customers.",
      ],
    },
  };
}

export async function generateVisartListing(input: VisartInput): Promise<VisartGeneration> {
  const isDemoMode = process.env.NEXT_PUBLIC_VISART_DEMO_MODE !== "false";

  if (!process.env.GEMINI_API_KEY) {
    if (isDemoMode) {
      console.warn("[Gemini API] GEMINI_API_KEY is missing in DEMO mode. Returning input-specific dynamic mock generation.");
      return getMockGeneration(input);
    }
    throw new Error("GEMINI_API_KEY is not configured on the server. Please add your key to .env.local");
  }

  const prompt = `You are VISART AI, an editorial craft studio assistant helping traditional Indian artisans turn their craft into market-ready digital listings.
Analyze the following artisan product input and generate structured listing data:
- Product Name: ${input.productName || "N/A"}
- Material: ${input.material}
- Production Cost: ₹${input.productionCost}
- Time Required: ${input.timeRequired}
- Location: ${input.location}
- Special Details: ${input.specialDetails || "N/A"}

Rules & Guidelines:
1. Grounding: Rely ONLY on the provided facts (${input.productName || "Product"}, ${input.material}, ${input.location}, ${input.timeRequired}${input.specialDetails ? `, ${input.specialDetails}` : ""}). Do NOT invent false family lineages, generational traditions, awards, GI tags, certifications, or unverified claims.
2. Voice & Tone: Editorial, dignified, clear, and commercially engaging. Avoid marketing clichés like "timeless beauty", "unlock potential", "revolutionize", "patience and precision", or "passed down through generations".
3. Section Requirements:
   - "product": Complete product catalog metadata.
   - "pricing": Fair-trade pricing guidance in INR based on raw material cost and labor time. Currency must be "INR".
   - "marketing": Distinct copy tailored for Instagram, WhatsApp broadcasts, and short digital ads.
   - "translations": Natural, fluent Hindi and Kannada translations for title and description.
   - "story": A distinct evocative title and a polished artisan narrative of approximately 100–140 words grounded strictly on the input facts.
   - "readiness": Objective Digital Readiness scores (0-100) and top 3 actionable advice items.
4. Output JSON strictly matching the response schema.`;

  try {
    const ai = getGeminiClient();
    const contents: Array<string | { inlineData: { mimeType: string; data: string } }> = [prompt];

    if (input.imageBase64 && input.mimeType) {
      contents.push({
        inlineData: {
          mimeType: input.mimeType,
          data: input.imageBase64,
        },
      });
    }

    let response;
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const t0 = performance.now();
        if (process.env.NODE_ENV === "development") {
          console.log(`[VISART] Gemini request start (attempt ${attempt}/3): model=gemini-3.6-flash`);
        }

        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents,
          config: {
            responseMimeType: "application/json",
            responseSchema: visartResponseSchema,
          },
        });

        const t1 = performance.now();
        if (process.env.NODE_ENV === "development") {
          console.log(`[VISART] Gemini request completion: ${(t1 - t0).toFixed(2)}ms`);
        }
        break;
      } catch (err: unknown) {
        lastError = err;
        const errMsg = err instanceof Error ? err.message : String(err);
        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("429") ||
          errMsg.includes("high demand") ||
          errMsg.includes("RESOURCE_EXHAUSTED");

        if (attempt < 3 && isTransient) {
          const delayMs = attempt * 1500;
          console.warn(`[VISART] Gemini transient error on attempt ${attempt}, retrying in ${delayMs}ms...`);
          await new Promise((r) => setTimeout(r, delayMs));
        } else {
          throw err;
        }
      }
    }

    if (!response) {
      throw lastError instanceof Error ? lastError : new Error("Empty response received from Gemini API");
    }

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini API");
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[VISART] Gemini raw response text type:", typeof text);
      console.log("[VISART] Gemini raw response text length:", text.length);
    }

    const val0 = performance.now();
    const parsed = JSON.parse(text);

    if (process.env.NODE_ENV === "development") {
      console.log("[VISART] Parsed JSON top-level keys:", Object.keys(parsed));
      console.log("[VISART] parsed.product exists:", Boolean(parsed.product));
      console.log("[VISART] parsed.pricing exists:", Boolean(parsed.pricing));
      console.log("[VISART] parsed.marketing exists:", Boolean(parsed.marketing));
      console.log("[VISART] parsed.translations exists:", Boolean(parsed.translations));
      console.log("[VISART] parsed.story exists:", Boolean(parsed.story));
      console.log("[VISART] parsed.readiness exists:", Boolean(parsed.readiness));
    }

    const validated = VisartGenerationSchema.parse(parsed);
    const val1 = performance.now();
    if (process.env.NODE_ENV === "development") {
      console.log(`[VISART] Gemini response validation completion: ${(val1 - val0).toFixed(2)}ms`);
    }

    return {
      ...validated,
      product: {
        ...validated.product,
        imageUrl: input.imageUrl || validated.product.imageUrl,
        location: input.location || validated.product.location,
      },
    };
  } catch (err) {
    if (isDemoMode) {
      console.warn("[Gemini API] Generation failed in DEMO mode, returning fallback:", err);
      return getMockGeneration(input);
    }
    console.error("[Gemini API] Generation error in REAL mode:", err);
    throw err instanceof Error ? err : new Error("Failed to generate listing from Gemini AI");
  }
}
