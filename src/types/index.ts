export type PageType = {
  id: string;
  title: string;
  previewImage?: string;
};

export type PagesQueryType = {
  page?: number;
  countPerPage?: number;
  search?: string;
};
