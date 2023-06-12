import { PageType } from '@/types';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

type PageGridItemProps = {
  page: PageType;
};

export const PageGridItem: React.FC<PageGridItemProps> = ({ page }) => {
  const { id, title, previewImage } = page;

  return (
    <div className="grid place-items-center">
      <Link
        href={`/pages/${id}`}
        className="
          w-[10rem] h-[15rem]
          relative group mt-5
          shadow-md bg-white overflow-hidden cursor-pointer
          hover:shadow-xl hover:scale-105
          transition-transform
        "
        tabIndex={0}
      >
        {previewImage ? (
          <Image src={previewImage} alt="preview" width={160} height={240} className="p-3" />
        ) : (
          <div className="p-6">
            <SkeletonTheme baseColor="#eaeaea" highlightColor="#eaeaea">
              <Skeleton count={7} containerClassName="w-full" />
            </SkeletonTheme>
          </div>
        )}
        <Link
          href={`/pages/${id}/edit`}
          className="
            btn btn-secondary btn-square btn-sm
            absolute hidden top-0 right-0 m-2
            group-hover:grid
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
          </svg>
        </Link>
      </Link>
      <Link href={`/pages/${id}`} className="w-40 text-center truncate mt-5" title={title}>
        {title}
      </Link>
    </div>
  );
};
