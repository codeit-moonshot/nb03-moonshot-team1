import type { Subtask } from '@prisma/client';

/**
 * 하위 할 일 기본 모델
 */
export type DBSubtask = Subtask;

/**
 * 하위 할 일 생성 DTO
 */
export type CreateSubtaskDto = Omit<DBSubtask, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

/**
 * 하위 할 일 수정 DTO
 */
export type UpdateSubtaskDto = Omit<DBSubtask, 'title' | 'createdAt' | 'updatedAt'>;