import { PageContentDataType, PageType } from '@/types';

import ky from 'ky';

const api = ky.create({
  prefixUrl: '/api',
});

export const apiService = {
  // TODO: Implement pagination
  async getPages() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { results } = await api.get('pages').json<any>();

    /* Map the notion pages to an instance of `PageType` */
    const pagesResult: PageType[] = [];
    for (const result of results) {
      const { id } = result;
      const title = result.properties?.title?.title[0]?.text?.content ?? 'Untitled';
      pagesResult.push({
        id,
        title,
      });
    }

    return pagesResult;
  },

  async getPageContent(pageId: string) {
    const data: PageContentDataType = await api
      .get(`pages/${pageId}/content`, {
        searchParams: new URLSearchParams({ withPreview: 'true' }),
      })
      .json();
    return data;
  },
};
