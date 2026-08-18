import { getSupabaseClient } from "./client";
import { BUCKET_NAME, isSupabaseConfigured } from "./config";

export async function uploadProductImage(file: File): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Skipping remote image upload.");
    return null;
  }

  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase image upload failed:", uploadError.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Unexpected error uploading product image:", err);
    return null;
  }
}
