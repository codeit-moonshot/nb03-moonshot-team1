import { Router } from 'express';
import { authMiddleware } from '#middlewares/authMiddleware';
import usersController from '#modules/users/users.controller';
import validUsers from '#modules/users/users.validator';
import tasksValidator from '#modules/tasks/tasks.validator';
import tasksController from '#modules/tasks/tasks.controller';
import projectValidator from '#modules/projects/projects.validator';
import projectController from '#modules/projects/projects.controller';

const router = Router();

router
  .route('/me')
  .get(authMiddleware, usersController.getMyInfo)
  .patch(authMiddleware, validUsers.validateUpdateMyInfo, usersController.updateMyInfo);

router.route('/me/tasks').get(authMiddleware, tasksValidator.validateMeTasksQuery, tasksController.getMyTasks);

router.route('/me/projects').get(authMiddleware, projectValidator.validateMeProjectQuery, projectController.getMyProjects);

export default router;
