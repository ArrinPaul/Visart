import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getSupabaseConfig, SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './config';

const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseConfig();

export const supabase: SupabaseClient<Database> | null = isConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseLive = isConfigured && Boolean(supabase);

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
};
