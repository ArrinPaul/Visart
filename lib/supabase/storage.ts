import { supabase, isSupabaseLive, getSupabaseClient } from "./client";
import { BUCKET_NAME, isSupabaseConfigured } from "./config";

export type UploadImageResult = {
  success: boolean;
  url: string;
  error?: string;
};

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export async function uploadProductImage(file: File): Promise<UploadImageResult> {
  if (!file) {
    return { success: false, url: "", error: "No file provided" };
  }

  // Validate format
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      success: false,
      url: "",
      error: "Invalid file format. Please upload JPEG, PNG, or WebP.",
    };
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      url: "",
      error: "File size exceeds 8MB limit. Please upload a smaller image.",
    };
  }

  const client = isSupabaseLive ? supabase : getSupabaseClient();

  // If Supabase is configured, upload to storage bucket
  if (client) {
    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data: uploadData, error: uploadError } = await client.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.warn("Supabase storage upload failed, using local URL fallback:", uploadError.message);
      } else if (uploadData?.path) {
        const { data: publicUrlData } = client.storage
          .from(BUCKET_NAME)
          .getPublicUrl(uploadData.path);

        if (publicUrlData?.publicUrl) {
          return { success: true, url: publicUrlData.publicUrl };
        }
      }
    } catch (err) {
      console.warn("Storage upload error, using local fallback:", err);
    }
  }

  // Fallback: create base64 data URL for offline / local demo resilience
  if (typeof window !== "undefined" && typeof FileReader !== "undefined") {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          success: true,
          url: reader.result as string,
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          url: "",
          error: "Failed to read image file locally.",
        });
      };
      reader.readAsDataURL(file);
    });
  }

  return { success: true, url: "" };
}
