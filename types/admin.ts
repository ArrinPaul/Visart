import type { ProductRecord, VisartGeneration } from "./visart";
import type { CustomerFeedback, FeedbackAuthenticityRating } from "./feedback";

export type AdminView =
  | "dashboard"
  | "products"
  | "artisans"
  | "customers"
  | "reviews"
  | "analytics"
  | "performance"
  | "activity"
  | "settings";

export interface AdminDashboardStats {
  totalProducts: number;
  activePublishedProducts: number;
  totalArtisans: number;
  totalCustomers: number;
  totalReviews: number;
  verifiedAuthenticReviewsCount: number;
  flaggedReviewsCount: number;
  estimatedCatalogValueInr: number;
  averageReadinessScore: number;
  growthRates: {
    products: number;
    artisans: number;
    customers: number;
    reviews: number;
  };
}

export interface AdminProductSummary extends ProductRecord {
  readinessScore: number;
  authenticityStatus: "VERIFIED" | "PENDING" | "FLAGGED";
  totalInquiries: number;
  reviewCount: number;
  averageRating: number;
}

export interface ArtisanProfile {
  id: string;
  name: string;
  location: string;
  craft: string;
  preferredLanguage: string;
  productCount: number;
  joinedAt: string;
  status: "ACTIVE" | "VERIFIED" | "PENDING";
  phone?: string;
  readinessAverage: number;
}

export interface CustomerLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
  interestedCrafts: string[];
  totalInquiries: number;
  lastActive: string;
  isVerifiedBuyer: boolean;
  notes?: string;
}

export interface ReviewModerationItem extends CustomerFeedback {
  productTitle?: string;
  artisanName?: string;
  status: "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED";
}

export interface SystemHealthMetrics {
  status: "healthy" | "degraded" | "down";
  supabaseDb: {
    status: "healthy" | "degraded" | "down";
    latencyMs: number;
  };
  geminiAi: {
    status: "healthy" | "degraded" | "down";
    latencyMs: number;
    successRate: number;
  };
  audioEngine: {
    status: "healthy" | "degraded" | "down";
    latencyMs: number;
  };
  uptimeSeconds: number;
  timestamp: string;
}

export interface PerformanceMetrics {
  generationLatency: {
    avg: number;
    p95: number;
    count: number;
  };
  chatResponseLatency: {
    avg: number;
    p95: number;
    count: number;
  };
  conversionRate: number;
  cacheHitRate: number;
  popularCraftCategories: Array<{
    category: string;
    views: number;
    inquiries: number;
  }>;
}

export type ActivityActionType =
  | "CREATE_PRODUCT"
  | "UPDATE_PRODUCT"
  | "DELETE_PRODUCT"
  | "TOGGLE_PUBLISH"
  | "VERIFY_ARTISAN"
  | "APPROVE_REVIEW"
  | "FLAG_REVIEW"
  | "DELETE_REVIEW"
  | "UPDATE_SETTINGS"
  | "SYSTEM_SYNC";

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: ActivityActionType;
  actor: {
    name: string;
    role: "ADMIN" | "SYSTEM" | "ARTISAN" | "BUYER";
  };
  entityId: string;
  entityType: "product" | "artisan" | "review" | "settings" | "system";
  details: string;
}

export interface AdminSystemSettings {
  siteTitle: string;
  maintenanceMode: boolean;
  geminiModel: string;
  autoModerateReviews: boolean;
  counterfeitThresholdRisk: number; // 0 - 100
  enableAudioTTS: boolean;
  defaultPricingMultiplier: number;
  supportedLanguages: string[];
  lastUpdated: string;
}
