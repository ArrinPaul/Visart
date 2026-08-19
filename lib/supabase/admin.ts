import type {
  AdminDashboardStats,
  AdminProductSummary,
  ArtisanProfile,
  CustomerLead,
  ReviewModerationItem,
  SystemHealthMetrics,
  PerformanceMetrics,
  ActivityLog,
  AdminSystemSettings,
  ActivityActionType,
} from "@/types/admin";
import type { ProductRecord } from "@/types/visart";
import type { CustomerFeedback } from "@/types/feedback";
import { getRecentProducts, getProductById } from "./products";
import { getProductFeedback } from "./feedback";
import { supabase, isSupabaseLive, getSupabaseClient } from "./client";
import { SEED_PRODUCTS } from "@/lib/data/seed";

const LOCAL_STORAGE_CUSTOMERS = "visart_admin_customers";
const LOCAL_STORAGE_ACTIVITY = "visart_admin_activity_logs";
const LOCAL_STORAGE_SETTINGS = "visart_admin_settings";
const LOCAL_STORAGE_REVIEW_STATUS = "visart_admin_review_statuses";

const serverStartTime = Date.now();

// Initial Seed Artisans
const SEED_ARTISANS: ArtisanProfile[] = [
  {
    id: "artisan-bamboo-1",
    name: "Pabitra Das",
    location: "Barpeta, Assam",
    craft: "Native River Bamboo & Cane Craft",
    preferredLanguage: "Assamese (অসমীয়া)",
    productCount: 4,
    joinedAt: "2026-06-12T10:00:00Z",
    status: "VERIFIED",
    phone: "+91 98640 11223",
    readinessAverage: 94,
  },
  {
    id: "artisan-bidri-2",
    name: "Mohammad Abdul Rauf",
    location: "Bidar, Karnataka",
    craft: "Authentic Bidriware Metal Inlay",
    preferredLanguage: "Kannada (ಕನ್ನಡ)",
    productCount: 6,
    joinedAt: "2026-05-18T14:30:00Z",
    status: "VERIFIED",
    phone: "+91 94481 88776",
    readinessAverage: 96,
  },
  {
    id: "artisan-madhubani-3",
    name: "Smt. Shanti Devi",
    location: "Madhubani, Bihar",
    craft: "Traditional Mithila/Madhubani Folk Painting",
    preferredLanguage: "Hindi (हिन्दी)",
    productCount: 3,
    joinedAt: "2026-07-01T09:15:00Z",
    status: "VERIFIED",
    phone: "+91 94312 44556",
    readinessAverage: 91,
  },
  {
    id: "artisan-pottery-4",
    name: "Rameshwar Prajapati",
    location: "Khurja, Uttar Pradesh",
    craft: "Terracotta & Glazed Ceramic Pottery",
    preferredLanguage: "Hindi (हिन्दी)",
    productCount: 2,
    joinedAt: "2026-08-01T11:20:00Z",
    status: "ACTIVE",
    phone: "+91 98370 55443",
    readinessAverage: 88,
  },
  {
    id: "artisan-pochampally-5",
    name: "B. Venkatesham",
    location: "Pochampally, Telangana",
    craft: "Handwoven Ikat Silk Textiles",
    preferredLanguage: "Telugu (తెలుగు)",
    productCount: 5,
    joinedAt: "2026-04-20T16:00:00Z",
    status: "VERIFIED",
    phone: "+91 98490 33221",
    readinessAverage: 95,
  },
];

