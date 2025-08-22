import type { RequestHandler } from 'express';
import prisma from '#prisma/prisma';
import ApiError from '#errors/ApiError';

/**
 * 프로젝트 소유자 권한 미들웨어
 * - :projectId 파라미터를 읽어 해당 프로젝트의 owner인지 검증합니다.
 *
 * @type {RequestHandler}
 * @example
 * import { Router } from 'express';
 * import { requireAuth } from '#middlewares/requireAuth';
 * import { requireOwner } from '#middlewares/requireOwner';
 *
 * const router = Router();
 * router.patch('/:projectId', requireAuth, requireOwner, async (req, res) => {
 *   // 소유자만 접근 가능
 *   res.json({ success: true });
 * });
 */
export const requireOwner: RequestHandler = async (req, _res, next) => {
  const projectId = Number(req.params.projectId);
  if (!projectId) return next(ApiError.badRequest('❌ 프로젝트 ID가 유효하지 않습니다.'));

  const uid = req.user?.id;
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!project) return next(ApiError.badRequest('❌ 존재하지 않는 프로젝트입니다.'));
  if (project.ownerId !== uid) return next(ApiError.forbidden('❌ 프로젝트 소유자만 할 수 있는 작업입니다.'));

  next();
};
