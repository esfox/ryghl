import { notion } from '@/utils/notion.utils';

import { ResponseCodes } from 'http-constants-ts';

import type { NextApiRequest, NextApiResponse } from 'next';

const defaults = {
  page: 1,
  countPerPage: 10,
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const query = request.query ?? {};

  // TODO: Add page

  let { countPerPage } = defaults;
  const queryCountPerPage = query.countPerPage;
  if (queryCountPerPage) {
    if (typeof queryCountPerPage !== 'number') {
      return response.status(ResponseCodes.BAD_REQUEST).send('Bad Request');
    }
    countPerPage = Number(queryCountPerPage);
  }

  try {
    const notionResponse = await notion.client.search({
      filter: {
        value: 'page',
        property: 'object',
      },
      page_size: countPerPage,
    });

    response.send(notionResponse);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    response.status(ResponseCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }
}
