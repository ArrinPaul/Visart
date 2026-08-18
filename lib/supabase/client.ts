import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured, getSupabaseConfig } from "./config";

const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseConfig();

export const supabase: SupabaseClient<Database> | null = isConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseLive = isConfigured && Boolean(supabase);

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return supabase || createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
};
