import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured, getSupabaseConfig } from "./config";

// Always the public anon/publishable key — there is no service-role/privileged Supabase client
// anywhere in this codebase, including in lib/supabase/admin.ts despite its name. See
// docs/SECURITY.md. `isSupabaseLive`/isSupabaseConfigured() gate every lib/supabase/* function's
// fallback-to-local-storage behavior — see docs/adr/001-demo-mode-dual-persistence.md.
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
