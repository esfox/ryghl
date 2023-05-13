/* eslint-disable prefer-destructuring */
export const API_URL = process.env.API_URL ?? '';

export const GLOBAL_PASSWORD = process.env.GLOBAL_PASSWORD as string;
export const SESSION_EXPIRES_IN = Number(process.env.SESSION_EXPIRES_IN ?? 60 * 60 * 24 * 7);

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export const NOTION_INTEGRATION_SECRET = process.env.NOTION_INTEGRATION_SECRET as string;

export const ABLY_API_KEY = process.env.ABLY_API_KEY as string;

export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID as string;
export const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY as string;
export const CLOUDFLARE_KV_NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID as string;

export const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL as string;
export const SUPABASE_SERVICE_API_KEY = process.env.SUPABASE_SERVICE_API_KEY as string;
export const SUPABASE_DATABASE_PASSWORD = process.env.SUPABASE_DATABASE_PASSWORD as string;
export const SUPABASE_BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME as string;
