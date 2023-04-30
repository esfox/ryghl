import { PageType } from '@/types';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

type PageGridItemProps = {
  page: PageType;
  preview?: string;
};

export const PageGridItem: React.FC<PageGridItemProps> = ({ page, preview }) => {
  const { title } = page;
  return (
    <div className="grid place-items-center">
      <div
        className="w-[10rem] h-[15rem] shadow-md bg-white overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
        role="button"
      >
        {preview ? (
          <Image src={preview} alt="preview" width={160} height={240} className="p-4" />
        ) : (
          <div className="p-6">
            <SkeletonTheme baseColor="#eaeaea" highlightColor="#eaeaea">
              <Skeleton count={7} containerClassName="w-full" />
            </SkeletonTheme>
          </div>
        )}
      </div>
      <Link href={`/pages/${page.id}`} className="mt-5">
        {title}
      </Link>
    </div>
  );
};
