import type { RequestHandler } from 'express';
import ApiError from '#errors/ApiError';
import forwardZodError from '#utils/zod';
import { z } from 'zod';

import { taskIdParamsSchema } from '#modules/tasks/dto/task-id.dto';
import { meTasksQuerySchema } from '#modules/tasks/dto/me-tasks.dto';
import { patchTaskBodySchema } from '#modules/tasks/dto/task.dto';

/**
 * /tasks/:taskId/attachments
 * body: { urls: string[] }
 */
const commitAttachmentsBodySchema = z.object({
  urls: z.array(z.string().url()).min(1),
});

/* -------------------------------------------------------------------------- */
/*                                  GET                                       */
/* -------------------------------------------------------------------------- */

/**
 * /tasks/:taskId 파라미터 검증
 */
const validateTaskId: RequestHandler = (req, res, next) => {
  const parsed = taskIdParamsSchema.safeParse(req.params);
  if (!parsed.success) return next(ApiError.badRequest('잘못된 요청 형식'));
  res.locals.taskId = parsed.data.taskId;
  next();
};

/**
 * /users/me/tasks 쿼리 검증
 */
const validateMeTasksQuery: RequestHandler = (req, res, next) => {
  try {
    res.locals.meTasksQuery = meTasksQuerySchema.parse(req.query);
    next();
  } catch (err) {
    return forwardZodError(err, '할 일 목록 조회', next);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 PATCH                                      */
/* -------------------------------------------------------------------------- */

/**
 * PATCH /tasks/:taskId 바디 검증
 */
const validatePatchTaskBody: RequestHandler = (req, res, next) => {
  try {
    res.locals.patchBody = patchTaskBodySchema.parse(req.body);
    next();
  } catch (err) {
    return forwardZodError(err, '할 일 수정', next);
  }
};

const validateCommitAttachmentsBody: RequestHandler = (req, res, next) => {
  try {
    res.locals.commitBody = commitAttachmentsBodySchema.parse(req.body);
    next();
  } catch (err) {
    return forwardZodError(err, '첨부 커밋', next);
  }
};

export default {
  validateTaskId,
  validateMeTasksQuery,
  validatePatchTaskBody,
  validateCommitAttachmentsBody,
};
