import { SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_ANON_KEY } from '@/constants';

import { createClient } from '@supabase/supabase-js';

export const supabasePublic = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_ANON_KEY);
