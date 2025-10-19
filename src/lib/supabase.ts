import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SL_SCHOOL_DEMO_SUPABASE_URL || process.env.NEXT_PUBLIC_SL_SCHOOL_DEMOSUPABASE_URL;
const supabaseKey = process.env.SL_SCHOOL_DEMO_SUPABASE_SERVICE_ROLE_KEY || process.env.SL_SCHOOL_DEMO_NEXT_PUBLIC_SL_SCHOOL_DEMOSUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
