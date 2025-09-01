import { Router } from 'express';
import tasksController from '#modules/tasks/tasks.controller';
import { requireAuth } from '#middlewares/requireAuth';
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
  .post(subtasksValidator.validateSubtaskCreate, subtasksController.createSubtask)
  .get(subtasksController.getSubtaskList);

router
  .route('/:taskId/subtasks/:subtaskId')
  .patch(subtasksValidator.validateSubtaskUpdate, subtasksController.updateSubtask)
  .delete(subtasksValidator.validateSubtaskDelete, subtasksController.deleteSubtask);

export default router;
