import { Methods, ResponseCodes } from 'http-constants-ts';

import type { NextApiRequest, NextApiResponse } from 'next';

const ablyApiKey = process.env.ABLY_API_KEY;

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== Methods.POST) {
    return response.status(ResponseCodes.METHOD_NOT_ALLOWED).send('Method Not Allowed');
  }

  // TODO: Implement session token validation

  return response.send(ablyApiKey);
}
