import { Router } from 'express';

import * as subtaskController from '#modules/subtasks/controller';
import { validateSubtaskCreate, validateSubtaskUpdate } from '#modules/subtasks/validator';

const router = Router({ mergeParams: true });

router.route('/').post(validateSubtaskCreate, subtaskController.createSubtask).get(subtaskController.getSubtaskList);

router
  .route('/:subtaskId')
  .patch(validateSubtaskUpdate, subtaskController.updateSubtask)
  .delete(subtaskController.deleteSubtask);

export default router;
