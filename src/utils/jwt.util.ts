import { JWTPayload, SignJWT, jwtVerify } from 'jose';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('No JWT Secret');
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

function getEncodedSecret() {
  return new TextEncoder().encode(jwtSecret);
}

export function signJwt(data: JWTPayload) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const token = new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(jwtExpiresIn)
    .setIssuedAt(issuedAt)
    .setNotBefore(issuedAt)
    .sign(getEncodedSecret());

  return token;
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, getEncodedSecret());
  return payload;
}
