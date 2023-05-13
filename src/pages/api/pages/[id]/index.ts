import { pagesService } from '@/services/pages.service';
import { PageContentDataType } from '@/types';

import { ResponseCodes } from 'http-constants-ts';
import { convert2img } from 'mdimg';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  const pageId = query.id;
  if (!pageId || typeof pageId !== 'string') {
    return response.status(ResponseCodes.BAD_REQUEST).send('Bad Request');
  }

  const file = await pagesService.get(pageId);
  const content = await file.text();

  const { withPreview } = query;
  const responseData: PageContentDataType = {
    pageId,
    content,
  };

  if (withPreview !== undefined && withPreview !== 'false') {
    const { data } = await convert2img({
      mdText: content || '‍',
      width: 300,
      height: 500,
      encoding: 'base64',
      cssTemplate: 'empty',
    });

    responseData.preview = `data:image/png;base64, ${data}`;
  }

  response.send(responseData);
}
