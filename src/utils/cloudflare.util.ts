import { kv as kvClient } from 'cloudflare-client';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiKey = process.env.CLOUDFLARE_API_KEY;
const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
if (!accountId || !apiKey || !namespaceId) {
  throw new Error('Missing Cloudflare environment variables');
}

const kvNamespace = kvClient({
  accountId,
  accessToken: apiKey,
}).namespace(namespaceId);

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
