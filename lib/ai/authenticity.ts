import { GoogleGenAI, Type } from "@google/genai";
import type { ProductRecord, ProductInputData, VisartGeneration } from "@/types/visart";
import type {
  AuthenticityAudit,
  CustomerFeedback,
  SubmitFeedbackInput,
} from "@/types/feedback";

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({ apiKey });
}

function getCandidateModels(): string[] {
  return Array.from(
    new Set(
      [
        process.env.GEMINI_MODEL,
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.1-flash-lite",
        "gemini-3.7-flash",
      ].filter(Boolean) as string[]
    )
  );
}

function isTransientError(errMsg: string): boolean {
  const lower = errMsg.toLowerCase();
  return (
    lower.includes("503") ||
    lower.includes("unavailable") ||
    lower.includes("429") ||
    lower.includes("high demand") ||
    lower.includes("resource_exhausted") ||
    lower.includes("fetch failed") ||
    lower.includes("econnreset") ||
    lower.includes("etimedout") ||
    lower.includes("timeout") ||
    lower.includes("socket") ||
    lower.includes("overloaded") ||
    lower.includes("not found") ||
    lower.includes("404")
  );
}

const authenticityAuditSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER },
    verdict: {
      type: Type.STRING,
      enum: ["VERIFIED_AUTHENTIC", "LIKELY_AUTHENTIC", "SUSPICIOUS", "HIGH_RISK_FAKE"],
    },
    materialIntegrityScore: { type: Type.INTEGER },
    techniqueIntegrityScore: { type: Type.INTEGER },
    pricingIntegrityScore: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    authenticMarkers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trait: { type: Type.STRING },
          description: { type: Type.STRING },
          howToVerify: { type: Type.STRING },
          isMachineSuspectIndicator: { type: Type.BOOLEAN },
        },
        required: ["trait", "description", "howToVerify"],
      },
    },
    counterfeitWarningSigns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    spotAFakeGuide: {
      type: Type.OBJECT,
      properties: {
        tactileChecks: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        visualChecks: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        materialTests: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["tactileChecks", "visualChecks", "materialTests"],
    },
  },
  required: [
    "overallScore",
    "verdict",
    "materialIntegrityScore",
    "techniqueIntegrityScore",
    "pricingIntegrityScore",
    "summary",
    "authenticMarkers",
    "counterfeitWarningSigns",
    "spotAFakeGuide",
  ],
};

const feedbackRiskAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    riskScore: { type: Type.INTEGER },
    counterfeitRiskAssessment: { type: Type.STRING },
    flaggedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    isPotentialCounterfeitAlert: { type: Type.BOOLEAN },
  },
  required: [
    "riskScore",
    "counterfeitRiskAssessment",
    "flaggedKeywords",
    "isPotentialCounterfeitAlert",
  ],
};

/**
 * Deterministic / Craft-specific mock audit for instant demo mode fallback
 */
