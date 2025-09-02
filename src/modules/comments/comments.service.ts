import commentsRepo from '#modules/comments/comments.repo';
import tasksService from '#modules/tasks/tasks.service';
import ApiError from '#errors/ApiError';
import { CommentCreateDto, CommentUpdateDto } from '#modules/comments/dto/comment.dto';
import { CommentQueryDto } from '#modules/comments/dto/commentQuery.dto';

const checkTaskExists = async (taskId: number, userId: number) => {
  const task = await tasksService.getTaskById(taskId, userId);
  if (!task) throw ApiError.notFound('할일을 찾을 수 없습니다.');
  return task;
};

const createComment = async (data: CommentCreateDto) => {
  await checkTaskExists(data.taskId, data.authorId);
  return commentsRepo.create(data);
};

const getCommentList = async (data: CommentQueryDto) => {
  await checkTaskExists(data.taskId, data.userId);
  return commentsRepo.findMany(data);
};

const updateComment = async (userId: number, data: CommentUpdateDto) => {
  const checkUser = await commentsRepo.checkProjectMemberByComment(data.commentId, userId);
  if (!checkUser) throw ApiError.forbidden('프로젝트 멤버가 아닙니다');
  if (checkUser?.task?.project?.ownerId !== userId) throw ApiError.forbidden('댓글 수정 권한이 없습니다.');
  const comment = await commentsRepo.findById(data.commentId);
  if (!comment) throw ApiError.notFound('댓글을 찾을 수 없습니다.');
  if (comment?.authorId !== userId) throw ApiError.forbidden('댓글 수정 권한이 없습니다.');
  return commentsRepo.update(data);
};

const deleteComment = async (userId: number, commentId: number) => {
  const checkUser = await commentsRepo.checkProjectMemberByComment(commentId, userId);
  if (!checkUser) throw ApiError.forbidden('프로젝트 멤버가 아닙니다');
  if (checkUser?.task?.project?.ownerId !== userId) throw ApiError.forbidden('댓글 삭제 권한이 없습니다.');
  const comment = await commentsRepo.findById(commentId);
  if (!comment) throw ApiError.notFound('댓글을 찾을 수 없습니다.');
  if (comment?.authorId !== userId) throw ApiError.forbidden('댓글 삭제 권한이 없습니다.');
  return commentsRepo.remove(commentId);
};

export default {
  createComment,
  getCommentList,
  updateComment,
  deleteComment,
};
