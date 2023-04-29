import { PageGridItem } from '@/components/PageGridItem';
import { useNotion } from '@/hooks/useNotion';

import { useEffectOnce } from 'react-use';

export default function Home() {
  const { fetchPages, pages, isLoadingPages } = useNotion();

  useEffectOnce(() => {
    fetchPages();
  });

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
            pages.map((page, index) => <PageGridItem key={`${index}_${Date.now()}`} page={page} />)}
        </div>
      )}
    </>
  );
}
