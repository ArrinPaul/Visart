import { getSupabaseClient } from "./client";
import { isSupabaseConfigured } from "./config";
import { ProductRecord } from "@/types/database";
import { ProductFormData } from "@/types/frontend";
import { VisartGeneration } from "@/types/visart";

/**
 * Persists a generated listing product record.
 * Returns the product ID string (UUID or fallback local ID).
 */
export async function saveProduct(
  input: ProductFormData,
  generation: VisartGeneration,
  imageUrl: string
): Promise<string> {
  const generatedId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const record: ProductRecord = {
    id: generatedId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    input: {
      material: input.material,
      productionCost: input.productionCost,
      timeRequired: input.timeRequired,
      location: input.location,
      productName: input.productName,
      specialStory: input.specialStory,
      imagePreviewUrl: imageUrl,
    },
    generation: {
      ...generation,
      product: {
        ...generation.product,
        imageUrl: imageUrl || generation.product.imageUrl,
      },
    },
    image_url: imageUrl,
  };

  // Always store in sessionStorage for instant local hydration / offline fallback
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`visart_product_${generatedId}`, JSON.stringify(record));
      sessionStorage.setItem("visart_active_generation", JSON.stringify(record.generation));
      sessionStorage.setItem("visart_active_product_id", generatedId);
    } catch (err) {
      console.warn("Could not save product to sessionStorage:", err);
    }
  }

  if (!isSupabaseConfigured()) {
    console.info("Supabase unconfigured: Saved product locally with ID", generatedId);
    return generatedId;
  }

  const supabase = getSupabaseClient();
  if (!supabase) return generatedId;

  try {
    const { data, error } = await (supabase.from("products") as any)
      .insert({
        id: generatedId,
        input: record.input,
        generation: record.generation,
        image_url: imageUrl,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert product error:", error.message);
      return generatedId;
    }

    return data?.id || generatedId;
  } catch (err) {
    console.error("Unexpected error saving product to Supabase:", err);
    return generatedId;
  }
}

/**
 * Retrieves a product record by ID.
 * Tries Supabase first, falls back to sessionStorage or demo fixture.
 */
export async function getProduct(id: string): Promise<ProductRecord | null> {
  // Check local sessionStorage fallback first for speed/offline support
  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem(`visart_product_${id}`);
      if (cached) {
        return JSON.parse(cached) as ProductRecord;
      }
    } catch (err) {
      console.warn("Error reading product from sessionStorage:", err);
    }
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await (supabase.from("products") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.warn("Product not found in Supabase:", id, error?.message);
      return null;
    }

    return data as ProductRecord;
  } catch (err) {
    console.error("Unexpected error retrieving product from Supabase:", err);
    return null;
  }
}

/**
 * Updates a product record data.
 */
export async function updateProductData(
  id: string,
  updates: Partial<VisartGeneration>
): Promise<boolean> {
  // Update local session storage
  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem(`visart_product_${id}`);
      if (cached) {
        const record = JSON.parse(cached) as ProductRecord;
        const updatedRecord: ProductRecord = {
          ...record,
          generation: { ...record.generation, ...updates },
          updated_at: new Date().toISOString(),
        };
        sessionStorage.setItem(`visart_product_${id}`, JSON.stringify(updatedRecord));
        sessionStorage.setItem("visart_active_generation", JSON.stringify(updatedRecord.generation));
      }
    } catch (err) {
      console.warn("Error updating product in sessionStorage:", err);
    }
  }

  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await (supabase.from("products") as any)
      .update({
        generation: updates as any,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return !error;
  } catch (err) {
    console.error("Unexpected error updating product in Supabase:", err);
    return false;
  }
}
