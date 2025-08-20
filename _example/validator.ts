import { z } from 'zod';
import type { RequestHandler } from 'express';
import ApiError from '@/errors/ApiError';

const productCreateSchema = z.object({
  name: z.string().min(1, '상품 이름을 작성해 주세요.'),
  description: z.string().min(1, '상품 설명을 작성해 주세요.'),
  price: z
    .number({ invalid_type_error: '가격은 숫자로 입력해 주세요.' })
    .int('가격은 정수로 입력해 주세요.')
    .nonnegative('가격을 작성해 주세요.'),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url('이미지 URL 형식이 올바르지 않습니다.').optional(),
});

const productUpdateSchema = productCreateSchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: '수정할 내용을 최소 1개 이상 입력해 주세요.',
});

export const validateProductCreate: RequestHandler = (req, _res, next) => {
  const parsedBody = {
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : undefined,
  };

  try {
    productCreateSchema.parse(parsedBody);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new ApiError(400, `상품 등록 유효성 검사 실패: ${messages}`));
    }
    next(err);
  }
};

export const validateProductUpdate: RequestHandler = (req, _res, next) => {
  const parsedBody = {
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : undefined,
  };

  try {
    productUpdateSchema.parse(parsedBody);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new ApiError(400, `상품 수정 유효성 검사 실패: ${messages}`));
    }
    next(err);
  }
};
