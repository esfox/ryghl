import { pagesService } from '@/services/pages.service';
import { PageType } from '@/types';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { query } = request;
  const pageTitles = query.titles as string[];

  const result = await pagesService.getPreviews({ pageTitles });
  const previews = [];
  for (let i = 0; i < result.length; i += 1) {
    const { signedUrl, error } = result[i];
    if (!signedUrl || error) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const previewData: Omit<PageType, 'id'> = {
      title: pageTitles[i],
      preview: signedUrl,
    };

    previews.push(previewData);
  }

  response.send(previews);
}
