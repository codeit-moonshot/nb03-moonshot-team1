import { z } from 'zod';

export const commentCreateSchema = z.object({
  taskId: z.coerce.number().int().positive('유효하지 않은 할 일 ID 형식입니다.'),
  authorId: z.coerce.number().int().positive('유효하지 않은 사용자 ID 형식입니다.'),
  content: z
    .string()
    .min(2, '댓글 내용은 최소 2자 이상이어야 합니다')
    .max(300, '댓글 내용은 최대 300자 이하여야 합니다'),
});

export const updateCommentSchema = z.object({
  commentId: z.coerce.number().int().positive('유효하지 않은 댓글 ID 형식입니다.'),
  content: z
    .string()
    .min(2, '댓글 내용은 최소 2자 이상이어야 합니다')
    .max(300, '댓글 내용은 최대 300자 이하여야 합니다'),
});

export interface PublicCommentDto {
  id: number;
  content: string;
  taskId: number;
  author: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicCommentListDto {
  data: PublicCommentDto[];
  total: number;
}

export type CommentCreateDto = z.infer<typeof commentCreateSchema>;
export type CommentUpdateDto = z.infer<typeof updateCommentSchema>;
