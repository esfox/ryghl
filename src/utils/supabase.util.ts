import { SUPABASE_BUCKET_NAME, SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY } from '@/constants';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY);

function getBucket() {
  return supabase.storage.from(SUPABASE_BUCKET_NAME);
}

export async function listFiles(params: {
  folder: string;
  page?: number;
  countPerPage?: number;
  search?: string;
}) {
  const { folder, page, countPerPage, search } = params;
  let pageNumber = page ?? 1;
  if (pageNumber < 0) {
    pageNumber = 1;
  }

  const limit = countPerPage ?? 100;

  const { data, error } = await getBucket().list(folder, {
    limit: limit ?? 100,
    offset: (pageNumber - 1) * limit,
    search,
  });

  if (error) {
    throw error;
  }

  return data;
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

export async function downloadFile(filepath: string) {
  const { data, error } = await getBucket().download(filepath);

  if (error) {
    throw error;
  }

  return data;
}
