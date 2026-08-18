import { GoogleGenAI } from "@google/genai";
import { VisartInput, VisartGeneration, VisartGenerationSchema } from "@/lib/validation/visart";

const apiKey = process.env.GEMINI_API_KEY || "";
export const ai = new GoogleGenAI({ apiKey });

export function getMockGeneration(input: VisartInput): VisartGeneration {
  const title = input.productName || `Handcrafted ${input.location} ${input.material} Craft`;
  const cost = input.productionCost;
  const recommendedPrice = Math.round(cost * 2.2);

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
      title: `The Craftsmanship of ${input.location}`,
      body: `In the artisan workshops of ${input.location}, working with ${input.material} requires patience and precision. Made over ${input.timeRequired}, this piece represents local traditional techniques. ${input.specialDetails ? `Notes: ${input.specialDetails}` : ""}`,
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
  if (!process.env.GEMINI_API_KEY) {
    console.warn("[Gemini API] GEMINI_API_KEY is missing. Returning input-specific dynamic mock generation.");
    return getMockGeneration(input);
  }

  const prompt = `You are VISART AI, an assistant helping traditional artisans turn their craft into market-ready listings.
Analyze the following artisan product input and generate structured listing data:
- Product Name: ${input.productName || "N/A"}
- Material: ${input.material}
- Production Cost: ₹${input.productionCost}
- Time Required: ${input.timeRequired}
- Location: ${input.location}
- Special Details: ${input.specialDetails || "N/A"}

Rules:
1. Do NOT invent false family history, awards, GI tags, or unverified claims unless provided in inputs.
2. Avoid generic marketing jargon like "timeless beauty", "unlock potential", "revolutionize".
3. Provide concrete pricing guidance in INR based on production cost and labor time.
4. Provide Hindi and Kannada translations for title and description.
5. Provide a Digital Readiness score (0-100) and top 3 actionable advice items.
6. Output JSON matching requested schema strictly.`;

  try {
    const contents: Array<string | { inlineData: { mimeType: string; data: string } }> = [prompt];

    if (input.imageBase64 && input.mimeType) {
      contents.push({
        inlineData: {
          mimeType: input.mimeType,
          data: input.imageBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    const parsed = JSON.parse(text);
    const validated = VisartGenerationSchema.parse(parsed);
    return {
      ...validated,
      product: {
        ...validated.product,
        imageUrl: input.imageUrl || validated.product.imageUrl,
        location: input.location || validated.product.location,
      },
    };
  } catch (err) {
    console.error("[Gemini API] Generation failed or Zod validation error, returning input-specific mock fallback:", err);
    return getMockGeneration(input);
  }
}
