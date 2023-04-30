import { PageGridItem } from '@/components/PageGridItem';
import { usePages } from '@/hooks/usePages';
import { PageType } from '@/types';

import { useEffect, useMemo } from 'react';
import { useEffectOnce } from 'react-use';

type PageGridItemData = {
  page: PageType;
  preview?: string;
};

export default function Pages() {
  const { pages, pagesContentData, isLoadingPages, fetchPages, fetchPagesContent } = usePages();

  useEffectOnce(() => {
    fetchPages();
  });

  useEffect(() => {
    fetchPagesContent(true);
  }, [pages, fetchPagesContent]);

  const pageGridData = useMemo<PageGridItemData[]>(() => {
    const pagesData = [];
    for (const pageListItem of pages) {
      const pageContent = pagesContentData.find(
        (pageContentData) => pageContentData.pageId === pageListItem.id
      );
      const pageData: PageGridItemData = {
        page: pageListItem,
        preview: pageContent?.preview,
      };
      pagesData.push(pageData);
    }
    return pagesData;
  }, [pages, pagesContentData]);

  return (
    <>
      <div className="navbar bg-base-100">
        <span className="font-bold normal-case text-xl px-4">Pages</span>
      </div>
      {isLoadingPages ? (
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
