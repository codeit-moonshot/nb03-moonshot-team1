import { Router } from 'express';
import { authMiddleware } from '#middlewares/authMiddleware';
import subtasksController from '#modules/subtasks/subtasks.controller';
import subtasksValidator from '#modules/subtasks/subtasks.validator';

const router = Router();

/**
 * /subtasks/:subtaskId
 */
router
  .route('/:subtaskId')
  .get(authMiddleware, subtasksController.getSubtaskId)
  .patch(authMiddleware, subtasksValidator.validateSubtaskUpdate, subtasksController.updateSubtask)
  .delete(authMiddleware, subtasksController.deleteSubtask);

export default router;
