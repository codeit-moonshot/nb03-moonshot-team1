import type { RequestHandler } from 'express';
import forwardZodError from '#utils/zod';
import { userUpdateSchema } from '#modules/users/dto/user.dto';

const validateUpdateMyInfo: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = {
      email: req.body.email,
      name: req.body.name,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      profileImage: req.body.profileImage,
    };
    await userUpdateSchema.parseAsync(parsedBody);
    next();
  } catch (err) {
    forwardZodError(err, '사용자 업데이트', next);
  }
};

export default {
  validateUpdateMyInfo,
};
