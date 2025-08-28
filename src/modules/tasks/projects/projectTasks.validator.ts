import type { RequestHandler } from 'express';
import ApiError from '#errors/ApiError';
import forwardZodError from '#utils/zod';
/**
 * TODO: 경로 및 import 양식 수정
 */
import {
  projectIdParamsSchema,
  createTaskBodySchema,
  listProjectTasksQuerySchema,
} from '#modules/tasks/projects/dto/projects-tasks.dto';
const validateProjectId: RequestHandler = (req, res, next) => {
  const parsed = projectIdParamsSchema.safeParse(req.params);
  if (!parsed.success) return next(ApiError.badRequest('잘못된 요청 형식'));
  res.locals.projectId = parsed.data.projectId;
  next();
};

const validateCreateTaskBody: RequestHandler = (req, res, next) => {
  try {
    res.locals.createBody = createTaskBodySchema.parse(req.body);
    next();
  } catch (err) {
    return forwardZodError(err, '할 일 등록', next);
  }
};

const validateListQuery: RequestHandler = (req, res, next) => {
  try {
    res.locals.listQuery = listProjectTasksQuerySchema.parse(req.query);
    next();
  } catch (err) {
    return forwardZodError(err, '할 일 목록 조회', next);
  }
};

export default {
  validateProjectId,
  validateCreateTaskBody,
  validateListQuery,
};
