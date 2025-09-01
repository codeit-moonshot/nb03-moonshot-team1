import type { RequestHandler } from 'express';
import commentsService from '#modules/comments/comments.service';
import { CommentCreateDto, CommentUpdateDto } from '#modules/comments/dto/comment.dto';
import { CommentQueryDto } from '#modules/comments/dto/commentQuery.dto';

const createComment: RequestHandler = async (req, res, next) => {
  const dto: CommentCreateDto = {
    taskId: Number(req.params.taskId),
    authorId: Number(req.user.id),
    content: req.body.content,
  };
  const comment = await commentsService.createComment(dto);
  res.status(201).json(comment);
};

const getCommentList: RequestHandler = async (req, res, next) => {
  const dto: CommentQueryDto = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    taskId: Number(req.params.taskId),
    userId: Number(req.user.id),
  };
  const comments = await commentsService.getCommentList(dto);
  res.status(200).json(comments);
};

const updateComment: RequestHandler = async (req, res, next) => {
  const dto: CommentUpdateDto = {
    commentId: Number(req.params.commentId),
    content: req.body.content,
  };
  const userId = Number(req.user.id);
  const comment = await commentsService.updateComment(userId, dto);
  res.status(200).json(comment);
};

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
