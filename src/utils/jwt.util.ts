import { JWT_SECRET } from '@/constants/env';

import { jwtVerify } from 'jose';

function getEncodedSecret() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, getEncodedSecret());
  return payload;
}
