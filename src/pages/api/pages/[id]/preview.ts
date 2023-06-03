import { pagesService } from '@/services/pages.service';

import { ResponseCodes } from 'http-constants-ts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  const pageId = query.id;
  if (!pageId || typeof pageId !== 'string') {
    return response.status(ResponseCodes.BAD_REQUEST).send('Bad Request');
  }

  const [preview] = await pagesService.getPreviews({ pageTitles: [pageId] });
  const previewUrl = preview.signedUrl;
  if (!previewUrl) {
    return response.status(ResponseCodes.NOT_FOUND).send('Not found');
  }

  response.send({
    title: pageId,
    preview: previewUrl,
  });
}
