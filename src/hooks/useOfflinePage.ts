/* eslint-disable no-console */
import { useEffectOnce } from 'react-use';
import setupIndexedDB, { useIndexedDBStore } from 'use-indexeddb';
import { IndexedDBConfig } from 'use-indexeddb/dist/interfaces';

const databaseName = 'offline';
const pagesStoreName = 'pages';

enum PagesColumn {
  title = 'title',
  content = 'content',
}

const indexedDbConfig: IndexedDBConfig = {
  databaseName,
  version: 1,
  stores: [
    {
      name: pagesStoreName,
      id: { keyPath: 'id', autoIncrement: true },
      indices: [
        { name: PagesColumn.title, keyPath: PagesColumn.title, options: { unique: true } },
        { name: PagesColumn.content, keyPath: PagesColumn.content },
      ],
    },
  ],
};

export function useOfflinePage() {
  useEffectOnce(() => {
    setupIndexedDB(indexedDbConfig).catch((error) => {
      console.error('Failed to setup IndexedDB for offline pages');
      console.error(error);
    });
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { add } = useIndexedDBStore(pagesStoreName);

  const savePageOffline = (title: string, content: string) =>
    add({
      [PagesColumn.title]: title,
      [PagesColumn.content]: content,
    });

  return { savePageOffline };
}
