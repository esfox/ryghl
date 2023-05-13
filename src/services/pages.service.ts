import { SUPABASE_BUCKET_NAME, SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY } from '@/constants';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY);

function getBucket() {
  return supabase.storage.from(SUPABASE_BUCKET_NAME);
}

enum Folders {
  Pages = 'pages',
}

export const pagesService = {
  // TODO: Get by page ID
  getFilepath(title: string) {
    return `${Folders.Pages}/${title}`;
  },

  // TODO: Include page IDs
  async list(params: { page?: number; countPerPage?: number; search?: string }) {
    const { page, countPerPage, search } = params;
    let pageNumber = page ?? 1;
    if (pageNumber < 0) {
      pageNumber = 1;
    }

    const limit = countPerPage ?? 100;

    const { data, error } = await getBucket().list(Folders.Pages, {
      limit: limit ?? 100,
      offset: (pageNumber - 1) * limit,
      search,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // TODO: Create page image thumbnail and page ID
  async create(title: string, content: string) {
    const filepath = this.getFilepath(title);
    const { data, error } = await getBucket().upload(filepath, content, {
      contentType: 'text/markdown;charset=UTF-8',
      upsert: true,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async get(title: string) {
    const filepath = this.getFilepath(title);
    const { data, error } = await getBucket().download(filepath);
    if (error) {
      throw error;
    }

    return data;
  },
};
