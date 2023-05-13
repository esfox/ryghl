import { PageGridItem } from '@/components/PageGridItem';
import { usePages } from '@/hooks/usePages';
import { PageType } from '@/types';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useEffectOnce } from 'react-use';

type PageGridItemDataType = {
  page: PageType;
  preview?: string;
};

export default function Pages() {
  const { pages, pagesContent, isFetchingPages, fetchPages, fetchPagesContent } = usePages();

  useEffectOnce(() => {
    fetchPages();
  });

  useEffect(() => {
    fetchPagesContent(true);
  }, [pages, fetchPagesContent]);

  const pageGridData = useMemo<PageGridItemDataType[]>(() => {
    const pagesData = [];
    for (const pageListItem of pages) {
      const pageContent = pagesContent.find(
        (pageContentData) => pageContentData.pageId === pageListItem.id
      );
      const pageData: PageGridItemDataType = {
        page: pageListItem,
        preview: pageContent?.preview,
      };
      pagesData.push(pageData);
    }
    return pagesData;
  }, [pages, pagesContent]);

  return (
    <>
      <div className="navbar bg-base-100 flex justify-between px-4">
        <span className="font-bold normal-case text-xl px-2">Pages</span>
        <Link href="/pages/new">
          <button className="btn btn-primary btn-sm px-6">New Page</button>
        </Link>
      </div>
      {isFetchingPages ? (
        <div className="h-full w-full grid place-items-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-x-4 gap-y-12 p-4">
          {pageGridData &&
            pageGridData.map(({ page, preview }, index) => (
              <PageGridItem key={`${index}_${Date.now()}`} page={page} preview={preview} />
            ))}
        </div>
      )}
    </>
  );
}
