import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const BUCKET = process.env.SUPABASE_BUCKET || 'hero-images';

if (!supabaseUrl || !serviceKey) {
console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
process.exit(1);
}

export const supabase = createClient(supabaseUrl, serviceKey);