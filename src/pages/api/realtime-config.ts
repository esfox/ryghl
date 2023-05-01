import { Methods, ResponseCodes } from 'http-constants-ts';

import { randomUUID } from 'crypto';

import type { NextApiRequest, NextApiResponse } from 'next';

const ablyApiKey = process.env.ABLY_API_KEY;

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== Methods.POST) {
    return response.status(ResponseCodes.METHOD_NOT_ALLOWED).send('Method Not Allowed');
  }

  // TODO: Implement session token validation

  /* Generate a unique client ID for one instance, which is used to determine
    which client is which in handling realtime on the client-side */
  const clientId = randomUUID();

  return response.send({
    clientId,
    apiKey: ablyApiKey,
  });
}
