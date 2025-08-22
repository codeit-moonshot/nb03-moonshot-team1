import { Router } from 'express';

import * as subtaskController from './controller';
import { validateSubtaskCreate } from './validator';

const router = Router({ mergeParams: true });

router
  .route('/')
  .post(validateSubtaskCreate, subtaskController.createSubtask)
  .get(subtaskController.getSubtaskList);

router
  .route('/:subtaskId')
  .patch(subtaskController.updateSubtask)
  .delete(subtaskController.deleteSubtask);

export default router;
