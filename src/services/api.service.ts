import { PageType, SaveEventType } from '@/types';

import ky from 'ky';

export const apiService = {
  api: ky.create({ prefixUrl: '/api' }),

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

  deleteEvent(eventId: string) {
    return this.api
      .delete(`events/${eventId}`, {
        timeout: false,
      })
      .json();
  },
};
