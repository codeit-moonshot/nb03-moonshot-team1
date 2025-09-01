import { Router } from 'express';
import { requireAuth } from '#middlewares/requireAuth';
import usersController from '#modules/users/users.controller';
import validUsers from '#modules/users/users.validator';
import tasksValidator from '#modules/tasks/tasks.validator';
import tasksController from '#modules/tasks/tasks.controller';

const router = Router();

router
  .route('/me')
  .get(requireAuth, usersController.getMyInfo)
  .patch(requireAuth, validUsers.validateUpdateMyInfo, usersController.updateMyInfo);

router.route('/me/tasks').get(requireAuth, tasksValidator.validateMeTasksQuery, tasksController.getMyTasks);

export default router;
