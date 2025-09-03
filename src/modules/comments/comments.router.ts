import { Router } from 'express';
import { authMiddleware } from '#middlewares/authMiddleware';
import commentsValidator from '#modules/comments/comments.validator';
import commentsController from '#modules/comments/comments.controller';

const router = Router();

router
  .route('/:commentId')
  .patch(authMiddleware, commentsValidator.validateCommentUpdate, commentsController.updateComment)
  .delete(authMiddleware, commentsController.deleteComment);

export default router;
