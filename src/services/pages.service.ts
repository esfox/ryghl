/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable no-console */
import { SUPABASE_BUCKET_NAME } from '@/constants';
import { PageRecordColumn } from '@/constants/database';
import { supabase } from '@/supabase';
import { PageRecordType } from '@/types/database';
import { nanoid } from '@/utils/nanoid.util';

type PaginationType = {
  page?: number;
  countPerPage?: number;
};

enum Folders {
  Pages = 'pages',
  PagePreviews = 'page_previews',
}

function bucket() {
  return supabase.storage.from(SUPABASE_BUCKET_NAME);
}

function pagesTable() {
  return supabase.from('pages');
}

export const pagesService = {
  getPagePath(id: string) {
    return `${Folders.Pages}/${id}`;
  },

  getPagePreviewPath(pageId: string) {
    return `${Folders.PagePreviews}/${pageId}`;
  },

  async list(params: PaginationType & { search?: string }) {
    const { page, countPerPage, search } = params;
    let pageNumber = page ?? 1;
    if (pageNumber < 0) {
      pageNumber = 1;
    }

    let query = pagesTable()
      .select<'*', PageRecordType>()
      .limit(countPerPage ?? 100);

    if (search) {
      query = query.ilike(PageRecordColumn.title, search);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return data;
  },

  async getPreviews(params: { pageIds: string[] } & PaginationType) {
    const { pageIds } = params;
    const previewPaths = pageIds.map((id) => this.getPagePreviewPath(id));
    const { data, error } = await bucket().createSignedUrls(previewPaths, 3600);
    if (error) {
      throw error;
    }

    return data;
  },

  async save(params: { id?: string; title: string; content: string; previewImage?: string }) {
    const { id, title, content, previewImage } = params;

    /* Save the actual page file */
    const pageId = id ?? nanoid(16);
    const filepath = this.getPagePath(pageId);
    const uploadResult = await bucket().upload(filepath, content, {
      contentType: 'text/markdown;charset=UTF-8',
      upsert: true,
    });

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    const contentUploadUrl = uploadResult.data?.path;
    if (!contentUploadUrl) {
      return;
    }

    if (previewImage) {
      const previewBase64Data = previewImage.substring(previewImage.indexOf(','));
      const previewBuffer = Buffer.from(previewBase64Data, 'base64');
      const previewPath = this.getPagePreviewPath(pageId);
      const previewUploadResult = await bucket().upload(previewPath, previewBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

      if (previewUploadResult.error) {
        console.error(`Failed to create a preview for page '${title}'`);
        console.error(previewUploadResult.error);
      }
    }

    /* Create the page record in the pages database table */
    const savePageRecordResult = await pagesTable().upsert<PageRecordType>(
      {
        [PageRecordColumn.id]: pageId,
        [PageRecordColumn.title]: title,
      },
      {
        onConflict: PageRecordColumn.id,
      },
    );

    if (savePageRecordResult.error) {
      throw savePageRecordResult.error;
    }

    return savePageRecordResult.data;
  },

  async get(id: string) {
    const { data, error } = await pagesTable()
      .select<'*', PageRecordType>()
      .eq(PageRecordColumn.id, id);
    if (error) {
      throw error;
    }

    return data;
  },

  async getContent(id: string) {
    const filepath = this.getPagePath(id);
    const { data, error } = await bucket().download(filepath);
    if (error) {
      throw error;
    }

    return data;
  },
};
