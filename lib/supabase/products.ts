import type { ProductRecord, ProductInputData, VisartGeneration, ArtisanInputData } from '@/types/visart';
import { supabase, isSupabaseLive, getSupabaseClient } from './client';
import { SEED_PRODUCTS } from '@/lib/data/seed';

const LOCAL_STORAGE_KEY = 'visart_saved_products';

// In-memory cache for fast retrieval and SSR safety
const memoryStore = new Map<string, ProductRecord>();

// Pre-populate memory store with seed demo products
SEED_PRODUCTS.forEach((p) => memoryStore.set(p.id, p));

/**
 * Helper to get locally stored products from localStorage (browser only)
 */
function getLocalStorageProducts(): ProductRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ProductRecord[];
  } catch (e) {
    console.warn('Failed to read from localStorage:', e);
    return [];
  }
}

/**
 * Helper to persist a product locally
 */
function saveToLocalStorage(product: ProductRecord) {
  memoryStore.set(product.id, product);
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalStorageProducts().filter((p) => p.id !== product.id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([product, ...existing]));
    sessionStorage.setItem(`visart_product_${product.id}`, JSON.stringify(product));
    sessionStorage.setItem('visart_active_generation', JSON.stringify(product.generated_data));
    sessionStorage.setItem('visart_active_product_id', product.id);
  } catch (e) {
    console.warn('Failed to save to storage:', e);
  }
}

/**
 * Save newly generated product listing & artisan facts
 */
