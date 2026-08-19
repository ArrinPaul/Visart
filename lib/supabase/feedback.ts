import type { CustomerFeedback, SubmitFeedbackInput } from "@/types/feedback";
import { getSupabaseClient, isSupabaseLive } from "./client";
import { getProductById } from "./products";
import { analyzeFeedbackWithGemini } from "@/lib/ai/authenticity";

const LOCAL_FEEDBACK_KEY = "visart_customer_feedback";

// Rich initial seed reviews for demo crafts
const SEED_FEEDBACK: Record<string, CustomerFeedback[]> = {
  "demo-bamboo-basket": [
    {
      id: "fb-bamboo-1",
      productId: "demo-bamboo-basket",
      userName: "Aarav Sharma",
      userLocation: "Guwahati, Assam",
      isVerifiedBuyer: true,
      rating: 5,
      authenticityRating: "GENUINE_HANDCRAFTED",
      comment:
        "100% authentic native Assam bamboo! You can smell the natural treated river bamboo and see the microscopic variations in the weave. Far superior to the plastic molded copies sold in modern superstores.",
      craftChecks: {
        materialHonest: true,
        handmadeIrregularitiesPresent: true,
        finishQualityHigh: true,
        packagingSustainable: true,
      },
      flaggedAsFake: false,
      helpfulCount: 14,
      createdAt: "2026-08-10T14:32:00Z",
      geminiAnalysis: {
        riskScore: 2,
        counterfeitRiskAssessment: "High confidence in organic bamboo grain and traditional split-plait technique.",
        flaggedKeywords: [],
      },
    },
    {
      id: "fb-bamboo-2",
      productId: "demo-bamboo-basket",
      userName: "Meera Kulkarni",
      userLocation: "Pune, Maharashtra",
      isVerifiedBuyer: true,
      rating: 5,
      authenticityRating: "GENUINE_HANDCRAFTED",
      comment:
        "I was worried about fake extruded cane, but this has the exact weight, flexibility, and hand-wrapped rim of true rural Northeast craft. The artisan Pabitra Das did marvelous work.",
      craftChecks: {
        materialHonest: true,
        handmadeIrregularitiesPresent: true,
        finishQualityHigh: true,
        packagingSustainable: true,
      },
      flaggedAsFake: false,
      helpfulCount: 9,
      createdAt: "2026-08-14T09:15:00Z",
      geminiAnalysis: {
        riskScore: 3,
        counterfeitRiskAssessment: "Verified genuine artisan joinery and natural flexibility.",
        flaggedKeywords: [],
      },
    },
  ],
  "demo-bidriware-vase": [
    {
      id: "fb-bidri-1",
      productId: "demo-bidriware-vase",
      userName: "Dr. Vikram Seth",
      userLocation: "Hyderabad, Telangana",
      isVerifiedBuyer: true,
      rating: 5,
      authenticityRating: "GENUINE_HANDCRAFTED",
      comment:
        "The pure silver inlay is genuine 99.9% silver wire, not silver paint or electroplating. The Bidar soil oxidation gives it the authentic velvety matte black background.",
      craftChecks: {
        materialHonest: true,
        handmadeIrregularitiesPresent: true,
        finishQualityHigh: true,
        packagingSustainable: true,
      },
      flaggedAsFake: false,
      helpfulCount: 21,
      createdAt: "2026-08-05T18:20:00Z",
      geminiAnalysis: {
        riskScore: 1,
        counterfeitRiskAssessment: "Genuine pure silver wire inlay and zinc-copper oxidation verified.",
        flaggedKeywords: [],
      },
    },
  ],
  "demo-madhubani-painting": [
    {
      id: "fb-madhubani-1",
      productId: "demo-madhubani-painting",
      userName: "Sunita Roy",
      userLocation: "Kolkata, West Bengal",
      isVerifiedBuyer: true,
      rating: 5,
      authenticityRating: "GENUINE_HANDCRAFTED",
      comment:
        "Painted with bamboo twigs and natural mineral pigments on handmade cotton rag paper. No digital screen print dots under a magnifying glass. Pure Mithila heritage.",
      craftChecks: {
        materialHonest: true,
        handmadeIrregularitiesPresent: true,
        finishQualityHigh: true,
        packagingSustainable: true,
      },
      flaggedAsFake: false,
      helpfulCount: 16,
      createdAt: "2026-08-08T11:45:00Z",
      geminiAnalysis: {
        riskScore: 2,
        counterfeitRiskAssessment: "Natural twig nib strokes and handmade rag texture confirmed.",
        flaggedKeywords: [],
      },
    },
  ],
};

