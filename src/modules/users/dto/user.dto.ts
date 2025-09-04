import { z } from 'zod';

export interface UserDto {
  id: number;
  email: string;
  name: string;
  password: string | null;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type PublicUserDto = Omit<UserDto, 'password' | 'deletedAt'>;

export const userUpdateSchemaBase = z.object({
  email: z.email('유효한 이메일 주소가 아닙니다.').optional(),
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(20, '이름은 최대 20자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9가-힣]+$/, '이름에 특수문자는 사용할 수 없습니다.')
    .optional(),
  currentPassword: z.string().min(8).max(20).optional(),
  newPassword: z.string().min(8).max(20).optional(),
  profileImage: z.url('이미지 URL 형식이 올바르지 않습니다.').nullable().optional(),
});

export const userUpdateSchema = userUpdateSchemaBase.superRefine((data, ctx) => {
  const hasCurrent = typeof data.currentPassword === 'string';
  const hasNew = typeof data.newPassword === 'string';

  if (hasCurrent !== hasNew) {
    ctx.addIssue({
      code: 'custom',
      message: '비밀번호 변경 시 현재/새 비밀번호를 모두 보내야 합니다.',
      path: hasCurrent ? ['newPassword'] : ['currentPassword'],
    });
  }
  if (hasCurrent && hasNew && data.currentPassword === data.newPassword) {
    ctx.addIssue({
      code: 'custom',
      message: '새 비밀번호는 현재 비밀번호와 달라야 합니다.',
      path: ['newPassword'],
    });
  }
});

export type UpdateUserDto = z.infer<typeof userUpdateSchema>;
