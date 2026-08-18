/**
 * VISART Canonical Types
 * Defined according to Master Engineering Plan & Rules
 */

export type ProductInputData = {
  productName?: string;
  material: string;
  productionCost: number | string;
  timeRequired: string;
  location: string;
  craftStory?: string;
  category?: string;
  targetPrice?: number | string;
};

export type ArtisanInputData = {
  name: string;
  location?: string;
  craft?: string;
  preferredLanguage?: string;
};

export type VisartGeneration = {
  product: {
    title: string;
    shortDescription: string;
    description: string;
    category: string;
    material: string;
    craftTechnique: string;
    keywords: string[];
    tags: string[];
    imageUrl?: string;
    location?: string;
  };

  pricing: {
    currency: "INR";
    min: number;
    recommended: number;
    max: number;
    rationale: string[];
    disclaimer: string;
  };

  marketing: {
    instagram: string;
    whatsapp: string;
    shortAd: string;
  };

  translations: {
    hindi: {
      title: string;
      description: string;
    };
    kannada: {
      title: string;
      description: string;
    };
  };

  story: {
    title: string;
    body: string;
  };

  readiness: {
    overall: number;
    photography: number;
    description: number;
    discoverability: number;
    pricingPresentation: number;
    marketing: number;
    topActions: string[];
  };
};

export type ProductRecord = {
  id: string;
  artisan_id?: string | null;
  image_url: string;
  input_data: ProductInputData;
  generated_data: VisartGeneration;
  is_published?: boolean;
  created_at: string;
  updated_at?: string;
  artisan?: {
    id: string;
    name: string;
    location?: string;
    craft?: string;
    preferred_language?: string;
  } | null;
};
