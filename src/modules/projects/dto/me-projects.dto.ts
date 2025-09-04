import { z } from 'zod';

export const meProjectQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
  order: z.enum(['asc', 'desc']).default('asc'),
  order_by: z
    .enum(['created_at', 'name'])
    .default('created_at')
    .transform((v) => (v === 'created_at' ? 'createdAt' : 'name')),
});

export type MeProjectQueryDto = z.infer<typeof meProjectQuerySchema> & {
  order_by: 'createdAt' | 'name';
};
