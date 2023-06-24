import { pagesService } from '@/services/pages.service';

import { ResponseCodes } from 'http-constants-ts';
import { NextRequest, NextResponse } from 'next/server';

type SavePageBody = {
  id?: string;
  title: string;
  content: string;
  previewImage?: string;
};

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: ResponseCodes.METHOD_NOT_ALLOWED,
    });
  }

  // TODO: Validate title and content
  const pageContent = await request.json();
  const result = await pagesService.save(pageContent as SavePageBody);
  return NextResponse.json(result);
}