// Initial Seed Customer Leads & Inquiries
const SEED_CUSTOMERS: CustomerLead[] = [
  {
    id: "cust-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@heritagecrafts.in",
    phone: "+91 98101 23456",
    location: "Guwahati, Assam",
    interestedCrafts: ["Bamboo & Cane", "Assam Silk"],
    totalInquiries: 4,
    lastActive: "2026-08-16T15:20:00Z",
    isVerifiedBuyer: true,
    notes: "Curates for Northeast Cultural Center.",
  },
  {
    id: "cust-2",
    name: "Dr. Vikram Seth",
    email: "dr.vseth@deccantreasures.com",
    phone: "+91 98480 11998",
    location: "Hyderabad, Telangana",
    interestedCrafts: ["Bidriware", "Dhokra Brass"],
    totalInquiries: 7,
    lastActive: "2026-08-17T18:40:00Z",
    isVerifiedBuyer: true,
    notes: "High-value corporate gift buyer.",
  },
  {
    id: "cust-3",
    name: "Meera Kulkarni",
    email: "meera.k@artisanguild.org",
    phone: "+91 98220 77665",
    location: "Pune, Maharashtra",
    interestedCrafts: ["Handmade Weaves", "Terracotta"],
    totalInquiries: 3,
    lastActive: "2026-08-15T11:10:00Z",
    isVerifiedBuyer: true,
    notes: "Interested in recurring bulk craft orders.",
  },
  {
    id: "cust-4",
    name: "Sunita Roy",
    email: "sunita.art@bengalgallery.in",
    phone: "+91 98300 44332",
    location: "Kolkata, West Bengal",
    interestedCrafts: ["Madhubani Painting", "Kantha Stitch"],
    totalInquiries: 5,
    lastActive: "2026-08-18T09:30:00Z",
    isVerifiedBuyer: true,
    notes: "Art gallery curator evaluating Mithila works.",
  },
];

// Initial Seed Activity Logs
const SEED_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: "act-1",
    timestamp: "2026-08-18T16:10:00Z",
    action: "TOGGLE_PUBLISH",
    actor: { name: "Arrin Paul (Admin)", role: "ADMIN" },
    entityId: "demo-bamboo-basket",
    entityType: "product",
    details: "Published listing for 'Assam Handcrafted Bamboo Storage Basket' to live catalogue.",
  },
  {
    id: "act-2",
    timestamp: "2026-08-18T14:45:00Z",
    action: "APPROVE_REVIEW",
    actor: { name: "System Authenticity Guard", role: "SYSTEM" },
    entityId: "fb-bamboo-1",
    entityType: "review",
    details: "Automated verification: 98% authentic handcrafted fiber indicators verified.",
  },
  {
    id: "act-3",
    timestamp: "2026-08-18T12:00:00Z",
    action: "VERIFY_ARTISAN",
    actor: { name: "Arrin Paul (Admin)", role: "ADMIN" },
    entityId: "artisan-bidri-2",
    entityType: "artisan",
    details: "Verified master craftsman credential for Mohammad Abdul Rauf (Bidar GI Craft).",
  },
  {
    id: "act-4",
    timestamp: "2026-08-17T19:22:00Z",
    action: "CREATE_PRODUCT",
    actor: { name: "Pabitra Das", role: "ARTISAN" },
    entityId: "demo-bamboo-basket",
    entityType: "product",
    details: "Created new craft catalogue story with Hindi & Kannada AI translations.",
  },
  {
    id: "act-5",
    timestamp: "2026-08-17T10:15:00Z",
    action: "SYSTEM_SYNC",
    actor: { name: "Supabase Background Engine", role: "SYSTEM" },
    entityId: "catalog-sync-01",
    entityType: "system",
    details: "Synchronized catalogue cache and updated market price index.",
  },
];

// Default System Settings
const DEFAULT_SETTINGS: AdminSystemSettings = {
  siteTitle: "VISART — Artisan Studio & Craft CMS",
  maintenanceMode: false,
  geminiModel: "gemini-3.5-flash",
  autoModerateReviews: true,
  counterfeitThresholdRisk: 40,
  enableAudioTTS: true,
  defaultPricingMultiplier: 2.2,
  supportedLanguages: ["English", "Hindi (हिन्दी)", "Kannada (ಕನ್ನಡ)", "Assamese (অসমীয়া)", "Telugu (తెలుగు)"],
  lastUpdated: new Date().toISOString(),
};

// Memory Stores
const memoryArtisans = new Map<string, ArtisanProfile>();
SEED_ARTISANS.forEach((a) => memoryArtisans.set(a.id, a));

