import { GLOBAL_PASSWORD } from '@/constants';
import { signJwt } from '@/utils/jwt.util';
import { createSession } from '@/utils/sessions.util';

import { Methods, ResponseCodes } from 'http-constants-ts';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== Methods.POST) {
    return response.status(ResponseCodes.METHOD_NOT_ALLOWED).send('Method Not Allowed');
  }

  const passwordInput = request.body.password;
  if (passwordInput !== GLOBAL_PASSWORD) {
    return response.status(ResponseCodes.UNAUTHORIZED).send('Unauthorized');
  }

  const sessionId = await createSession();
  const sessionToken = await signJwt({ sessionId });
  response.send({ sessionToken });
}
