import { apiService } from '@/services/api.service';
import { PageContentDataType } from '@/types';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export function usePages() {
  const {
    refetch: fetchPages,
    data: pages,
    isLoading: isFetchingPages,
    error: fetchPagesError,
  } = useQuery({
    queryKey: ['pages'],
    queryFn: () => apiService.getPages(),
    enabled: false,
    initialData: [],
  });

  const [pagesContent, setPagesContentData] = useState<PageContentDataType[]>([]);

  const fetchPagesContent = useCallback(
    async (withPreview?: boolean) => {
      let pageToFetch: string | undefined;
      for (const page of pages) {
        const pageId = page.id;
        if (pagesContent.every((pageContentData) => pageContentData.pageId !== pageId)) {
          pageToFetch = pageId;
        }
      }

      if (pageToFetch) {
        const pageContentData = await apiService.getPageContent(pageToFetch, { withPreview });
        setPagesContentData((oldPagesContentData) => [...oldPagesContentData, pageContentData]);
      }
    },
    [pages, pagesContent]
  );

  const [currentPageContent, setCurrentPageContent] = useState<PageContentDataType>();
  const [isLoadingCurrentPageContent, setIsLoadingCurrentPageContent] = useState(false);
  const fetchPageContent = useCallback(
    async (pageId: string) => {
      setIsLoadingCurrentPageContent(true);

      const pageContent = pagesContent.find((pageContentData) => pageContentData.pageId === pageId);

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
    [pagesContent]
  );

  const {
    mutateAsync: savePage,
    isLoading: isSavingPage,
    error: savePageError,
  } = useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      apiService.savePage(title, content),
  });

  return {
    pages,
    fetchPages,
    isFetchingPages,
    fetchPagesError,

    pagesContent,
    fetchPagesContent,

    currentPageContent,
    fetchPageContent,
    isLoadingCurrentPageContent,

    savePage,
    isSavingPage,
    savePageError,
  };
}
