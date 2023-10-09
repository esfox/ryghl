import { SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY } from '@/constants/env';

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY);
