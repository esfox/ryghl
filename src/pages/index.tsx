import { PageGridItem } from '@/components/PageGridItem';
import { apiService } from '@/services/api.service';
import { PageContentDataType, PageType } from '@/types';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';

type PageGridItemData = {
  page: PageType;
  preview?: string;
};

export default function Home() {
  const {
    refetch: fetchPages,
    data: pagesList,
    isLoading: isLoadingPages,
    // error: pagesError,
  } = useQuery({
    queryKey: ['pages'],
    queryFn: () => apiService.getPages(),
    enabled: false,
    initialData: [],
  });

  useEffectOnce(() => {
    fetchPages();
  });

  const [pagesContentData, setPagesContentData] = useState<PageContentDataType[]>([]);

  const fetchPagesContent = useCallback(async () => {
    let pageToFetch: string | undefined;
    for (const page of pagesList) {
      const pageId = page.id;
      if (pagesContentData.every((pageContentData) => pageContentData.pageId !== pageId)) {
        pageToFetch = pageId;
      }
    }

    if (pageToFetch) {
      const pageContentData = await apiService.getPageContent(pageToFetch);
      setPagesContentData((oldPagesContentData) => [...oldPagesContentData, pageContentData]);
    }
  }, [pagesList, pagesContentData]);

  useEffect(() => {
    fetchPagesContent();
  }, [pagesList, fetchPagesContent]);

  const pages = useMemo<PageGridItemData[]>(() => {
    const pagesData = [];
    for (const pageListItem of pagesList) {
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
  }, [pagesList, pagesContentData]);

  return (
    <>
      <div className="navbar bg-base-100">
        <span className="font-bold normal-case text-xl px-4">Pages</span>
      </div>
      {isLoadingPages ? (
        <div className="h-full w-full grid place-items-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-x-4 gap-y-12 p-4">
          {pages &&
            pages.map(({ page, preview }, index) => (
              <PageGridItem key={`${index}_${Date.now()}`} page={page} preview={preview} />
            ))}
        </div>
      )}
    </>
  );
}
