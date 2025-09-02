import commentsRepo from '#modules/comments/comments.repo';
import tasksService from '#modules/tasks/tasks.service';
import ApiError from '#errors/ApiError';
import {
  CommentCreateDto,
  CommentUpdateDto,
  PublicCommentDto,
  PublicCommentListDto,
} from '#modules/comments/dto/comment.dto';
import { CommentQueryDto } from '#modules/comments/dto/commentQuery.dto';
import { th } from 'zod/v4/locales/index.cjs';

const checkTaskExists = async (taskId: number, userId: number): Promise<void> => {
  await tasksService.getTaskById(taskId, userId);
};

const createComment = async (data: CommentCreateDto): Promise<PublicCommentDto> => {
  await checkTaskExists(data.taskId, data.authorId);
  return commentsRepo.create(data);
};

const getCommentList = async (data: CommentQueryDto): Promise<PublicCommentListDto> => {
  await checkTaskExists(data.taskId, data.userId);
  return commentsRepo.findMany(data);
};

const updateComment = async (userId: number, data: CommentUpdateDto): Promise<PublicCommentDto> => {
  const comment = await commentsRepo.checkAuthorAndOwnerByComment(data.commentId);
  if (!comment) throw ApiError.notFound('댓글을 찾을 수 없습니다.');
  if (comment.authorId !== userId && comment.task.project.ownerId !== userId) {
    throw ApiError.forbidden('댓글 수정 권한이 없습니다.');
  }
  return commentsRepo.update(data);
};

const deleteComment = async (userId: number, commentId: number): Promise<void> => {
  const comment = await commentsRepo.checkAuthorAndOwnerByComment(commentId);
  if (!comment) throw ApiError.notFound('댓글을 찾을 수 없습니다.');
  if (comment.authorId !== userId && comment.task.project.ownerId !== userId) {
    throw ApiError.forbidden('댓글 삭제 권한이 없습니다.');
  }
  await commentsRepo.remove(commentId);
};

export default {
  createComment,
  getCommentList,
  updateComment,
  deleteComment,
};
