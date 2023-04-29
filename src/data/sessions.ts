import { randomUUID } from 'crypto';

const sessionIds: string[] = [];

export function createSession() {
  const sessionId = randomUUID();
  sessionIds.push(sessionId);
  return sessionId;
}

export function checkSession(sessionId: string) {
  return sessionIds.includes(sessionId);
}
