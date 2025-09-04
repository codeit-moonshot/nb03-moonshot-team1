import { Router } from 'express';
import tasksController from '#modules/tasks/tasks.controller';
import { authMiddleware } from '#middlewares/authMiddleware';
import tasksValidator from '#modules/tasks/tasks.validator';
import subtasksController from '#modules/subtasks/subtasks.controller';
import subtasksValidator from '#modules/subtasks/subtasks.validator';
import commentsValidator from '#modules/comments/comments.validator';
import commentsController from '#modules/comments/comments.controller';

const router = Router();

/**
 * /tasks/:taskId
 */
router
  .route('/:taskId')
  .get(authMiddleware, tasksValidator.validateTaskId, tasksController.getTaskById)
  .patch(authMiddleware, tasksValidator.validateTaskId, tasksValidator.validatePatchTaskBody, tasksController.patchTask)
  .delete(authMiddleware, tasksValidator.validateTaskId, tasksController.deleteTask);

/**
 * /tasks/:taskId/subtasks
 */
router
  .route('/:taskId/subtasks')
  .get(authMiddleware, subtasksController.getSubtaskList)
  .post(authMiddleware, subtasksValidator.validateSubtaskCreate, subtasksController.createSubtask);

router
  .route('/:taskId/comments')
  .get(authMiddleware, commentsValidator.validateCommentQuery, commentsController.getCommentList)
  .post(authMiddleware, commentsValidator.validateCommentCreate, commentsController.createComment);

export default router;
