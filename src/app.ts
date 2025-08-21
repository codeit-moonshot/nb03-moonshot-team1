import dotenv from 'dotenv';
import fs from 'fs';

/**
 * env 로드
 */
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
if (fs.existsSync(envPath)) dotenv.config({ path: envPath });
else dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import path from 'path';

import routes from '#routes/index';
import { errorHandler } from '#middlewares/errorHandler';
import ApiError from '#errors/ApiError';
import env, { CORS_ORIGINS } from '#config/env';

const app: Application = express();

/**
 * 보안/기본 세팅
 */
app.disable('x-powered-by'); // Express 노출 방지
app.set('etag', false); // ETag 비활성화

/**
 * Helmet 보안 헤더 (CSP 포함)
 */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

/**
 * Rate limit
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

/**
 * CORS (화이트리스트 기반)
 */
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (CORS_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/**
 * Body & Cookie 파서
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Session (쿠키 기반)
 */
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  })
);

/**
 * 정적 파일 (MIME 강제)
 */
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), env.UPLOAD_ROOT), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      }
    },
  })
);

/**
 * Routes
 */
app.use('/api', routes);

/**
 * 404 핸들러
 */
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Not Found - ${req.originalUrl}`));
});

/**
 * 글로벌 에러 핸들러
 */
app.use(errorHandler);

export default app;
