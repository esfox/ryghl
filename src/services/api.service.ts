import { API_URL, SESSION_EXPIRES_IN } from '@/constants';
import { PageContentDataType, PageType } from '@/types';

import Cookies from 'js-cookie';
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

  async login(password: string) {
    const { sessionToken } = await this.api
      .post('login', { json: { password } })
      .json<{ sessionToken: string }>();

    Cookies.set('auth', sessionToken, {
      expires: SESSION_EXPIRES_IN / 24 / 60 / 60,
    });
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

  async savePage(title: string, content: string) {
    const data = await this.api
      .post('pages/new', {
        body: content,
        headers: {
          title,
        },
      })
      .json();

    return data;
  },

  async getRealtimeConfig() {
    return this.api.post('realtime-config').json();
  },
};
