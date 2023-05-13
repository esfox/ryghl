export type PageType = {
  id: string;
  title: string;
};

export type PageContentDataType = {
  pageId: string;
  content: string;
  preview?: string;
};

export type PagesQueryType = {
  page?: number;
  countPerPage?: number;
  search?: string;
};
