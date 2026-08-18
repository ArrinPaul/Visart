import { z } from "zod";

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
