import { PageGridItem } from '@/components/PageGridItem';
import { apiService } from '@/services/api.service';
import { PageType } from '@/types';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useEffectOnce } from 'react-use';

export default function Pages() {
  const {
    refetch: fetchPages,
    data: pages,
    isLoading: isLoadingPages,
  } = useQuery({
    queryKey: ['pages'],
    queryFn: () => apiService.getPages(),
    enabled: false,
    initialData: [],
  });

  const { refetch: fetchPagePreviews, data: pagePreviews } = useQuery({
    queryKey: ['page_previews', pages],
    queryFn: async () => {
      const previewPromises = pages.map(({ title }) => apiService.getPagePreview(title));
      const result = await Promise.allSettled(previewPromises);
      const previews = [];
      for (const item of result) {
        if (item.status === 'fulfilled') {
          previews.push(item.value);
        }
      }

      return previews;
    },
    enabled: false,
    initialData: [],
    retry: false,
  });

  useEffectOnce(() => {
    fetchPages();
  });

  useEffect(() => {
    if (pages.length !== 0) {
      fetchPagePreviews();
    }
  }, [pages, fetchPagePreviews]);

  const pageGridData = useMemo<PageType[]>(() => {
    const pagesData = [];
    for (const pageItem of pages) {
      const pagePreview = pagePreviews.find(({ title }) => pageItem.id === title);
      const pageData: PageType = { ...pageItem, preview: pagePreview?.preview };
      pagesData.push(pageData);
    }
    return pagesData;
  }, [pages, pagePreviews]);

  return (
    <>
      <div className="navbar bg-base-100 flex justify-between px-4">
        <span className="font-bold normal-case text-xl px-2">Pages</span>
        <Link href="/pages/new">
          <button className="btn btn-primary btn-sm px-6">New Page</button>
        </Link>
      </div>
      {isLoadingPages ? (
        <div className="h-full w-full grid place-items-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-x-4 gap-y-12 p-4">
          {pageGridData &&
            pageGridData.map((page, index) => (
              <PageGridItem key={`${index}_${Date.now()}`} page={page} />
            ))}
        </div>
      )}
    </>
  );
}
