import { PageContentDataType, PageType } from '@/types';

const fetchApi = (route: string, options?: RequestInit) =>
  fetch(`/api/${route.startsWith('/') ? route.slice(1) : route}`, options);

export const apiService = {
  // TODO: Implement pagination
  async getPages() {
    const { results } = await fetchApi('/pages').then((response) => response.json());

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
    const queryParams = new URLSearchParams({ withPreview: 'true' });
    const data: PageContentDataType = await fetchApi(
      `/pages/${pageId}/content?${queryParams}`
    ).then((response) => response.json());
    return data;
  },
};
