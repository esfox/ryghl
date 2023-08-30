import { PageType } from '@/types';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

type PageGridItemProps = {
  page: PageType;
  onClick?: () => void;
};

export const PageGridItem: React.FC<PageGridItemProps> = ({ page, onClick }) => {
  const { id, title, previewImage } = page;

  const onClickHandler = onClick ?? (() => {});

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
        onClick={onClickHandler}
      >
        {previewImage ? (
          <Image src={previewImage} alt="preview" width={160} height={240} className="p-3" />
        ) : (
          <div className="p-6">
            <SkeletonTheme baseColor="#eaeaea" highlightColor="#dadada">
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
          <i className="fa-solid fa-pen" />
        </Link>
      </Link>
      <Link
        href={`/pages/${id}`}
        className="w-40 text-center truncate mt-5"
        title={title}
        onClick={onClickHandler}
      >
        {title}
      </Link>
    </div>
  );
};
