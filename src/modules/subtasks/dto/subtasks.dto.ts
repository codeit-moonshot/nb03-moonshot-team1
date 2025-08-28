import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

export const subtaskCreateSchema = z.object({
  title: z.string().trim().min(1, '하위 할 일을 작성해 주세요.').trim().max(20, '더는 작성할 수 없습니다.'),
  taskId: z.int().positive(),
});

export const subtaskUpdateSchema = z.object({
  status: z.enum(TaskStatus),
  taskId: z.int().positive(),
  subtaskId: z.int().positive(),
});

export const subtaskDeleteSchema = z.object({
  taskId: z.int().positive(),
  subtaskId: z.int().positive(),
});

export type CreateSubtaskDto = z.infer<typeof subtaskCreateSchema>;
export type UpdateSubtaskDto = z.infer<typeof subtaskUpdateSchema>;
export type DeleteSubtaskDto = z.infer<typeof subtaskDeleteSchema>;
