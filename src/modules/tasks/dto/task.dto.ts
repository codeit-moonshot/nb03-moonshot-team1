import { z } from 'zod';
import type { Task, User, Tag, Attachments } from '@prisma/client';
import { TASK_STATUS } from '#constants/taskStatus.constants';

/**
 * DB 원본 타입
 */
export type DBTask = Task;
export type DBUser = User;
export type DBTag = Tag;
export type DBAttachment = Attachments;

/**
 * API 응답용 서브 타입
 */
export type PublicAssignee = Pick<DBUser, 'id' | 'name' | 'email' | 'profileImage'>;
export type PublicTag = Pick<DBTag, 'id' | 'name'>;

/**
 * API 응답용 첨부파일
 */
export interface PublicAttachment {
  id: number;
  url: string;
}

/**
 * /tasks 단일 응답
 */
export interface PublicTask {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: (typeof TASK_STATUS)[number];
  assignee: PublicAssignee | null;
  tags: PublicTag[];
  attachments: PublicAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PATCH /tasks/:taskId
 */
export const patchTaskBodySchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),

    startYear: z.coerce.number().int().min(1970).max(2100).optional(),
    startMonth: z.coerce.number().int().min(1).max(12).optional(),
    startDay: z.coerce.number().int().min(1).max(31).optional(),

    endYear: z.coerce.number().int().min(1970).max(2100).optional(),
    endMonth: z.coerce.number().int().min(1).max(12).optional(),
    endDay: z.coerce.number().int().min(1).max(31).optional(),

    status: z.enum(TASK_STATUS).optional(),

    assigneeId: z.coerce.number().int().positive().optional(),

    tags: z.array(z.string().trim().max(50)).optional(),
    attachments: z.array(z.string().url()).optional(),
  })
  .superRefine((data, ctx) => {
    const startProvided = ['startYear', 'startMonth', 'startDay'].some((k) => k in data);
    const startAll = data.startYear !== undefined && data.startMonth !== undefined && data.startDay !== undefined;
    if (startProvided && !startAll) {
      ctx.addIssue({
        code: 'custom',
        message: 'startYear/startMonth/startDay는 함께 제공되어야 합니다.',
        path: ['startYear'],
      });
    }

    const endProvided = ['endYear', 'endMonth', 'endDay'].some((k) => k in data);
    const endAll = data.endYear !== undefined && data.endMonth !== undefined && data.endDay !== undefined;
    if (endProvided && !endAll) {
      ctx.addIssue({
        code: 'custom',
        message: 'endYear/endMonth/endDay는 함께 제공되어야 합니다.',
        path: ['endYear'],
      });
    }

    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: '수정할 내용을 최소 1개 이상 입력해 주세요.',
      });
    }
  });

export type PatchTaskBodyDto = z.infer<typeof patchTaskBodySchema>;
