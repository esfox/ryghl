import { PageContentDataType, PageType } from '@/types';

import ky from 'ky';

const apiBaseUrl = process.env.API_URL || '';
const api = ky.create({ prefixUrl: `${apiBaseUrl}/api` });

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

  async getPageContent(pageId: string, withPreview = false) {
    const data: PageContentDataType = await api
      .get(`pages/${pageId}`, {
        searchParams: new URLSearchParams({ withPreview: withPreview.toString() }),
      })
      .json();
    return data;
  },
};
