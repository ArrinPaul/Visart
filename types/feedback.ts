/**
 * VISART Authenticity & Customer Feedback Types
 */

export type AuthenticityVerdict =
  | "VERIFIED_AUTHENTIC"
  | "LIKELY_AUTHENTIC"
  | "SUSPICIOUS"
  | "HIGH_RISK_FAKE";

export type CraftAuthenticityMarker = {
  trait: string;
  description: string;
  howToVerify: string;
  isMachineSuspectIndicator?: boolean;
};

export type AuthenticityAudit = {
  productId: string;
  overallScore: number; // 0 - 100
  verdict: AuthenticityVerdict;
  materialIntegrityScore: number; // 0 - 100
  techniqueIntegrityScore: number; // 0 - 100
  pricingIntegrityScore: number; // 0 - 100
  summary: string;
  authenticMarkers: CraftAuthenticityMarker[];
  counterfeitWarningSigns: string[];
  spotAFakeGuide: {
    tactileChecks: string[];
    visualChecks: string[];
    materialTests: string[];
  };
  communityTrustScore: number; // 0 - 100 based on buyer feedback
  totalFeedbackCount: number;
  flaggedCount: number;
  lastAuditedAt: string;
};

export type FeedbackAuthenticityRating =
  | "GENUINE_HANDCRAFTED"
  | "LIKELY_GENUINE"
  | "SUSPICIOUS_QUALITY"
  | "CONFIRMED_FAKE_REPLICA";

export type CustomerFeedback = {
  id: string;
  productId: string;
  userName: string;
  userLocation?: string;
  // Always written as `true` by lib/supabase/feedback.ts#submitProductFeedback — there is no
  // order/purchase table anywhere in this schema to verify against. See docs/SECURITY.md finding
  // about "Verified Buyer".
  isVerifiedBuyer: boolean;
  rating: number; // 1 - 5
  authenticityRating: FeedbackAuthenticityRating;
  comment: string;
  craftChecks: {
    materialHonest: boolean;
    handmadeIrregularitiesPresent: boolean;
    finishQualityHigh: boolean;
    packagingSustainable: boolean;
  };
  suspectedCounterfeitReason?: string;
  flaggedAsFake: boolean;
  helpfulCount: number;
  createdAt: string;
  geminiAnalysis?: {
    riskScore: number; // 0 - 100
    counterfeitRiskAssessment: string;
    flaggedKeywords: string[];
  };
};

export type SubmitFeedbackInput = {
  productId: string;
  userName: string;
  userLocation?: string;
  rating: number;
  authenticityRating: FeedbackAuthenticityRating;
  comment: string;
  craftChecks: {
    materialHonest: boolean;
    handmadeIrregularitiesPresent: boolean;
    finishQualityHigh: boolean;
    packagingSustainable: boolean;
  };
  suspectedCounterfeitReason?: string;
};
