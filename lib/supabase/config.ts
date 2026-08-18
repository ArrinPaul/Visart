/**
 * Supabase Configuration & Fallback Detector
 * Member C — Platform / Data Engineer
 */

export const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

  const isConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project')
  );

  return {
    supabaseUrl,
    supabaseAnonKey,
    isConfigured,
  };
};
