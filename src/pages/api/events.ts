import { eventsService } from '@/services/events.service';
import { SaveEventType } from '@/types';

import { ResponseCodes } from 'http-constants-ts';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: ResponseCodes.METHOD_NOT_ALLOWED,
    });
  }

  // TODO: Validate
  const eventData = await request.json();
  const result = await eventsService.save(eventData as SaveEventType);
  return NextResponse.json(result);
}
