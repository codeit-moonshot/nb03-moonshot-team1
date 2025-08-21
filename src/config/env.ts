import { config as load } from 'dotenv';
import { z } from 'zod';

load();

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

  // RUNTIME
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CORS_ORIGIN: z.string().default(''), // 콤마 구분자
  SESSION_SECRET: z.string().min(10),
  ACCESS_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  UPLOAD_ROOT: z.string().default('./uploads'),

  MAILSERVICE: z.enum(['google', 'naver']).default('google'),
  HOSTMAIL: z.string(),
  MAILPORT: z.number().int().positive().default(465), // 일반적으로 465 또는 587
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(8), // SMTP 비밀번호
  PASSWORD_PEPPER: z.string().min(10),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  parsed.error.issues.forEach((i) => {
    console.error(`- ${i.path.join('.')}: ${i.message}`);
  });
  throw new Error('Invalid environment variables');
}

// 파싱된 값
const env = parsed.data;

/**
 * CORS 오리진 배열 파생 값
 * - 'http://a.com,https://b.com' -> ['http://a.com', 'https://b.com']
 */
export const CORS_ORIGINS = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

export default env;
