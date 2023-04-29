import { checkSession } from '@/data/sessions';

import { Methods, ResponseCodes } from 'http-constants-ts';
import jwt from 'jsonwebtoken';

import type { NextApiRequest, NextApiResponse } from 'next';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('No JWT Secret');
}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (!jwtSecret) {
    return response.status(ResponseCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }

  if (request.method !== Methods.POST) {
    response.status(ResponseCodes.METHOD_NOT_ALLOWED).send('Method Not Allowed');
  }

  const sessionToken = request.headers.authorization;
  if (!sessionToken) {
    return response.status(ResponseCodes.UNAUTHORIZED).send('Unauthorized');
  }
  const sessionTokenPayload = jwt.verify(sessionToken, jwtSecret) as { sessionId: string };
  const { sessionId } = sessionTokenPayload;
  const isValidSession = checkSession(sessionId);
  if (isValidSession) {
    return response.status(ResponseCodes.OK).send('');
  }

  response.status(ResponseCodes.UNAUTHORIZED).send('Unauthorized');
}
