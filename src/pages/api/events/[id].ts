import { eventsService } from '@/services/events.service';

import { ResponseCodes } from 'http-constants-ts';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  switch (request.method) {
    case 'DELETE': {
      // TODO: Validate
      const params = new URLSearchParams(request.nextUrl.search);
      const eventId = params.get('id');
      if (!eventId) {
        return new Response('Bad request', {
          status: ResponseCodes.BAD_REQUEST,
        });
      }

      const result = await eventsService.remove(eventId);
      return NextResponse.json(result);
    }

    default: {
      return new Response('Method not allowed', {
        status: ResponseCodes.METHOD_NOT_ALLOWED,
      });
    }
  }
}