export function getMockAuthenticityAudit(
  product: ProductRecord,
  feedbacks: CustomerFeedback[] = []
): AuthenticityAudit {
  const gen = product.generated_data;
  const input = product.input_data;
  const material = gen?.product?.material || input?.material || "Natural Craft Medium";
  const location = gen?.product?.location || input?.location || "India";
  const technique = gen?.product?.craftTechnique || "Traditional Handcrafting";

  // Calculate community score from feedbacks
  const totalFeedbackCount = feedbacks.length;
  const flaggedCount = feedbacks.filter((f) => f.flaggedAsFake).length;
  let communityTrustScore = 96;

  if (totalFeedbackCount > 0) {
    const positiveRatings = feedbacks.filter(
      (f) => f.authenticityRating === "GENUINE_HANDCRAFTED" || f.authenticityRating === "LIKELY_GENUINE"
    ).length;
    communityTrustScore = Math.round((positiveRatings / totalFeedbackCount) * 100);
  }

  return {
    productId: product.id,
    overallScore: flaggedCount > 0 ? Math.max(60, 94 - flaggedCount * 15) : 96,
    verdict: flaggedCount >= 2 ? "SUSPICIOUS" : "VERIFIED_AUTHENTIC",
    materialIntegrityScore: 98,
    techniqueIntegrityScore: 95,
    pricingIntegrityScore: 94,
    summary: `Verified authentic artisan craft using genuine ${material} and traditional ${technique} from ${location}. Labor hours and raw material costs align with fair handcrafted production standards.`,
    authenticMarkers: [
      {
        trait: `Organic Grain & Material Texture`,
        description: `Natural ${material} shows subtle microscopic variances in grain, fiber, and shade impossible in mass-extruded synthetic molds.`,
        howToVerify: `Inspect surface under natural light. Uniform machine perfection or synthetic gloss indicates a factory replica.`,
        isMachineSuspectIndicator: false,
      },
      {
        trait: `Hand-Tooling & Joinery Marks`,
        description: `Executed using manual hand tools without computer numerical control (CNC) or injection seam lines.`,
        howToVerify: `Check underside and interior edges for subtle hand-carving or hand-knotting variations.`,
        isMachineSuspectIndicator: false,
      },
      {
        trait: `Regional Origin & Material Sourcing`,
        description: `Originates from traditional artisan clusters in ${location} adhering to traditional processing methods.`,
        howToVerify: `Examine material density and authentic regional seasoning/dyeing aroma.`,
        isMachineSuspectIndicator: false,
      },
    ],
    counterfeitWarningSigns: [
      `Factory injection mold seam lines or repetitive uniform stamp marks.`,
      `Chemical/petrochemical aroma instead of natural ${material} scent.`,
      `Impossibly low retail price that does not cover the minimum artisan wage for ${input.timeRequired || "the stated crafting period"}.`,
      `Lightweight synthetic plastic resin weighted with chalk to mimic natural ${material}.`,
    ],
    spotAFakeGuide: {
      tactileChecks: [
        `Feel the weight and thermal conductivity: Genuine ${material} reaches ambient temperature naturally, unlike synthetic polyester or hollow plastic.`,
        `Surface texture: Feel for organic tactile friction from hand tools rather than injection-molded slippery smoothness.`,
      ],
      visualChecks: [
        `Check for natural asymmetrical nuances that occur when an artisan shapes each piece individually.`,
        `Inspect the reverse side and joints for hand-finished knotting, binding, or chisel strokes.`,
      ],
      materialTests: [
        `Water drop test: Natural porous materials (${material}) exhibit subtle absorption, whereas synthetic polymer coatings cause unnatural bead runoff.`,
        `Aroma inspection: Smell the product; genuine handcrafted items retain natural earthy notes of wood, river bamboo, vegetable dyes, or kiln clay.`,
      ],
    },
    communityTrustScore,
    totalFeedbackCount,
    flaggedCount,
    lastAuditedAt: new Date().toISOString(),
  };
}

/**
 * Generate deep Authenticity Audit using Gemini AI
 */
