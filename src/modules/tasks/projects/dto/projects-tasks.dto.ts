import { z } from 'zod';
import { TASK_STATUS } from '#constants/taskStatus.constants';

/**
 * Params
 */
export const projectIdParamsSchema = z.object({
  projectId: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((n) => n > 0),
});

export type ProjectIdParamsDto = z.infer<typeof projectIdParamsSchema>;

/**
 * POST /projects/:projectId/tasks
 */
export const createTaskBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  startYear: z.coerce.number().int().min(1970).max(2100),
  startMonth: z.coerce.number().int().min(1).max(12),
  startDay: z.coerce.number().int().min(1).max(31),
  endYear: z.coerce.number().int().min(1970).max(2100),
  endMonth: z.coerce.number().int().min(1).max(12),
  endDay: z.coerce.number().int().min(1).max(31),
  status: z.enum(TASK_STATUS).optional().default('todo'),
  tags: z.array(z.string().trim().max(50)).optional().default([]),
  attachments: z.array(z.string().url()).optional().default([]),
});
export type CreateProjectTaskDto = z.infer<typeof createTaskBodySchema>;

/**
 * GET /projects/:projectId/tasks
 */
export const listProjectTasksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(TASK_STATUS).optional(),
  assignee: z.coerce.number().int().positive().optional(),
  keyword: z.string().trim().max(100).optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
  order_by: z.enum(['created_at', 'name', 'end_date']).default('created_at'),
});

export type ListProjectTasksQueryDto = z.infer<typeof listProjectTasksQuerySchema>;
