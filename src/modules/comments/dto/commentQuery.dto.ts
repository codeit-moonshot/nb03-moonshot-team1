import { z } from 'zod';

export const commentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type CommentQueryDto = z.infer<typeof commentQuerySchema> & {
  taskId: number;
  userId: number;
};
