import { SESSION_EXPIRES_IN } from '@/constants';
import { readKeyValuePair, writeKeyValuePair } from '@/utils/cloudflare.util';

import { randomUUID } from 'crypto';

export async function createSession() {
  const sessionId = randomUUID();
  await writeKeyValuePair(sessionId, new Date().toISOString(), {
    expiresInSeconds: Number(SESSION_EXPIRES_IN),
  });
  return sessionId;
}

export function checkSession(sessionId: string) {
  return readKeyValuePair<string>(sessionId);
}
