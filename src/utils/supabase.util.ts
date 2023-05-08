import { SUPABASE_BUCKET_NAME, SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY } from '@/constants';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY);

function getBucket() {
  return supabase.storage.from(SUPABASE_BUCKET_NAME);
}

export async function uploadFile(filename: string, content: string) {
  const { data, error } = await getBucket().upload(filename, content, {
    contentType: 'text/markdown;charset=UTF-8',
    upsert: true,
  });

  if (error) {
    throw error;
  }

  return data;
}
