import { config as load } from 'dotenv';
import { z } from 'zod';

load();

const trimTrailingSlash = (s: string) => s.replace(/\/+$/, '');

const schema = z.object({
  // DATABASE
  DATABASE_URL: z.string().url(),
  DATABASE_URL_DEV: z.string().url().optional(),

  // PORT
  PORT: z.coerce.number().int().positive().default(3000),
  FE_PORT: z.coerce.number().int().positive().optional(),

  // BASE URL
  BASE_URL: z.string().url(),
  BASE_URL_DEV: z.string().url().optional(),
  FRONT_URL: z.url(),

  // 파일 접근용 BASE URL (퍼블릭)
  FILE_BASE_URL: z.string().url().optional(),
  FILE_BASE_URL_DEV: z.string().url().optional(),

  // RUNTIME
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CORS_ORIGIN: z.string().default(''), // 콤마 구분자
  SESSION_SECRET: z.string().min(10),
  ACCESS_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  INVITATION_TOKEN_SECRET: z.string().min(10),
  UPLOAD_ROOT: z.string().default('./uploads'),

  // MAIL
  MAILSERVICE: z.enum(['gmail', 'naver']).default('gmail'),
  HOSTMAIL: z.string(),
  MAILPORT: z.coerce.number().int().positive().default(465), // 일반적으로 465 또는 587
  SMTP_USER: z.email(),
  SMTP_PASS: z.string().min(8), // SMTP 비밀번호

  // PEPPER
  PASSWORD_PEPPER: z.string().min(10),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  for (const i of parsed.error.issues) {
    console.error(`- ${i.path.join('.')}: ${i.message}`);
  }
  throw new Error('Invalid environment variables');
}

// 파싱된 값
const env = parsed.data;

export const IS_DEV = env.NODE_ENV === 'development';
export const IS_PROD = env.NODE_ENV === 'production';
export const IS_TEST = env.NODE_ENV === 'test';

/**
 * ENV 별 유효 URL 선택 + 정규화
 * DB URL 및 앱 베이스 URL
 */
export const DB_URL = trimTrailingSlash(IS_DEV && env.DATABASE_URL_DEV ? env.DATABASE_URL_DEV : env.DATABASE_URL);
export const APP_BASE_URL = trimTrailingSlash(IS_DEV && env.BASE_URL_DEV ? env.BASE_URL_DEV : env.BASE_URL);

/**
 * 파일 퍼블릭 베이스 URL (fallback: 빈 문자열)
 */
const rawFileBase = (IS_DEV && env.FILE_BASE_URL_DEV ? env.FILE_BASE_URL_DEV : env.FILE_BASE_URL) ?? '';
export const FILE_BASE_URL = rawFileBase ? trimTrailingSlash(rawFileBase) : '';

/**
 * 운영 환경에서 퍼블릭 파일 URL 미설정 시에 경고 출력
 */
if (IS_PROD && !FILE_BASE_URL) {
  console.warn('⚠️  FILE_BASE_URL is empty in production. Public file URLs may be broken.');
}

/**
 * CORS 오리진 배열 파생 값
 * - 'http://a.com,https://b.com' -> ['http://a.com', 'https://b.com']
 */
export const CORS_ORIGINS = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

/**
 * 메일 서비스: 콤마 리스트 지원
 */
export const MAIL_SERVICES = env.MAILSERVICE.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export default env;
