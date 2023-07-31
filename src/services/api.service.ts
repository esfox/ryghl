import { SESSION_EXPIRES_IN } from '@/constants';
import { PageType, SaveEventType } from '@/types';

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

  getPagePreviews(pageIds: string[]) {
    const searchParams = new URLSearchParams();
    for (const id of pageIds) {
      searchParams.append('ids', id);
    }

    return this.api
      .get('pages/previews', {
        searchParams,
      })
      .json<Omit<PageType, 'title'>[]>();
  },

  savePage(params: { id?: string; title: string; content: string; previewImage?: string }) {
    const { id, title, content, previewImage } = params;
    return this.api
      .post('pages/save', {
        json: {
          id,
          title,
          content,
          previewImage,
        },
        timeout: false,
      })
      .json();
  },

  saveEvent(params: SaveEventType) {
    return this.api
      .post('events', {
        json: params,
        timeout: false,
      })
      .json();
  },
};
