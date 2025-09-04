import type { RequestHandler } from 'express';
import commentsService from '#modules/comments/comments.service';
import { CommentCreateDto, CommentUpdateDto } from '#modules/comments/dto/comment.dto';
import { CommentQueryDto } from '#modules/comments/dto/commentQuery.dto';

/**
 * @function createComment
 * @description 댓글을 생성합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {201} 생성된 댓글 반환
 *
 * @throws {400} 잘못된 요청 형식
 * @throws {403} 프로젝트 접근 권한 없음
 * @throws {404} 할일을 찾을 수 없는 경우
 */

const createComment: RequestHandler = async (req, res, next) => {
  const dto: CommentCreateDto = {
    taskId: Number(req.params.taskId),
    authorId: Number(req.user.id),
    content: req.body.content,
  };
  const comment = await commentsService.createComment(dto);
  res.status(201).json(comment);
};

/**
 * @function getCommentList
 * @description 댓글 목록을 조회합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 댓글 목록 반환
 *
 * @throws {400} 잘못된 요청 형식
 * @throws {403} 프로젝트 접근 권한 없음
 * @throws {404} 할일을 찾을 수 없는 경우
 */

const getCommentList: RequestHandler = async (req, res, next) => {
  const { page, limit } = req.query;
  const dto: CommentQueryDto = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    taskId: Number(req.params.taskId),
    userId: Number(req.user.id),
  };
  const { data } = await commentsService.getCommentList(dto);
  res.status(200).json(data);
};

/**
 * @function updateComment
 * @description 댓글을 수정합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 수정된 댓글 반환
 *
 * @throws {400} 잘못된 요청 형식
 * @throws {403} 댓글 수정 권한 없음
 * @throws {404} 댓글을 찾을 수 없는 경우
 */

const updateComment: RequestHandler = async (req, res, next) => {
  const userId = Number(req.user.id);
  const dto: CommentUpdateDto = {
    commentId: Number(req.params.commentId),
    content: req.body.content,
  };
  const comment = await commentsService.updateComment(userId, dto);
  res.status(200).json(comment);
};

/**
 * @function deleteComment
 * @description 댓글을 삭제합니다.
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 삭제된 댓글 반환
 *
 * @throws {400} 잘못된 요청 형식
 * @throws {403} 댓글 삭제 권한 없음
 * @throws {404} 댓글을 찾을 수 없는 경우
 */

const deleteComment: RequestHandler = async (req, res, next) => {
  const userId = Number(req.user.id);
  const commentId = Number(req.params.commentId);
  await commentsService.deleteComment(userId, commentId);
  res.status(204).send();
};

export default {
  createComment,
  getCommentList,
  updateComment,
  deleteComment,
};
