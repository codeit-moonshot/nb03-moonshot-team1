import { z } from 'zod';
import { TASK_STATUS } from '#constants/taskStatus.constants';

export const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다.');

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'startDate', 'endDate', 'id']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const meTasksQuerySchema = z
  .object({
    from: dateStr.optional(),
    to: dateStr.optional(),
    project_id: z.coerce.number().int().positive().optional(),
    status: z.enum(TASK_STATUS).optional(),
    assignee: z.coerce.number().int().positive().optional(),
    keyword: z.string().trim().max(100).optional(),
  })
  .merge(paginationSchema);

export type MeTasksQueryDto = z.infer<typeof meTasksQuerySchema>;
