import { createSession } from '@/data/sessions';

import { Methods, ResponseCodes } from 'http-constants-ts';
import jwt from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next';

const password = process.env.RYGHLTMFFKDLEM_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;
const jwtValidityPeriod = process.env.JWT_VALIDITY_PERIOD || '7d';

if (!jwtSecret) {
  throw new Error('No JWT Secret');
}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!jwtSecret) {
    return response.status(ResponseCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }

  if (request.method !== Methods.POST) {
    return response.status(ResponseCodes.METHOD_NOT_ALLOWED).send('Method Not Allowed');
  }

  const passwordInput = request.body.password;
  if (passwordInput !== password) {
    return response.status(ResponseCodes.UNAUTHORIZED).send('Unauthorized');
  }

  const sessionId = createSession();
  const sessionToken = jwt.sign({ sessionId }, jwtSecret, {
    expiresIn: jwtValidityPeriod,
  });

  response.send({ sessionToken });
}
