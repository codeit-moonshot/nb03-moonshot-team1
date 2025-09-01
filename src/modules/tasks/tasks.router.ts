import { Router } from 'express';
import tasksController from '#modules/tasks/tasks.controller';
import { requireAuth } from '#middlewares/requireAuth';
import { authMiddleware } from '#middlewares/authMiddleware';
import tasksValidator from '#modules/tasks/tasks.validator';
import subtasksController from '#modules/subtasks/subtasks.controller';
import subtasksValidator from '#modules/subtasks/subtasks.validator';

const router = Router();

/**
 * /tasks/:taskId
 */
router
  .route('/:taskId')
  .get(requireAuth, tasksValidator.validateTaskId, tasksController.getTaskById)
  .patch(requireAuth, tasksValidator.validateTaskId, tasksValidator.validatePatchTaskBody, tasksController.patchTask)
  .delete(requireAuth, tasksValidator.validateTaskId, tasksController.deleteTask);

/**
 * /tasks/:taskId/subtasks
 */
router
  .route('/:taskId/subtasks')
  .get(authMiddleware, subtasksController.getSubtaskList)
  .post(authMiddleware, subtasksValidator.validateSubtaskCreate, subtasksController.createSubtask);

router
  .route('/:taskId/subtasks/:subtaskId')
  .get(authMiddleware, subtasksController.getSubtaskId)
  .patch(authMiddleware, subtasksValidator.validateSubtaskUpdate, subtasksController.updateSubtask)
  .delete(authMiddleware, subtasksController.deleteSubtask);

export default router;