export async function saveProduct(
  paramsOrInput:
    | {
        inputData: ProductInputData;
        generatedData: VisartGeneration;
        imageUrl: string;
        artisan?: ArtisanInputData;
        customId?: string;
      }
    | any,
  generationArg?: VisartGeneration,
  imageUrlArg?: string
): Promise<ProductRecord> {
  let inputData: ProductInputData;
  let generatedData: VisartGeneration;
  let imageUrl: string;
  let artisan: ArtisanInputData | undefined;
  let customId: string | undefined;

  if (generationArg && typeof paramsOrInput === 'object') {
    // Called with (input, generation, imageUrl)
    inputData = {
      productName: paramsOrInput.productName || paramsOrInput.material,
      material: paramsOrInput.material,
      productionCost: Number(paramsOrInput.productionCost) || 0,
      timeRequired: paramsOrInput.timeRequired,
      location: paramsOrInput.location,
      craftStory: paramsOrInput.specialStory || paramsOrInput.craftStory,
    };
    generatedData = generationArg;
    imageUrl = imageUrlArg || '';
    artisan = {
      name: paramsOrInput.artisanName || 'Artisan',
      location: paramsOrInput.location,
      craft: paramsOrInput.material,
    };
  } else {
    // Called with params object
    inputData = paramsOrInput.inputData;
    generatedData = paramsOrInput.generatedData;
    imageUrl = paramsOrInput.imageUrl || '';
    artisan = paramsOrInput.artisan;
    customId = paramsOrInput.customId;
  }

  const productId = customId || `visart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const record: ProductRecord = {
    id: productId,
    artisan_id: artisan?.name ? `artisan-${Date.now()}` : null,
    image_url: imageUrl,
    input_data: inputData,
    generated_data: generatedData,
    is_published: true,
    created_at: now,
    updated_at: now,
    artisan: artisan
      ? {
          id: `artisan-${Date.now()}`,
          name: artisan.name,
          location: artisan.location || inputData.location,
          craft: artisan.craft || inputData.material,
          preferred_language: artisan.preferredLanguage || 'en',
        }
      : null,
  };

  // 1. Store locally for instant workspace preview
  saveToLocalStorage(record);

  // 2. Persist to live Supabase if configured
  const client = supabase || getSupabaseClient();
  if (isSupabaseLive && client) {
    try {
      let artisanId: string | null = null;

      if (artisan?.name) {
        const { data: artisanRow, error: artisanErr } = await client
          .from('artisans')
          .insert({
            name: artisan.name,
            location: artisan.location || inputData.location,
            craft: artisan.craft || inputData.material,
            preferred_language: artisan.preferredLanguage || 'en',
          })
          .select('id')
          .single();

        if (!artisanErr && artisanRow?.id) {
          artisanId = artisanRow.id;
          record.artisan_id = artisanId;
        }
      }

      const { data: productRow, error: productErr } = await client
        .from('products')
        .insert({
          artisan_id: artisanId,
          image_url: imageUrl,
          input_data: inputData,
          generated_data: generatedData,
          is_published: true,
        })
        .select('id, created_at')
        .single();

      if (!productErr && productRow?.id) {
        record.id = productRow.id;
        record.created_at = productRow.created_at || now;
        saveToLocalStorage(record);
      }
    } catch (err) {
      console.warn('Supabase DB insert warning (fallback used):', err);
    }
  }

  return record;
}

/**
 * Retrieve a product by ID
 */
export async function getProductById(id: string): Promise<ProductRecord | null> {
  if (!id) return null;

  // 1. Check memory store
  if (memoryStore.has(id)) {
    return memoryStore.get(id)!;
  }

  // 2. Check localStorage & sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const sessionCached = sessionStorage.getItem(`visart_product_${id}`);
      if (sessionCached) {
        const parsed = JSON.parse(sessionCached);
        const rec: ProductRecord = parsed.generated_data
          ? parsed
          : {
              id: parsed.id,
              image_url: parsed.image_url || '',
              input_data: parsed.input || parsed.input_data,
              generated_data: parsed.generation || parsed.generated_data,
              created_at: parsed.created_at,
            };
        memoryStore.set(id, rec);
        return rec;
      }
    } catch (err) {
      console.warn('SessionStorage read error:', err);
    }
  }

  const localList = getLocalStorageProducts();
  const foundLocal = localList.find((p) => p.id === id);
  if (foundLocal) {
    memoryStore.set(foundLocal.id, foundLocal);
    return foundLocal;
  }

  // 3. Check Seed Products
  const foundSeed = SEED_PRODUCTS.find((p) => p.id === id);
  if (foundSeed) {
    memoryStore.set(foundSeed.id, foundSeed);
    return foundSeed;
  }

  // 4. Query live Supabase DB
  const client = supabase || getSupabaseClient();
  if (isSupabaseLive && client) {
    try {
      const { data: productRow, error } = await client
        .from('products')
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
        .eq('id', id)
        .single();

      if (!error && productRow) {
        const artisanData = Array.isArray(productRow.artisans)
          ? productRow.artisans[0]
          : productRow.artisans;

        const record: ProductRecord = {
          id: productRow.id,
          artisan_id: productRow.artisan_id,
          image_url: productRow.image_url || '',
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
        return record;
      }
    } catch (err) {
      console.warn('Supabase getProductById failed, checking fallbacks:', err);
    }
  }

  // Fallback to seed product
  return SEED_PRODUCTS[0];
}

export const getProduct = getProductById;

/**
 * Retrieve recent products for workspace
 */
export async function getRecentProducts(): Promise<ProductRecord[]> {
  const localList = getLocalStorageProducts();
  const map = new Map<string, ProductRecord>();

  SEED_PRODUCTS.forEach((p) => map.set(p.id, p));
  localList.forEach((p) => map.set(p.id, p));

  const client = supabase || getSupabaseClient();
  if (isSupabaseLive && client) {
    try {
      const { data, error } = await client
        .from('products')
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
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        data.forEach((row) => {
          const artisanData = Array.isArray(row.artisans) ? row.artisans[0] : row.artisans;
          map.set(row.id, {
            id: row.id,
            artisan_id: row.artisan_id,
            image_url: row.image_url || '',
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
      console.warn('Failed to fetch recent products from live Supabase:', e);
    }
  }

  return Array.from(map.values());
}

/**
 * Update product data
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

  const client = supabase || getSupabaseClient();
  if (isSupabaseLive && client) {
    try {
      await client
        .from('products')
        .update({
          generated_data: updated.generated_data,
          updated_at: updated.updated_at,
        })
        .eq('id', id);
    } catch (e) {
      console.warn('Failed to update product in Supabase:', e);
    }
  }

  return updated;
}
