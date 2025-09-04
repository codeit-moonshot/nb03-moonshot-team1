import { z } from 'zod';

export const subtaskCreateSchema = z.object({
  title: z.string().trim().min(1, '하위 할 일을 작성해 주세요.').trim().max(20, '더는 작성할 수 없습니다.'),
  taskId: z.int().positive(),
});

/**
 * PATCH /subtasks/:subtaskId
 * status만
 */
export const subtaskUpdateSchema = z.object({
  status: z.enum(['done', 'todo']),
  subtaskId: z.int().positive(),
});

/**
 * DELETE /subtasks/:subtaskId
 * params만 필요
 */
export const subtaskDeleteSchema = z.object({
  subtaskId: z.int().positive(),
});

export interface PublicSubtaskDto {
  id: number;
  title: string;
  taskId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubtaskListResponse {
  data: PublicSubtaskDto[];
  total: number;
}

export type CreateSubtaskDto = z.infer<typeof subtaskCreateSchema>;
export type UpdateSubtaskDto = z.infer<typeof subtaskUpdateSchema>;
export type DeleteSubtaskDto = z.infer<typeof subtaskDeleteSchema>;
