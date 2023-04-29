import { PageType } from '@/types';

import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface PageGridItemProps {
  page: PageType;
}

export const PageGridItem: React.FC<PageGridItemProps> = ({ page }) => {
  const { title } = page;
  return (
    <div className="grid place-items-center">
      <div className="w-[10rem] h-[15rem] shadow-lg">
        <div className="p-6">
          <SkeletonTheme baseColor="#dfdfdf" highlightColor="#d9d9d9">
            <Skeleton count={7} containerClassName="w-full" />
          </SkeletonTheme>
        </div>
      </div>
      <span className="mt-5">{title}</span>
    </div>
  );
};
