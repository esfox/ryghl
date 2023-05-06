import { apiService } from '@/services/api.service';
import { PageContentDataType } from '@/types';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export function usePages() {
  const {
    refetch: fetchPages,
    data: pages,
    isLoading: isLoadingPages,
    // error: pagesError,
  } = useQuery({
    queryKey: ['pages'],
    queryFn: () => apiService.getPages(),
    enabled: false,
    initialData: [],
  });

  const [pagesContentData, setPagesContentData] = useState<PageContentDataType[]>([]);

  const fetchPagesContent = useCallback(
    async (withPreview?: boolean) => {
      let pageToFetch: string | undefined;
      for (const page of pages) {
        const pageId = page.id;
        if (pagesContentData.every((pageContentData) => pageContentData.pageId !== pageId)) {
          pageToFetch = pageId;
        }
      }

      if (pageToFetch) {
        const pageContentData = await apiService.getPageContent(pageToFetch, { withPreview });
        setPagesContentData((oldPagesContentData) => [...oldPagesContentData, pageContentData]);
      }
    },
    [pages, pagesContentData]
  );

  const [currentPageContent, setCurrentPageContent] = useState<PageContentDataType>();
  const [isLoadingCurrentPageContent, setIsLoadingCurrentPageContent] = useState(false);
  const fetchPageContent = useCallback(
    async (pageId: string) => {
      setIsLoadingCurrentPageContent(true);

      const pageContent = pagesContentData.find(
        (pageContentData) => pageContentData.pageId === pageId
      );

      if (pageContent) {
        setCurrentPageContent(pageContent);
        setIsLoadingCurrentPageContent(false);
        return;
      }

      /* Fetch the page content when it is not yet fetched */
      const pageContentResponse = await apiService.getPageContent(pageId);
      setCurrentPageContent(pageContentResponse);
      setIsLoadingCurrentPageContent(false);
    },
    [pagesContentData]
  );

  const { mutate: savePage, isLoading: isSavingPage } = useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      apiService.savePage(title, content),
  });

  return {
    pages,
    pagesContentData,
    isLoadingPages,

    currentPageContent,
    isLoadingCurrentPageContent,

    fetchPages,
    fetchPagesContent,
    fetchPageContent,

    savePage,
    isSavingPage,
  };
}
