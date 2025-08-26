import { Router } from 'express';
import tasksController from '#modules/tasks/tasks.controller';
import { requireAuth } from '#middlewares/requireAuth';
import tasksValidator from '#modules/tasks/tasks.validator';

const router = Router();

/**
 * /tasks/:taskId
 */
router
  .route('/:taskId')
  .get(requireAuth, tasksValidator.validateTaskId, tasksController.getTaskById)
  .patch(requireAuth, tasksValidator.validateTaskId, tasksValidator.validatePatchTaskBody, tasksController.patchTask)
  .delete(requireAuth, tasksValidator.validateTaskId, tasksController.deleteTask);

export default router;