const memoryFeedbackStore = new Map<string, CustomerFeedback[]>();

// Initialize memory store
Object.entries(SEED_FEEDBACK).forEach(([pid, list]) => {
  memoryFeedbackStore.set(pid, list);
});

function getLocalStoredFeedback(): Record<string, CustomerFeedback[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load local feedback:", e);
    return {};
  }
}

function saveLocalStoredFeedback(allFeedback: Record<string, CustomerFeedback[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(allFeedback));
  } catch (e) {
    console.warn("Failed to save local feedback:", e);
  }
}

/**
 * Fetch all customer feedback for a product
 */
export async function getProductFeedback(productId: string): Promise<CustomerFeedback[]> {
  // 1. Check local / in-memory first
  const localMap = getLocalStoredFeedback();
  const localList = localMap[productId] || memoryFeedbackStore.get(productId) || [];

  // 2. Try Supabase if live
  if (isSupabaseLive) {
    try {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from("product_feedback")
          .select("*")
          .eq("product_id", productId)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: CustomerFeedback[] = data.map((d: any) => ({
            id: d.id,
            productId: d.product_id,
            userName: d.user_name,
            userLocation: d.user_location,
            isVerifiedBuyer: d.is_verified_buyer ?? true,
            rating: d.rating,
            authenticityRating: d.authenticity_rating,
            comment: d.comment,
            craftChecks: d.craft_checks || {
              materialHonest: true,
              handmadeIrregularitiesPresent: true,
              finishQualityHigh: true,
              packagingSustainable: true,
            },
            suspectedCounterfeitReason: d.suspected_counterfeit_reason,
            flaggedAsFake: d.flagged_as_fake ?? false,
            helpfulCount: d.helpful_count ?? 0,
            createdAt: d.created_at,
            geminiAnalysis: d.gemini_analysis,
          }));
          return mapped;
        }
      }
    } catch (e) {
      console.warn("Supabase feedback query fallback to memory:", e);
    }
  }

  return localList;
}

/**
 * Submit new customer review / authenticity report and run Gemini AI analysis
 */
export async function submitProductFeedback(
  input: SubmitFeedbackInput
): Promise<CustomerFeedback> {
  const product = await getProductById(input.productId);
  const isFakeVerdict =
    input.authenticityRating === "CONFIRMED_FAKE_REPLICA" ||
    input.authenticityRating === "SUSPICIOUS_QUALITY";

  let geminiAnalysis: CustomerFeedback["geminiAnalysis"] | undefined;

  if (product) {
    geminiAnalysis = await analyzeFeedbackWithGemini(input, product);
  }

  const newFeedback: CustomerFeedback = {
    id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: input.productId,
    userName: input.userName || "Verified Craft Collector",
    userLocation: input.userLocation || "India",
    isVerifiedBuyer: true,
    rating: input.rating,
    authenticityRating: input.authenticityRating,
    comment: input.comment,
    craftChecks: input.craftChecks,
    suspectedCounterfeitReason: input.suspectedCounterfeitReason,
    flaggedAsFake: isFakeVerdict || (geminiAnalysis?.riskScore ? geminiAnalysis.riskScore > 60 : false),
    helpfulCount: 0,
    createdAt: new Date().toISOString(),
    geminiAnalysis,
  };

  // Update in-memory
  const currentList = memoryFeedbackStore.get(input.productId) || [];
  const updatedList = [newFeedback, ...currentList];
  memoryFeedbackStore.set(input.productId, updatedList);

  // Update localStorage
  const localMap = getLocalStoredFeedback();
  localMap[input.productId] = updatedList;
  saveLocalStoredFeedback(localMap);

  // Sync with Supabase if live
  if (isSupabaseLive) {
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.from("product_feedback").insert({
          id: newFeedback.id,
          product_id: newFeedback.productId,
          user_name: newFeedback.userName,
          user_location: newFeedback.userLocation,
          is_verified_buyer: newFeedback.isVerifiedBuyer,
          rating: newFeedback.rating,
          authenticity_rating: newFeedback.authenticityRating,
          comment: newFeedback.comment,
          craft_checks: newFeedback.craftChecks,
          suspected_counterfeit_reason: newFeedback.suspectedCounterfeitReason,
          flagged_as_fake: newFeedback.flaggedAsFake,
          helpful_count: newFeedback.helpfulCount,
          gemini_analysis: newFeedback.geminiAnalysis,
        });
      }
    } catch (e) {
      console.warn("Supabase feedback insert error, persisted locally:", e);
    }
  }

  return newFeedback;
}
