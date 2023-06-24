import { pagesService } from '@/services/pages.service';
import { PageType } from '@/types';

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const pageIds = query.getAll('ids');
  const result = await pagesService.getPreviews({ pageIds });
  const previews: Omit<PageType, 'title'>[] = [];
  for (let i = 0; i < result.length; i += 1) {
    const { signedUrl, error } = result[i];
    if (signedUrl && !error) {
      previews.push({
        id: pageIds[i],
        previewImage: signedUrl,
      });
    }
  }

  return NextResponse.json(previews);
}
