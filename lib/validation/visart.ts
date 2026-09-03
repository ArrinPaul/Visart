import { z } from "zod";

// Two independent things share the name "VisartGeneration": this file's z.infer'd type (used to
// validate Gemini's raw JSON response and API request/response bodies) and a hand-written
// interface of the same name in types/visart.ts (used everywhere else in the app). They are not
// the same declaration and TypeScript will not warn you if they drift apart — this schema must
// also be kept in sync with the Gemini `responseSchema` object in lib/ai/visart.ts (same fields,
// same required-ness) or generation will throw a Zod validation error at runtime. Changing one of
// these three without the other two is the most common way to break the generation pipeline.
export const VisartInputSchema = z.object({
  productName: z.string().optional(),
  material: z.string().min(1, "Material is required"),
  productionCost: z.number().positive("Production cost must be positive"),
  timeRequired: z.string().min(1, "Time required is required"),
  location: z.string().min(1, "Location is required"),
  specialDetails: z.string().optional(),
  imageUrl: z.string().optional(),
  imageBase64: z.string().optional(),
  mimeType: z.string().optional(),
});

export type VisartInput = z.infer<typeof VisartInputSchema>;

export const VisartGenerationSchema = z.object({
  product: z.object({
    title: z.string(),
    shortDescription: z.string(),
    description: z.string(),
    category: z.string(),
    material: z.string(),
    craftTechnique: z.string(),
    keywords: z.array(z.string()),
    tags: z.array(z.string()),
    imageUrl: z.string().optional(),
    location: z.string().optional(),
  }),

  pricing: z.object({
    currency: z.literal("INR"),
    min: z.number(),
    recommended: z.number(),
    max: z.number(),
    rationale: z.array(z.string()),
    disclaimer: z.string(),
  }),

  marketing: z.object({
    instagram: z.string(),
    whatsapp: z.string(),
    shortAd: z.string(),
  }),

  translations: z.object({
    hindi: z.object({
      title: z.string(),
      description: z.string(),
    }),
    kannada: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),

  story: z.object({
    title: z.string(),
    body: z.string(),
  }),

  readiness: z.object({
    overall: z.number(),
    photography: z.number(),
    description: z.number(),
    discoverability: z.number(),
    pricingPresentation: z.number(),
    marketing: z.number(),
    topActions: z.array(z.string()),
  }),
});

export type VisartGeneration = z.infer<typeof VisartGenerationSchema>;
