import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.https://eupuhvrhdqaxfpodbuxa.supabase.co || '';
const supabaseAnonKey = import.meta.env.sb_publishable_wZyQ8Okfuw5JIVOvuXpAcw_u8klN0gT || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
