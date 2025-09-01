import { subtaskCreateSchema, subtaskUpdateSchema } from '#modules/subtasks/dto/subtasks.dto';
import type { RequestHandler } from 'express';
import forwardZodError from '#utils/zod';

const validateSubtaskCreate: RequestHandler = (req, _res, next) => {
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

const validateSubtaskUpdate: RequestHandler = (req, _res, next) => {
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

export default {
  validateSubtaskCreate,
  validateSubtaskUpdate,
};
