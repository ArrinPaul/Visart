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
