import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

export const subtaskCreateSchema = z.object({
  title: z.string().min(1, '하위 할 일을 작성해 주세요.').max(20, '더는 작성할 수 업습니다.'),
  taskId: z
    .number('아이디는 숫자로 입력해 주세요.')
    .int('아이디는 정수로 입력해 주세요.')
    .nonnegative('아이디를 작성해 주세요.'),
});

export const subtaskUpdateSchema = z.object({
  status: z.enum(TaskStatus),
  taskId: z
    .number('아이디는 숫자로 입력해 주세요.')
    .int('아이디는 정수로 입력해 주세요.')
    .nonnegative('아이디는 작성해 주세요.'),
  subtaskId: z
    .number('아이디는 숫자로 입력해 주세요.')
    .int('아이디는 정수로 입력해 주세요.')
    .nonnegative('아이디는 작성해 주세요.'),
});

export type CreateSubtaskDto = z.infer<typeof subtaskCreateSchema>;
export type UpdateSubtaskDto = z.infer<typeof subtaskUpdateSchema>;
