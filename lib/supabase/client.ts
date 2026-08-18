import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getSupabaseConfig } from './config';

const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseConfig();

export const supabase: SupabaseClient<Database> | null = isConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseLive = isConfigured && Boolean(supabase);