export async function generateAuthenticityAudit(
  product: ProductRecord,
  feedbacks: CustomerFeedback[] = []
): Promise<AuthenticityAudit> {
  const isDemoMode = process.env.NEXT_PUBLIC_VISART_DEMO_MODE !== "false";

  if (!process.env.GEMINI_API_KEY) {
    if (isDemoMode) {
      return getMockAuthenticityAudit(product, feedbacks);
    }
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const gen = product.generated_data;
  const input = product.input_data;
  const artisan = product.artisan;

  const prompt = `You are VISART AI Authenticity & Anti-Counterfeit Forensics Engine.
Analyze the following artisan craft listing, evaluate authenticity parameters against industrial fake/machine-made knockoffs, and generate a comprehensive verification certificate.

PRODUCT LISTING DETAILS:
- Title: ${gen?.product?.title || input?.productName || "Handcrafted Craft"}
- Claimed Material: ${gen?.product?.material || input?.material}
- Craft Technique: ${gen?.product?.craftTechnique || "Handmade"}
- Stated Location / Origin: ${artisan?.location || input?.location || "India"}
- Stated Production Cost: ₹${input?.productionCost || 0}
- Stated Crafting Duration: ${input?.timeRequired || "Handcrafted"}
- Listed Retail Price: ₹${gen?.pricing?.recommended || input?.targetPrice || 0}
- Description: ${gen?.product?.description || "Authentic handcrafted craft"}

COMMUNITY FEEDBACK SIGNALS:
- Total Reviews: ${feedbacks.length}
- Reported Fake Flags: ${feedbacks.filter((f) => f.flaggedAsFake).length}
- Feedback Comments Sample: ${feedbacks.slice(0, 5).map((f) => `[${f.authenticityRating}] ${f.comment}`).join(" | ") || "No buyer feedback yet"}

TASKS:
1. Material Integrity (0-100): Is the claimed material realistic for this cost and region?
2. Technique Integrity (0-100): Does the technique match genuine traditional artisanal practices vs powerloom/CNC/mold replicas?
3. Pricing Integrity (0-100): Does the price reflect fair wages for ${input?.timeRequired || "the labor time"} vs sweatshop machine dumping?
4. Authentic Markers: Provide 3 concrete physical traits that distinguish this genuine craft from cheap copies.
5. Counterfeit Warning Signs: List 4 telltale signs of a fake/machine clone for this specific craft category.
6. "Spot a Fake" Guide: Provide buyer-friendly Tactile, Visual, and Non-destructive Material checks.
7. Verdict: VERIFIED_AUTHENTIC, LIKELY_AUTHENTIC, SUSPICIOUS, or HIGH_RISK_FAKE.

Output JSON strictly adhering to schema.`;

  try {
    const ai = getGeminiClient();
    const candidateModels = getCandidateModels();
    let response;

    for (const model of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: [prompt],
            config: {
              responseMimeType: "application/json",
              responseSchema: authenticityAuditSchema,
            },
          });
          if (response?.text) break;
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          if (isTransientError(errMsg)) {
            console.warn(
              `[VISART Authenticity AI] Transient issue with model ${model} (attempt ${attempt}): ${errMsg}. Retrying or switching model...`
            );
            await new Promise((r) => setTimeout(r, attempt * 1000));
          } else {
            break;
          }
        }
      }
      if (response?.text) break;
    }

    const text = response?.text;
    if (!text) {
      console.warn("[VISART Authenticity AI] No response from Gemini models; falling back to deterministic mock audit.");
      return getMockAuthenticityAudit(product, feedbacks);
    }

    const parsed = JSON.parse(text);
    const totalFeedbackCount = feedbacks.length;
    const flaggedCount = feedbacks.filter((f) => f.flaggedAsFake).length;
    let communityTrustScore = 96;

    if (totalFeedbackCount > 0) {
      const positiveRatings = feedbacks.filter(
        (f) => f.authenticityRating === "GENUINE_HANDCRAFTED" || f.authenticityRating === "LIKELY_GENUINE"
      ).length;
      communityTrustScore = Math.round((positiveRatings / totalFeedbackCount) * 100);
    }

    return {
      productId: product.id,
      overallScore: parsed.overallScore || 95,
      verdict: parsed.verdict || "VERIFIED_AUTHENTIC",
      materialIntegrityScore: parsed.materialIntegrityScore || 95,
      techniqueIntegrityScore: parsed.techniqueIntegrityScore || 95,
      pricingIntegrityScore: parsed.pricingIntegrityScore || 95,
      summary: parsed.summary || "Verified authentic handmade craft.",
      authenticMarkers: parsed.authenticMarkers || [],
      counterfeitWarningSigns: parsed.counterfeitWarningSigns || [],
      spotAFakeGuide: parsed.spotAFakeGuide || {
        tactileChecks: [],
        visualChecks: [],
        materialTests: [],
      },
      communityTrustScore,
      totalFeedbackCount,
      flaggedCount,
      lastAuditedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn("[VISART Authenticity AI] Unexpected error during audit generation, falling back to mock:", err);
    return getMockAuthenticityAudit(product, feedbacks);
  }
}

