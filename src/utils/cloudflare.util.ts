import { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_KEY, CLOUDFLARE_KV_NAMESPACE_ID } from '@/constants';

import { kv as kvClient } from 'cloudflare-client';

const kvNamespace = kvClient({
  accountId: CLOUDFLARE_ACCOUNT_ID,
  accessToken: CLOUDFLARE_API_KEY,
}).namespace(CLOUDFLARE_KV_NAMESPACE_ID);

export function readKeyValuePair<T>(key: string): Promise<T | undefined> {
  return kvNamespace.get(key, { decode: false });
}

export function writeKeyValuePair(
  key: string,
  value: unknown,
  options?: { expiresInSeconds?: number }
) {
  const { expiresInSeconds } = options || {};
  const kvOptions: { encode?: false; expiresTtl?: number } = {};
  if (typeof value !== 'object') {
    kvOptions.encode = false;
  }

  if (!expiresInSeconds) {
    kvOptions.expiresTtl = expiresInSeconds;
  }

  return kvNamespace.set(key, value, kvOptions);
}
