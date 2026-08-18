import type {
  ProductRecord,
  ProductInputData,
  VisartGeneration,
  ArtisanInputData,
} from "@/types/visart";
import type { ProductFormData } from "@/types/frontend";
import { supabase, isSupabaseLive, getSupabaseClient } from "./client";
import { SEED_PRODUCTS } from "@/lib/data/seed";

const LOCAL_STORAGE_KEY = "visart_saved_products";

// In-memory cache for fast retrieval and SSR safety
const memoryStore = new Map<string, ProductRecord>();

// Pre-populate memory store with seed demo products
SEED_PRODUCTS.forEach((p) => memoryStore.set(p.id, p));

/**
 * Helper to get locally stored products from localStorage (browser only)
 */
function getLocalStorageProducts(): ProductRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ProductRecord[];
  } catch (e) {
    console.warn("Failed to read from localStorage:", e);
    return [];
  }
}

/**
 * Helper to persist a product locally
 */
function saveToLocalStorage(product: ProductRecord) {
  memoryStore.set(product.id, product);
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalStorageProducts().filter((p) => p.id !== product.id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([product, ...existing]));
    sessionStorage.setItem(`visart_product_${product.id}`, JSON.stringify(product));
    sessionStorage.setItem("visart_active_generation", JSON.stringify(product.generated_data));
    sessionStorage.setItem("visart_active_product_id", product.id);
  } catch (e) {
    console.warn("Failed to save to localStorage:", e);
  }
}

export type SaveProductParams = {
  inputData: ProductInputData | ProductFormData;
  generatedData: VisartGeneration;
  imageUrl: string;
  artisan?: ArtisanInputData;
  customId?: string;
};

/**
 * Save newly generated product listing & artisan facts.
 * Supports both params object and positional arguments for backwards compatibility.
 */
