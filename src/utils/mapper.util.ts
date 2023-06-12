import { PageRecordColumn } from '@/constants/database';
import { PageType } from '@/types';
import { PageRecordType } from '@/types/database';

export function mapPageRecords(pageRecords: PageRecordType[]) {
  return pageRecords.map<PageType>((record) => ({
    id: record[PageRecordColumn.id],
    title: record[PageRecordColumn.title],
  }));
}
