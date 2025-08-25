import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '#errors/ApiError';
import env from '#config/env';

const ACCESS_SECRET = env.ACCESS_TOKEN_SECRET;

interface JwtPayload {
  id: number;
  email: string;
}

const getBearer = (h?: string) => (h?.startsWith('Bearer ') ? h.slice(7) : undefined);

/**
 * 인증 미들웨어
 * - Authorization: Bearer <token> 헤더를 검증하고, 유효하면 req.user에 페이로드를 주입합니다.
 *
 * @type {RequestHandler}
 * @example
 * import { Router } from 'express';
 * import { requireAuth } from '#middlewares/requireAuth';
 *
 * const router = Router();
 * router.get('/me', requireAuth, (req, res) => {
 *   // req.user 사용 가능 (types/express에서 확장)
 *   res.json({ success: true, data: { userId: req.user!.id } });
 * });
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = getBearer(req.headers.authorization);
  if (!token) return next(ApiError.unauthorized('❌ Token이 없습니다.'));

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(ApiError.unauthorized('❌ Token이 유효하지 않습니다.'));
  }
};
