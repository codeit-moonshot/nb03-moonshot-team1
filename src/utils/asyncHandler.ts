import { RequestHandler } from 'express';

/**
 * 비동기 라우터 핸들러의 에러를 자동으로 next()에 전달하는 헬퍼함수입니다.
 *
 * @param {RequestHandler} fn - 비동기 라우터 핸들러
 * @returns {RequestHandler} - 에러를 next()로 넘겨주는 래퍼
 *
 * @example
 * // controller.ts
 * export const create: RequestHandler = async (req, res) => {
 *   const { name } = req.body;
 *   const project = await projectService.create({ name });
 *   res.status(201).json({ success: true, data: project });
 * };
 *
 * // router.ts
 * import { Router } from 'express';
 * import { asyncHandler } from '#utils/asyncHandler';
 * import { requireAuth } from '#middlewares/requireAuth';
 * import * as controller from './controller';
 *
 * const router = Router();
 *
 * router.post(
 *   '/',
 *   requireAuth,
 *   asyncHandler(controller.create)
 * );
 *
 * export default router;
 */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
