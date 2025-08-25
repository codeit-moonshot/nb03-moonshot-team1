import { z } from 'zod';
import type { RequestHandler } from 'express';
import forwardZodError from '#utils/zod';

const subtaskCreateSchema = z.object({
  title: z.string().min(1, '하위 할 일을 작성해 주세요.').max(20, '더는 작성할 수 업습니다.'),
  taskId: z
    .number('아이디는 숫자로 입력해 주세요.')
    .int('아이디는 정수로 입력해 주세요.')
    .nonnegative('아이디를 작성해 주세요.'),
});

export const validateSubtaskCreate: RequestHandler = (req, _res, next) => {
  const parsedBody = {
    title: req.body.title,
    taskId: Number(req.params.taskId),
  };

  try {
    subtaskCreateSchema.parse(parsedBody);
    next();
  } catch (err) {
    return forwardZodError(err, '하위 할 일 등록', next);
  }
};
