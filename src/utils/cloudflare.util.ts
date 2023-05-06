/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_KEY,
  CLOUDFLARE_KV_NAMESPACE_ID,
  CLOUDFLARE_ACCESS_KEY_ID,
  CLOUDFLARE_SECRET_ACCESS_KEY,
  CLOUDFLARE_R2_BUCKET,
} from '@/constants';

import { kv as kvClient } from 'cloudflare-client';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import R2 from 'cloudflare-r2';

const kvNamespace = kvClient({
  accountId: CLOUDFLARE_ACCOUNT_ID,
  accessToken: CLOUDFLARE_API_KEY,
}).namespace(CLOUDFLARE_KV_NAMESPACE_ID);

const r2 = new R2({
  accessKey: CLOUDFLARE_ACCESS_KEY_ID,
  secretKey: CLOUDFLARE_SECRET_ACCESS_KEY,
  accountId: CLOUDFLARE_ACCOUNT_ID,
  region: 'auto',
});

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

export async function getObject(key: string) {
  const response = await r2.getObject({ bucket: CLOUDFLARE_R2_BUCKET, key });
  return response.text();
}

export async function putObject(key: string, content: string) {
  const response = await r2.putObject({ bucket: CLOUDFLARE_R2_BUCKET, key, body: content });
  return response.text();
}
