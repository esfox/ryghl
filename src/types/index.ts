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

export type SyncedScrollingPayload = {
  firstVisibleChildId: string;
};

export type EventType = {
  id: string;
  date: string;
  name: string;
};

export type SaveEventType = Omit<EventType, 'id'> & { id?: string };
