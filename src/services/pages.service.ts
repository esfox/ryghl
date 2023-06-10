import { SUPABASE_BUCKET_NAME, SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY } from '@/constants';

import { createClient } from '@supabase/supabase-js';

type PaginationType = {
  page?: number;
  countPerPage?: number;
};

enum Folders {
  Pages = 'pages',
  PagePreviews = 'page_previews',
}

const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SERVICE_API_KEY);

function getBucket() {
  return supabase.storage.from(SUPABASE_BUCKET_NAME);
}

export const pagesService = {
  // TODO: Get by page ID
  getPagePath(title: string) {
    return `${Folders.Pages}/${title}`;
  },

  getPagePreviewPath(pageTitle: string) {
    return `${Folders.PagePreviews}/${pageTitle}`;
  },

  // TODO: Include page IDs
  async list(params: PaginationType & { search?: string }) {
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

  async getPreviews(params: { pageTitles: string[] } & PaginationType) {
    const { pageTitles } = params;
    const previewPaths = pageTitles.map((title) => this.getPagePreviewPath(title));
    const { data, error } = await getBucket().createSignedUrls(previewPaths, 3600);
    if (error) {
      throw error;
    }

    return data;
  },

  // TODO: Create page ID
  async create(params: { title: string; content: string; previewImage?: string }) {
    const { title, content, previewImage } = params;

    /* Save the actual page file */
    const filepath = this.getPagePath(title.trim());
    const uploadResult = await getBucket().upload(filepath, content, {
      contentType: 'text/markdown;charset=UTF-8',
      upsert: true,
    });

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    if (previewImage) {
      const previewBase64Data = previewImage.substring(previewImage.indexOf(','));
      const previewBuffer = Buffer.from(previewBase64Data, 'base64');
      const previewPath = this.getPagePreviewPath(title);
      const previewUploadResult = await getBucket().upload(previewPath, previewBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

      if (previewUploadResult.error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to create a preview for page '${title}'`);
      }
    }

    return uploadResult.data;
  },

  async get(title: string) {
    const filepath = this.getPagePath(title);
    const { data, error } = await getBucket().download(filepath);
    if (error) {
      throw error;
    }

    return data;
  },
};
