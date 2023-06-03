import { pagesService } from '@/services/pages.service';
import { PageType, PagesQueryType } from '@/types';

import { ResponseCodes } from 'http-constants-ts';

import type { NextApiRequest, NextApiResponse } from 'next';

const defaults = {
  page: 1,
  countPerPage: 10,
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<string | PageType[]>
) {
  const query: PagesQueryType = request.query ?? {};

  let pageNumber = query.page ?? defaults.page;
  if (pageNumber) {
    pageNumber = 1;
  }

  let countPerPage = query.countPerPage ?? defaults.countPerPage;
  if (countPerPage) {
    if (typeof countPerPage !== 'number' || countPerPage < 0) {
      return response.status(ResponseCodes.BAD_REQUEST).send('Bad Request');
    }

    countPerPage = Number(countPerPage);
  }

  const { search } = query;

  const files = await pagesService.list({ page: pageNumber, countPerPage, search });
  const pages = [];
  for (const { name } of files) {
    if (name === '.emptyFolderPlaceholder') {
      // eslint-disable-next-line no-continue
      continue;
    }

    const page: PageType = {
      id: name,
      title: name,
    };

    pages.push(page);
  }

  response.json(pages);
}
