import { config as load } from 'dotenv';
import { z } from 'zod';

load();

/**
 * 유틸
 */
const trimTrailingSlash = (s: string) => s.replace(/\/+$/, '');
const trimLeadingSlash = (s: string) => s.replace(/^\/+/, '');
const joinUrl = (a: string, b: string) => `${trimTrailingSlash(a)}/${trimLeadingSlash(b)}`;

const schema = z.object({
  // DATABASE
  DATABASE_URL: z.string().url(),
  DATABASE_URL_DEV: z.string().url().optional(),

  // PORT
  PORT: z.coerce.number().int().positive().default(3001),
  FE_PORT: z.coerce.number().int().positive().optional(),

  // API ORIGINS
  // API ORIGIN
  BASE_URL: z.string().url(),
  BASE_URL_DEV: z.string().url().optional(),

  // FRONT ORIGIN
  FRONT_URL: z.string().url(),
  FRONT_URL_DEV: z.string().url().optional(),

  // 파일 접근용 퍼블릭 BASE
  FILE_BASE_URL: z.string().url().optional(),
  FILE_BASE_URL_DEV: z.string().url().optional(),

  // RUNTIME
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CORS_ORIGIN: z.string().default(''),
  SESSION_SECRET: z.string().min(10),
  ACCESS_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  INVITATION_TOKEN_SECRET: z.string().min(10),
  UPLOAD_ROOT: z.string().default('./uploads'),
  PASSWORD_PEPPER: z.string().min(10),

  // MAIL
  MAILSERVICE: z.string().default('gmail'),
  HOSTMAIL: z.string(),
  MAILPORT: z.coerce.number().int().positive().default(465), // 일반적으로 465 또는 587
  SMTP_USER: z.email(),
  SMTP_PASS: z.string().min(8), // SMTP 비밀번호
  //GOOGLE
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  //TOKENCRYPTO
  TOKEN_ENCRYPT_KEY: z.string(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  for (const i of parsed.error.issues) console.error(`- ${i.path.join('.')}: ${i.message}`);
  throw new Error('Invalid environment variables');
}

const env = parsed.data;

// RUNTIME
export const IS_DEV = env.NODE_ENV === 'development';
export const IS_PROD = env.NODE_ENV === 'production';
export const IS_TEST = env.NODE_ENV === 'test';

// DB
export const DB_URL = trimTrailingSlash(IS_DEV && env.DATABASE_URL_DEV ? env.DATABASE_URL_DEV : env.DATABASE_URL);

// API ORIGIN
export const APP_ORIGIN = trimTrailingSlash(IS_DEV && env.BASE_URL_DEV ? env.BASE_URL_DEV : env.BASE_URL);

// FRONT ORIGIN
export const FRONT_ORIGIN = trimTrailingSlash(IS_DEV && env.FRONT_URL_DEV ? env.FRONT_URL_DEV : env.FRONT_URL);

// 파일 공개
const rawFileBase = (IS_DEV ? env.FILE_BASE_URL_DEV : env.FILE_BASE_URL) || joinUrl(APP_ORIGIN, 'uploads');

export const FILE_BASE_URL = trimTrailingSlash(rawFileBase);

if (IS_PROD && !FILE_BASE_URL) {
  console.warn('⚠️  FILE_BASE_URL is empty in production. Public file URLs may be broken.');
}

// CORS
export const CORS_ORIGINS = env.CORS_ORIGIN.split(',')
  .map((s) => s.trim())
  .filter(Boolean);
if (!CORS_ORIGINS.includes(FRONT_ORIGIN)) CORS_ORIGINS.push(FRONT_ORIGIN);

// MAIL
export const MAIL_SERVICES = env.MAILSERVICE.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const UPLOAD_ROOT = env.UPLOAD_ROOT;

export default env;
