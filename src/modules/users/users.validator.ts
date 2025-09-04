// #modules/users/users.validator.ts
import type { RequestHandler } from 'express';
import forwardZodError from '#utils/zod';
import { userUpdateSchema } from '#modules/users/dto/user.dto';

const validateUpdateMyInfo: RequestHandler = async (req, _res, next) => {
  try {
    // body에 존재하는 키만 추출
    const allowed = ['email', 'name', 'currentPassword', 'newPassword', 'profileImage'] as const;
    const subset: Record<string, unknown> = {};

    for (const k of allowed) {
      if (!(k in req.body)) continue;
      const v = req.body[k];

      if ((k === 'currentPassword' || k === 'newPassword') && typeof v === 'string' && v.trim() === '') {
        continue;
      }

      subset[k] = v;
    }

    req.body = await userUpdateSchema.parseAsync(subset);
    next();
  } catch (err) {
    forwardZodError(err, '사용자 업데이트', next);
  }
};

export default { validateUpdateMyInfo };
