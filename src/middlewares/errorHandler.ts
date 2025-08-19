import type { ErrorRequestHandler } from 'express';
import ApiError from '@/errors/ApiError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isAPI = err instanceof ApiError;
  const status = isAPI ? err.statusCode : 500;

  const payload = {
    success: false as const,
    error: {
      code: isAPI ? err.code : 'INTERNAL_ERROR',
      message: (err as Error).message || 'Internal server error',
      details: isAPI ? err.details : undefined,
    },
  };

  return res.status(status).json(payload);
};
