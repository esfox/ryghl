import { SESSION_EXPIRES_IN } from '@/constants';
import { PageContentDataType, PageType } from '@/types';

import Cookies from 'js-cookie';
import ky from 'ky';

export const apiService = {
  api: ky.create({ prefixUrl: '/api' }),

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
  getPages() {
    return this.api.get('pages').json<PageType[]>();
  },

  getPagePreviews(pageTitles: string[]) {
    const searchParams = new URLSearchParams();
    for (const title of pageTitles) {
      searchParams.append('titles', title);
    }

    return this.api
      .get('pages/previews', {
        searchParams,
      })
      .json<Omit<PageType, 'id'>[]>();
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

  savePage(title: string, content: string) {
    return this.api
      .post('pages/new', {
        body: content,
        headers: {
          title,
        },
        timeout: false,
      })
      .json();
  },
};
