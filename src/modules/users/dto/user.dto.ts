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

export const userUpdateSchema = z.object({
  email: z.email('유효한 이메일 주소가 아닙니다.'),
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(20, '이름은 최대 20자 이하여야 합니다')
    .regex(/^[a-zA-Z0-9가-힣]+$/, '이름에 특수문자는 사용할 수 없습니다.'),
  currentPassword: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자 이하여야 합니다'),
  newPassword: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자 이하여야 합니다'),
  profileImage: z.url('이미지 URL 형식이 올바르지 않습니다.').nullable().optional(),
});

export type UpdateUserDto = z.infer<typeof userUpdateSchema>;
