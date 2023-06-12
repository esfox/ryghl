import { PageRecordColumn } from '@/constants/database';

export type PageRecordType = {
  [PageRecordColumn.id]: string;
  [PageRecordColumn.title]: string;
  [PageRecordColumn.createdOn]?: string;
};
