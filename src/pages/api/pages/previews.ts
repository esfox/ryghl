import { pagesService } from '@/services/pages.service';
import { PageType } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  let pageIds = query.ids as string[];
  if (!Array.isArray(pageIds)) {
    pageIds = [pageIds];
  }

  const result = await pagesService.getPreviews({ pageIds });
  const previews = [];
  for (let i = 0; i < result.length; i += 1) {
    const { signedUrl, error } = result[i];
    if (!signedUrl || error) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const previewData: Omit<PageType, 'title'> = {
      id: pageIds[i],
      previewImage: signedUrl,
    };

    previews.push(previewData);
  }

  response.send(previews);
}
