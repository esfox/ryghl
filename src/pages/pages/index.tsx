import { PageGridItem } from '@/components/PageGridItem';
import { apiService } from '@/services/api.service';
import { PageType } from '@/types';

import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function Pages() {
  const { data: pages, isFetching: isLoadingPages } = useQuery({
    queryKey: ['pages'],
    queryFn: () => apiService.getPages(),
    initialData: [],
    refetchOnWindowFocus: false,
  });

  const { refetch: fetchPagePreviews, data: pagePreviews } = useQuery({
    queryKey: ['page_previews', pages],
    queryFn: () => {
      const pageIds = pages.map(({ id }) => id);
      return apiService.getPagePreviews(pageIds);
    },
    enabled: false,
    initialData: [],
    retry: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);

  useEffect(() => {
    if (pages.length !== 0) {
      fetchPagePreviews();
    }
  }, [pages, fetchPagePreviews]);

  const pageGridData = useMemo<PageType[]>(() => {
    const pagesData = [];
    for (const pageItem of pages) {
      const pagePreview = pagePreviews.find(({ id }) => pageItem.id === id);
      const pageData: PageType = { ...pageItem, previewImage: pagePreview?.previewImage };
      pagesData.push(pageData);
    }
    return pagesData;
  }, [pages, pagePreviews]);

  return (
    <>
      <Head>
        <title>Pages</title>
      </Head>
      {isLoading && (
        <div className="fixed w-full h-full grid place-items-center bg-white/60 z-[1000]">
          <span className="w-16 h-16 loading loading-dots"></span>
        </div>
      )}
      <div className="navbar flex justify-between px-4">
        <span className="font-bold normal-case text-xl px-2">Pages</span>
        <Link href="/pages/new">
          <button className="btn btn-primary btn-sm px-6">New Page</button>
        </Link>
      </div>
      {isLoadingPages && (
        <div className="h-full w-full grid place-items-center">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}
      {!isLoadingPages && pageGridData.length === 0 && (
        <h3 className="text-lg text-neutral-400 text-center py-12">No pages saved</h3>
      )}
      {!isLoadingPages && pageGridData.length !== 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-12 p-4">
          {pageGridData &&
            pageGridData.map((page, index) => (
              <PageGridItem key={`${index}_${Date.now()}`} page={page} onClick={showLoading} />
            ))}
        </div>
      )}
    </>
  );
}
