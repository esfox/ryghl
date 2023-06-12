import { pagesService } from '@/services/pages.service';

import { ResponseCodes } from 'http-constants-ts';

import type { NextApiRequest, NextApiResponse } from 'next';

type SavePageBody = {
  id?: string;
  title: string;
  content: string;
  previewImage?: string;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'POST') {
    return response.status(ResponseCodes.METHOD_NOT_ALLOWED).send('Method not allowed');
  }

  // TODO: Validate title and content
  const result = await pagesService.save(request.body as SavePageBody);
  response.send(result);
}
