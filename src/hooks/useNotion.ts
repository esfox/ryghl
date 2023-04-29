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
      return results;
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
