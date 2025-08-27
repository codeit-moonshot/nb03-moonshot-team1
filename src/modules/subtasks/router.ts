import { Router } from 'express';

import subtaskController from '#modules/subtasks/controller';
import validateSubtask from '#modules/subtasks/validator';

const router = Router({ mergeParams: true });

router
  .route('/')
  .post(validateSubtask.validateSubtaskCreate, subtaskController.createSubtask)
  .get(subtaskController.getSubtaskList);

router
  .route('/:subtaskId')
  .patch(validateSubtask.validateSubtaskUpdate, subtaskController.updateSubtask)
  .delete(validateSubtask.validateSubtaskDelete, subtaskController.deleteSubtask);

export default router;
