import { SESSION_EXPIRES_IN } from '@/constants';
import { PageType } from '@/types';

import Cookies from 'js-cookie';
import ky from 'ky';

export const apiService = {
  api: ky.create({ prefixUrl: '/api' }),

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