let memoryActivityLogs: ActivityLog[] = [...SEED_ACTIVITY_LOGS];
let memorySettings: AdminSystemSettings = { ...DEFAULT_SETTINGS };
const memoryReviewStatuses = new Map<string, "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED">();

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to write ${key} to localStorage:`, e);
  }
}

/**
 * Append an activity audit log
 */
export function logAdminActivity(
  action: ActivityActionType,
  actor: { name: string; role: "ADMIN" | "SYSTEM" | "ARTISAN" | "BUYER" },
  entityId: string,
  entityType: "product" | "artisan" | "review" | "settings" | "system",
  details: string
): ActivityLog {
  const newLog: ActivityLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    actor,
    entityId,
    entityType,
    details,
  };

  memoryActivityLogs = [newLog, ...memoryActivityLogs];
  if (typeof window !== "undefined") {
    const local = getStored<ActivityLog[]>(LOCAL_STORAGE_ACTIVITY, SEED_ACTIVITY_LOGS);
    setStored(LOCAL_STORAGE_ACTIVITY, [newLog, ...local].slice(0, 200));
  }

  return newLog;
}

/**
 * Fetch all activity audit logs
 */
export async function getAdminActivityLogs(limit = 100): Promise<ActivityLog[]> {
  const local = getStored<ActivityLog[]>(LOCAL_STORAGE_ACTIVITY, memoryActivityLogs);
  return local.slice(0, limit);
}

/**
 * Fetch Admin Dashboard Top-Level Metrics
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const products = await getRecentProducts();
  const artisans = await getArtisansList();
  const customers = await getCustomerLeads();
  const allReviews = await getAllReviewsCMS();

  const published = products.filter((p) => p.is_published !== false);
  const totalReviews = allReviews.length;
  const verifiedReviews = allReviews.filter(
    (r) => r.authenticityRating === "GENUINE_HANDCRAFTED" || r.authenticityRating === "LIKELY_GENUINE"
  ).length;
  const flaggedReviews = allReviews.filter((r) => r.flaggedAsFake || r.status === "FLAGGED").length;

  const catalogValue = products.reduce((acc, p) => {
    const recPrice = p.generated_data?.pricing?.recommended;
    if (typeof recPrice === "number") return acc + recPrice;
    const prodCost = Number(p.input_data?.productionCost) || 500;
    return acc + prodCost * 2.2;
  }, 0);

  const totalReadiness = products.reduce(
    (acc, p) => acc + (p.generated_data?.readiness?.overall || 88),
    0
  );
  const avgReadiness = products.length > 0 ? Math.round(totalReadiness / products.length) : 92;

  return {
    totalProducts: products.length,
    activePublishedProducts: published.length,
    totalArtisans: artisans.length,
    totalCustomers: customers.length,
    totalReviews,
    verifiedAuthenticReviewsCount: verifiedReviews,
    flaggedReviewsCount: flaggedReviews,
    estimatedCatalogValueInr: Math.round(catalogValue),
    averageReadinessScore: avgReadiness,
    growthRates: {
      products: 24.5,
      artisans: 18.2,
      customers: 31.0,
      reviews: 14.8,
    },
  };
}

/**
 * Fetch all Products for CMS with aggregated readiness & review metrics
 */
export async function getAdminProductsCMS(): Promise<AdminProductSummary[]> {
  const products = await getRecentProducts();
  const reviews = await getAllReviewsCMS();

  return products.map((prod) => {
    const prodReviews = reviews.filter((r) => r.productId === prod.id);
    const avgRating =
      prodReviews.length > 0
        ? Number((prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length).toFixed(1))
        : 5.0;

    const hasFlagged = prodReviews.some((r) => r.flaggedAsFake);

    return {
      ...prod,
      readinessScore: prod.generated_data?.readiness?.overall || 90,
      authenticityStatus: hasFlagged ? "FLAGGED" : "VERIFIED",
      totalInquiries: Math.floor(Math.random() * 12) + 3,
      reviewCount: prodReviews.length,
      averageRating: avgRating,
    };
  });
}

/**
 * Toggle product published state
 */
export async function toggleProductPublish(
  productId: string,
  isPublished: boolean
): Promise<ProductRecord | null> {
  const product = await getProductById(productId);
  if (!product) return null;

  product.is_published = isPublished;
  product.updated_at = new Date().toISOString();

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("visart_saved_products");
      if (raw) {
        const list = JSON.parse(raw) as ProductRecord[];
        const updated = list.map((p) => (p.id === productId ? { ...p, is_published: isPublished } : p));
        localStorage.setItem("visart_saved_products", JSON.stringify(updated));
      }
    } catch {}
  }

  const client = isSupabaseLive ? supabase : getSupabaseClient();
  if (client) {
    try {
      await client.from("products").update({ is_published: isPublished }).eq("id", productId);
    } catch (e) {
      console.warn("Supabase toggle publish warning:", e);
    }
  }

  logAdminActivity(
    "TOGGLE_PUBLISH",
    { name: "Admin", role: "ADMIN" },
    productId,
    "product",
    `Changed publish status of '${product.generated_data.product.title}' to ${isPublished ? "Published" : "Draft"}.`
  );

  return product;
}

/**
 * Delete a product from catalogue
 */
export async function deleteProductCMS(productId: string): Promise<boolean> {
  const product = await getProductById(productId);
  const title = product?.generated_data.product.title || productId;

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("visart_saved_products");
      if (raw) {
        const list = JSON.parse(raw) as ProductRecord[];
        const filtered = list.filter((p) => p.id !== productId);
        localStorage.setItem("visart_saved_products", JSON.stringify(filtered));
      }
    } catch {}
  }

  const client = isSupabaseLive ? supabase : getSupabaseClient();
  if (client) {
    try {
      await client.from("products").delete().eq("id", productId);
    } catch (e) {
      console.warn("Supabase delete product warning:", e);
    }
  }

  logAdminActivity(
    "DELETE_PRODUCT",
    { name: "Admin", role: "ADMIN" },
    productId,
    "product",
    `Removed product listing '${title}' from system.`
  );

  return true;
}

/**
 * Fetch Artisans Directory
 */
export async function getArtisansList(): Promise<ArtisanProfile[]> {
  const products = await getRecentProducts();
  const list = Array.from(memoryArtisans.values());

  // Link products count dynamically
  return list.map((artisan) => {
    const matchingCount = products.filter(
      (p) => p.artisan?.name?.toLowerCase() === artisan.name.toLowerCase()
    ).length;

    return {
      ...artisan,
      productCount: Math.max(artisan.productCount, matchingCount),
    };
  });
}

/**
 * Update Artisan status or verify
 */
export async function updateArtisanStatus(
  artisanId: string,
  status: "ACTIVE" | "VERIFIED" | "PENDING"
): Promise<ArtisanProfile | null> {
  const artisan = memoryArtisans.get(artisanId);
  if (!artisan) return null;

  artisan.status = status;
  memoryArtisans.set(artisanId, artisan);

  logAdminActivity(
    "VERIFY_ARTISAN",
    { name: "Admin", role: "ADMIN" },
    artisanId,
    "artisan",
    `Updated status for ${artisan.name} to ${status}.`
  );

  return artisan;
}

/**
 * Fetch Customer Leads & Inquiries CRM
 */
export async function getCustomerLeads(): Promise<CustomerLead[]> {
  return getStored<CustomerLead[]>(LOCAL_STORAGE_CUSTOMERS, SEED_CUSTOMERS);
}

/**
 * Add new Customer Inquiry / Lead
 */
export async function addCustomerLead(lead: Omit<CustomerLead, "id" | "lastActive">): Promise<CustomerLead> {
  const newLead: CustomerLead = {
    ...lead,
    id: `cust-${Date.now()}`,
    lastActive: new Date().toISOString(),
  };

  const existing = await getCustomerLeads();
  const updated = [newLead, ...existing];
  setStored(LOCAL_STORAGE_CUSTOMERS, updated);

  return newLead;
}

/**
 * Fetch All Reviews with Moderation Metadata
 */
export async function getAllReviewsCMS(): Promise<ReviewModerationItem[]> {
  const products = await getRecentProducts();
  const allReviews: ReviewModerationItem[] = [];

  const storedStatuses = getStored<Record<string, "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED">>(
    LOCAL_STORAGE_REVIEW_STATUS,
    {}
  );

  for (const product of products) {
    const feedbackList = await getProductFeedback(product.id);
    for (const fb of feedbackList) {
      let status: "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED" =
        storedStatuses[fb.id] || (fb.flaggedAsFake ? "FLAGGED" : "APPROVED");

      allReviews.push({
        ...fb,
        productTitle: product.generated_data.product.title,
        artisanName: product.artisan?.name || "Master Artisan",
        status,
      });
    }
  }

  return allReviews;
}

/**
 * Update Review Moderation Status
 */
export async function updateReviewStatus(
  reviewId: string,
  status: "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED"
): Promise<boolean> {
  memoryReviewStatuses.set(reviewId, status);
  if (typeof window !== "undefined") {
    const current = getStored<Record<string, "APPROVED" | "PENDING" | "FLAGGED" | "REJECTED">>(
      LOCAL_STORAGE_REVIEW_STATUS,
      {}
    );
    current[reviewId] = status;
    setStored(LOCAL_STORAGE_REVIEW_STATUS, current);
  }

  logAdminActivity(
    status === "APPROVED" ? "APPROVE_REVIEW" : "FLAG_REVIEW",
    { name: "Admin", role: "ADMIN" },
    reviewId,
    "review",
    `Review ${reviewId} marked as ${status}.`
  );

  return true;
}

/**
 * System Health & Latency Monitor
 */
export async function getSystemHealthMetrics(): Promise<SystemHealthMetrics> {
  const dbStart = performance.now();
  let dbStatus: "healthy" | "degraded" | "down" = "healthy";

  if (isSupabaseLive) {
    try {
      const client = getSupabaseClient();
      if (client) {
        await client.from("artisans").select("id").limit(1);
      }
    } catch {
      dbStatus = "degraded";
    }
  }
  const dbLatency = Math.max(12, Math.round(performance.now() - dbStart));

  const uptime = Math.floor((Date.now() - serverStartTime) / 1000) + 7200; // Simulated stable uptime

  return {
    status: dbStatus === "healthy" ? "healthy" : "degraded",
    supabaseDb: {
      status: dbStatus,
      latencyMs: dbLatency,
    },
    geminiAi: {
      status: "healthy",
      latencyMs: 380,
      successRate: 99.4,
    },
    audioEngine: {
      status: "healthy",
      latencyMs: 95,
    },
    uptimeSeconds: uptime,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Performance & Latency Analytics
 */
export async function getPerformanceAnalytics(): Promise<PerformanceMetrics> {
  return {
    generationLatency: {
      avg: 412,
      p95: 780,
      count: 142,
    },
    chatResponseLatency: {
      avg: 185,
      p95: 320,
      count: 360,
    },
    conversionRate: 18.4,
    cacheHitRate: 94.2,
    popularCraftCategories: [
      { category: "Bamboo & Cane", views: 1840, inquiries: 92 },
      { category: "Bidriware Metal Inlay", views: 2450, inquiries: 138 },
      { category: "Madhubani Folk Painting", views: 1620, inquiries: 78 },
      { category: "Terracotta & Pottery", views: 980, inquiries: 45 },
      { category: "Handloom Textiles", views: 2100, inquiries: 115 },
    ],
  };
}

/**
 * System Settings
 */
export async function getAdminSettings(): Promise<AdminSystemSettings> {
  return getStored<AdminSystemSettings>(LOCAL_STORAGE_SETTINGS, memorySettings);
}

export async function updateAdminSettings(
  patch: Partial<AdminSystemSettings>
): Promise<AdminSystemSettings> {
  memorySettings = {
    ...memorySettings,
    ...patch,
    lastUpdated: new Date().toISOString(),
  };

  setStored(LOCAL_STORAGE_SETTINGS, memorySettings);

  logAdminActivity(
    "UPDATE_SETTINGS",
    { name: "Admin", role: "ADMIN" },
    "system-settings",
    "settings",
    "Updated platform configuration parameters."
  );

  return memorySettings;
}
