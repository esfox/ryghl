import { JWT_EXPIRES_IN, JWT_SECRET } from '@/constants';

import { JWTPayload, SignJWT, jwtVerify } from 'jose';

function getEncodedSecret() {
  return new TextEncoder().encode(JWT_SECRET);
}

export function signJwt(data: JWTPayload) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const token = new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuedAt(issuedAt)
    .setNotBefore(issuedAt)
    .sign(getEncodedSecret());

  return token;
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, getEncodedSecret());
  return payload;
}
