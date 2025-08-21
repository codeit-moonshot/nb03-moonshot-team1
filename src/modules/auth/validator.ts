import type { RequestHandler } from 'express';
import { z } from 'zod';
import { authCreateSchema } from '#modules/auth/dto/register.dto';
import { loginSchema } from '#modules/auth/dto/login.dto';
import ApiError from '#errors/ApiError';

const validateAuthRegister: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      profileImage: req.body.profileImage
    }
    await authCreateSchema.parseAsync(parsedBody);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(ApiError.badRequest(`사용자 등록 유효성 검사 실패: ${messages}`));
    } else {
      next(err);
    }
  }
};

const validateAuthLogin: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = {
      email: req.body.email,
      password: req.body.password
    }
    await loginSchema.parseAsync(parsedBody);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(ApiError.badRequest(`사용자 로그인 유효성 검사 실패: ${messages}`));
    } else {
      next(err);
    }
  }
};

export default {
  validateAuthRegister,
  validateAuthLogin
}