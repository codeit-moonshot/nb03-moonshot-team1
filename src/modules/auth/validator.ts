import { z } from 'zod';
import type { RequestHandler } from 'express';
import dns from 'dns/promises';
import ApiError from '@/errors/ApiError';

const emailWithMX = z.string().refine(async (email) => {
  const domain = email.split('@')[1];
  try{
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
}, {
  message: '유효한 이메일 주소가 아닙니다.'
});

const userCreateSchema = z.object({
  email: emailWithMX,
  name: z.string()
  .min(2, '이름은 최소 2자 이상이어야 합니다')
  .max(20, '이름은 최대 20자 이하여야 합니다')
  .regex(/^[a-zA-Z0-9가-힣]+$/, '이름에 특수문자는 사용할 수 없습니다.'),
  password: z.string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다').max(20, '비밀번호는 최대 20자 이하여야 합니다'),
  profileImage: z.url('이미지 URL 형식이 올바르지 않습니다.').optional()
});

const validateAuthRegister: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      profileImage: req.body.profileImage
    }
    await userCreateSchema.parseAsync(parsedBody);
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

export default {
  validateAuthRegister
}