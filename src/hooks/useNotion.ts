import { useQuery } from '@tanstack/react-query';

export function useNotion() {
  const {
    refetch: fetchPages,
    data: pages,
    isLoading: isLoadingPages,
    error: pagesError,
  } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => {
      const { results } = await fetch('/api/pages').then((response) => response.json());

      /* Map the notion pages to an instance of `PageType` */
      const pagesResult = [];
      for (const result of results) {
        const title = result.properties?.title?.title[0]?.text?.content ?? 'Untitled';
        pagesResult.push({
          title,
        });
      }

      return pagesResult;
    },
    enabled: false,
  });

  return {
    fetchPages,
    pages,
    isLoadingPages,
    pagesError,
  };
}
