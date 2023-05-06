import { API_URL } from '@/constants';
import { PageContentDataType, PageType } from '@/types';

import ky from 'ky';

export const apiService = {
  api: ky.create({ prefixUrl: `${API_URL}/api` }),

  withCookies(cookies: Record<string, string>) {
    this.api = this.api.extend({
      headers: {
        Cookie: new URLSearchParams(cookies).toString(),
      },
    });

    return this;
  },

  // TODO: Implement pagination
  async getPages() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { results } = await this.api.get('pages').json<any>();

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

  async getPageContent(pageId: string, options?: { withPreview?: boolean }) {
    const { withPreview } = options || {};
    const searchParams = new URLSearchParams();
    if (withPreview) {
      searchParams.set('withPreview', 'true');
    }

    const data: PageContentDataType = await this.api
      .get(`pages/${pageId}`, { searchParams })
      .json();
    return data;
  },

  async getRealtimeConfig() {
    return this.api.post('realtime-config').json();
  },
};
