import { subtaskCreateSchema, subtaskUpdateSchema, subtaskDeleteSchema } from '#modules/subtasks/dto/subtasks.dto';
import type { RequestHandler } from 'express';
import forwardZodError from '#utils/zod';

export const validateSubtaskCreate: RequestHandler = (req, _res, next) => {
  try {
    const parsedBody = {
      title: req.body.title,
      taskId: Number(req.params.taskId),
    };
    subtaskCreateSchema.parse(parsedBody);
    next();
  } catch (err) {
    return forwardZodError(err, '하위 할 일 등록', next);
  }
};

export const validateSubtaskUpdate: RequestHandler = (req, _res, next) => {
  try {
    const parsedBody = {
      status: req.body.status,
      taskId: Number(req.params.taskId),
      subtaskId: Number(req.params.subtaskId),
    };
    subtaskUpdateSchema.parse(parsedBody);
    next();
  } catch (err) {
    return forwardZodError(err, '하위 할 일 수정', next);
  }
};

export const validateSubtaskDelete: RequestHandler = (req, _res, next) => {
  try {
    const parsedBody = {
      taskId: Number(req.params.taskId),
      subtaskId: Number(req.params.subtaskId),
    };
    subtaskDeleteSchema.parse(parsedBody);
    next();
  } catch (err) {
    return forwardZodError(err, '하위 할 일 삭제', next);
  }
};