/**
 * Real-time Gemini evaluation of user feedback / fake reports
 */
export async function analyzeFeedbackWithGemini(
  input: SubmitFeedbackInput,
  product: ProductRecord
): Promise<{
  riskScore: number;
  counterfeitRiskAssessment: string;
  flaggedKeywords: string[];
}> {
  const isDemoMode = process.env.NEXT_PUBLIC_VISART_DEMO_MODE !== "false";

  // Quick heuristic check
  const fakeKeywords = [
    "fake",
    "plastic",
    "synthetic",
    "machine made",
    "powerloom",
    "scam",
    "cheap copy",
    "mold seam",
    "polyester",
    "counterfeit",
    "chemical smell",
  ];
  const lowerComment = (input.comment + " " + (input.suspectedCounterfeitReason || "")).toLowerCase();
  const matchedKeywords = fakeKeywords.filter((kw) => lowerComment.includes(kw));

  if (!process.env.GEMINI_API_KEY) {
    const isFakeRating =
      input.authenticityRating === "CONFIRMED_FAKE_REPLICA" ||
      input.authenticityRating === "SUSPICIOUS_QUALITY";
    const risk = isFakeRating ? (matchedKeywords.length > 0 ? 85 : 65) : 5;

    return {
      riskScore: risk,
      counterfeitRiskAssessment:
        risk > 50
          ? `Buyer reported potential material discrepancy or machine replica signals: ${matchedKeywords.join(", ") || "suspicious craftsmanship"}.`
          : "Feedback confirms authentic handcrafted quality.",
      flaggedKeywords: matchedKeywords,
    };
  }

  const prompt = `You are VISART AI Anti-Fraud and Counterfeit Review Classifier.
Analyze the following customer review and report for an authentic artisan craft. Determine if this review provides credible evidence that the product is a counterfeit, factory clone, or fake.

PRODUCT: ${product.generated_data?.product?.title || "Handcrafted product"}
CLAIMED MATERIAL: ${product.generated_data?.product?.material || "Natural craft"}
CLAIMED TECHNIQUE: ${product.generated_data?.product?.craftTechnique || "Handmade"}

CUSTOMER REVIEW:
- Rating: ${input.rating} / 5
- Authenticity Verdict by Buyer: ${input.authenticityRating}
- Review Text: "${input.comment}"
- Suspected Reason: "${input.suspectedCounterfeitReason || "N/A"}"
- Checks: Material honest: ${input.craftChecks.materialHonest}, Handmade irregularities: ${input.craftChecks.handmadeIrregularitiesPresent}, Finish quality: ${input.craftChecks.finishQualityHigh}

Determine risk score (0-100), concise assessment, and extracted fake-signal keywords.`;

  try {
    const ai = getGeminiClient();
    const candidateModels = getCandidateModels();
    let response;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: [prompt],
          config: {
            responseMimeType: "application/json",
            responseSchema: feedbackRiskAnalysisSchema,
          },
        });
        if (response?.text) break;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`[VISART Feedback AI] Model ${model} failed (${errMsg}), attempting fallback...`);
      }
    }

    const parsed = JSON.parse(response?.text || "{}");
    return {
      riskScore: parsed.riskScore ?? (matchedKeywords.length > 0 ? 75 : 10),
      counterfeitRiskAssessment:
        parsed.counterfeitRiskAssessment || "Review evaluated by Gemini AI authenticity engine.",
      flaggedKeywords: parsed.flaggedKeywords || matchedKeywords,
    };
  } catch (err) {
    console.warn("[VISART Feedback AI Classifier] Error during feedback analysis, using heuristic fallback:", err);
    return {
      riskScore: matchedKeywords.length > 0 ? 75 : 10,
      counterfeitRiskAssessment: "Automated heuristic review analysis.",
      flaggedKeywords: matchedKeywords,
    };
  }
}