export async function saveProduct(
  arg1: SaveProductParams | ProductFormData | ProductInputData,
  arg2?: VisartGeneration,
  arg3?: string
): Promise<ProductRecord> {
  const saveStart = performance.now();

  let inputData: ProductInputData | ProductFormData;
  let generatedData: VisartGeneration;
  let imageUrl = "";
  let artisan: ArtisanInputData | undefined;
  let customId: string | undefined;

  if (arg2 !== undefined) {
    // Positional signature: saveProduct(formData, generation, imageUrl)
    inputData = arg1 as ProductFormData | ProductInputData;
    generatedData = arg2;
    imageUrl = arg3 || "";
  } else {
    // Object signature: saveProduct({ inputData, generatedData, imageUrl, artisan, customId })
    const params = arg1 as SaveProductParams;
    inputData = params.inputData;
    generatedData = params.generatedData;
    imageUrl = params.imageUrl || "";
    artisan = params.artisan;
    customId = params.customId;
  }

  console.log(`[VISART DEBUG] saveProduct called with generated title: "${generatedData.product.title}"`);

  const productId =
    customId || `visart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const record: ProductRecord = {
    id: productId,
    artisan_id: artisan?.name ? `artisan-${Date.now()}` : null,
    image_url: imageUrl,
    input_data: inputData as ProductInputData,
    generated_data: {
      ...generatedData,
      product: {
        ...generatedData.product,
        imageUrl: imageUrl || generatedData.product.imageUrl,
      },
    },
    is_published: true,
    created_at: now,
    updated_at: now,
    artisan: artisan
      ? {
          id: `artisan-${Date.now()}`,
          name: artisan.name,
          location: artisan.location || inputData.location,
          craft: artisan.craft || inputData.material,
          preferred_language: artisan.preferredLanguage || "en",
        }
      : null,
  };

  // 1. Always store locally for zero-latency workspace preview & offline fallback
  saveToLocalStorage(record);

  // 2. If Supabase is live, persist to PostgreSQL
  const client = isSupabaseLive ? supabase : getSupabaseClient();
  if (client) {
    try {
      let artisanId: string | null = null;

      if (artisan?.name) {
        const { data: artisanRow, error: artisanErr } = await client
          .from("artisans")
          .insert({
            name: artisan.name,
            location: artisan.location || inputData.location,
            craft: artisan.craft || inputData.material,
            preferred_language: artisan.preferredLanguage || "en",
          })
          .select("id")
          .single();

        if (!artisanErr && artisanRow?.id) {
          artisanId = artisanRow.id;
          record.artisan_id = artisanId;
        }
      }

      const { data: productRow, error: productErr } = await client
        .from("products")
        .insert({
          id: productId,
          artisan_id: artisanId,
          image_url: imageUrl,
          input_data: inputData as any,
          generated_data: record.generated_data,
          is_published: true,
        })
        .select("id, created_at")
        .single();

      if (!productErr && productRow?.id) {
        record.id = productRow.id;
        record.created_at = productRow.created_at || now;
        saveToLocalStorage(record);
      }
    } catch (err) {
      console.warn("Supabase DB insert warning (fallback used):", err);
    }
  }

  const saveEnd = performance.now();
  console.log(`[VISART DEBUG] saved product ID: "${record.id}" (Elapsed: ${(saveEnd - saveStart).toFixed(2)}ms)`);

  return record;
}

/**
 * Retrieve a product by ID (handles Supabase, seed demo data, and local draft records)
 */
export async function getProductById(id: string): Promise<ProductRecord | null> {
  if (!id) return null;

  // 1. Check memory store first
  if (memoryStore.has(id)) {
    const found = memoryStore.get(id)!;
    console.log(`[VISART DEBUG] getProduct returned title from memoryStore: "${found.generated_data.product.title}"`);
    return found;
  }

  // 2. Check localStorage / sessionStorage
  const localList = getLocalStorageProducts();
  const foundLocal = localList.find((p) => p.id === id);
  if (foundLocal) {
    memoryStore.set(foundLocal.id, foundLocal);
    console.log(`[VISART DEBUG] getProduct returned title from localStorage: "${foundLocal.generated_data.product.title}"`);
    return foundLocal;
  }

  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem(`visart_product_${id}`);
      if (cached) {
        const parsed = JSON.parse(cached) as ProductRecord;
        memoryStore.set(parsed.id, parsed);
        console.log(`[VISART DEBUG] getProduct returned title from sessionStorage: "${parsed.generated_data.product.title}"`);
        return parsed;
      }
    } catch (err) {
      console.warn("Error reading product from sessionStorage:", err);
    }
  }

  // 3. Check Seed Products
  const foundSeed = SEED_PRODUCTS.find((p) => p.id === id);
  if (foundSeed) {
    memoryStore.set(foundSeed.id, foundSeed);
    console.log(`[VISART DEBUG] getProduct returned title from SEED_PRODUCTS: "${foundSeed.generated_data.product.title}"`);
    return foundSeed;
  }

  // 4. Query live Supabase DB if available
  const client = isSupabaseLive ? supabase : getSupabaseClient();
  if (client) {
    try {
      const { data: productRow, error } = await client
        .from("products")
        .select(`
          id,
          artisan_id,
          image_url,
          input_data,
          generated_data,
          is_published,
          created_at,
          updated_at,
          artisans (
            id,
            name,
            location,
            craft,
            preferred_language
          )
        `)
        .eq("id", id)
        .single();

      if (!error && productRow) {
        const artisanData = Array.isArray(productRow.artisans)
          ? productRow.artisans[0]
          : productRow.artisans;

        const record: ProductRecord = {
          id: productRow.id,
          artisan_id: productRow.artisan_id,
          image_url: productRow.image_url || "",
          input_data: productRow.input_data as ProductInputData,
          generated_data: productRow.generated_data as VisartGeneration,
          is_published: productRow.is_published ?? true,
          created_at: productRow.created_at,
          updated_at: productRow.updated_at,
          artisan: artisanData
            ? {
                id: artisanData.id,
                name: artisanData.name,
                location: artisanData.location || undefined,
                craft: artisanData.craft || undefined,
                preferred_language: artisanData.preferred_language || undefined,
              }
            : null,
        };

        memoryStore.set(record.id, record);
        console.log(`[VISART DEBUG] getProduct returned title from live Supabase: "${record.generated_data.product.title}"`);
        return record;
      }
    } catch (err) {
      console.warn("Supabase getProductById failed, checking fallbacks:", err);
    }
  }

  return null;
}

/**
 * Backward compatibility alias for getProductById
 */
export async function getProduct(id: string): Promise<ProductRecord | null> {
  return getProductById(id);
}

/**
 * Retrieve recent products for workspace switcher / catalogue
 */
export async function getRecentProducts(): Promise<ProductRecord[]> {
  const localList = getLocalStorageProducts();
  const map = new Map<string, ProductRecord>();

  // Add seed products
  SEED_PRODUCTS.forEach((p) => map.set(p.id, p));

  // Add local products
  localList.forEach((p) => map.set(p.id, p));

  // If live Supabase, fetch latest
  const client = isSupabaseLive ? supabase : getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("products")
        .select(`
          id,
          artisan_id,
          image_url,
          input_data,
          generated_data,
          is_published,
          created_at,
          updated_at,
          artisans (
            id,
            name,
            location,
            craft,
            preferred_language
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        data.forEach((row) => {
          const artisanData = Array.isArray(row.artisans) ? row.artisans[0] : row.artisans;
          map.set(row.id, {
            id: row.id,
            artisan_id: row.artisan_id,
            image_url: row.image_url || "",
            input_data: row.input_data as ProductInputData,
            generated_data: row.generated_data as VisartGeneration,
            is_published: row.is_published ?? true,
            created_at: row.created_at,
            updated_at: row.updated_at,
            artisan: artisanData
              ? {
                  id: artisanData.id,
                  name: artisanData.name,
                  location: artisanData.location || undefined,
                  craft: artisanData.craft || undefined,
                  preferred_language: artisanData.preferred_language || undefined,
                }
              : null,
          });
        });
      }
    } catch (e) {
      console.warn("Failed to fetch from live Supabase:", e);
    }
  }

  return Array.from(map.values());
}

/**
 * Update product data when edited in the workspace
 */
export async function updateProductData(
  id: string,
  patch: Partial<VisartGeneration>
): Promise<ProductRecord | null> {
  const current = await getProductById(id);
  if (!current) return null;

  const updated: ProductRecord = {
    ...current,
    generated_data: {
      ...current.generated_data,
      ...patch,
    },
    updated_at: new Date().toISOString(),
  };

  saveToLocalStorage(updated);

  const client = isSupabaseLive ? supabase : getSupabaseClient();
  if (client) {
    try {
      await client
        .from("products")
        .update({
          generated_data: updated.generated_data,
          updated_at: updated.updated_at,
        })
        .eq("id", id);
    } catch (e) {
      console.warn("Failed to update product in Supabase:", e);
    }
  }

  return updated;
}
