import type { RequestHandler } from 'express';
import forwardZodError from '#utils/zod';
import { commentCreateSchema, updateCommentSchema } from '#modules/comments/dto/comment.dto';
import { commentQuerySchema } from '#modules/comments/dto/commentQuery.dto';

const validateCommentCreate: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = {
      taskId: req.params.taskId,
      authorId: req.user.id,
      content: req.body.content,
    };
    await commentCreateSchema.parseAsync(parsedBody);
    next();
  } catch (err) {
    forwardZodError(err, '댓글 생성', next);
  }
};

const validateCommentQuery: RequestHandler = async (req, res, next) => {
  try {
    const parsedQuery = {
      page: req.query.page,
      limit: req.query.limit,
    };
    await commentQuerySchema.parseAsync(parsedQuery);
    next();
  } catch (err) {
    forwardZodError(err, '댓글 조회', next);
  }
};

const validateCommentUpdate: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = {
      commentId: req.params.commentId,
      content: req.body.content,
    };
    await updateCommentSchema.parseAsync(parsedBody);
    next();
  } catch (err) {
    forwardZodError(err, '댓글 수정', next);
  }
};

export default {
  validateCommentCreate,
  validateCommentQuery,
  validateCommentUpdate,
};
