import { Router } from 'express';

import * as subtaskController from './controller';

const router = Router({ mergeParams: true });

router
  .route('/')
  .post(subtaskController.createSubtask)
  .get(subtaskController.getSubtaskList);

router
  .route('/:subtaskId')
  .patch(subtaskController.updateSubtask)
  .delete(subtaskController.deleteSubtask);

export default router;
