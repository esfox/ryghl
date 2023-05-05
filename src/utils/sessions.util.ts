import { readKeyValuePair, writeKeyValuePair } from '@/utils/cloudflare.util';

import { randomUUID } from 'crypto';

const sessionExpiresIn = process.env.SESSION_EXPIRES_IN || 60 * 60 * 24 * 7;

export async function createSession() {
  const sessionId = randomUUID();
  await writeKeyValuePair(sessionId, new Date().toISOString(), {
    expiresInSeconds: Number(sessionExpiresIn),
  });
  return sessionId;
}

export function checkSession(sessionId: string) {
  return readKeyValuePair<string>(sessionId);
}
