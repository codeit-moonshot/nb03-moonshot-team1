import { Router } from 'express';
import projectController from './project.controller';
import validateProject from './project.validator';
import { requireAuth } from '#middlewares/requireAuth';
import projectTasksController from '#modules/tasks/projects/projectTasks.controller';
import projectTasksValidator from '#modules/tasks/projects/projectTasks.validator';

const router = Router();

router.route('/').post(validateProject.validateCreateProject, projectController.createProject);

router.route('/:projectId/invitations').post(requireAuth, projectController.createInvitation);

router.route('/:projectId/users/:userId').delete(projectController.excludeMember);

/**
 * /projects/:projectId/tasks
 */
router
  .route('/:projectId/tasks')
  .post(
    requireAuth,
    projectTasksValidator.validateProjectId,
    projectTasksValidator.validateCreateTaskBody,
    projectTasksController.createTaskInProject
  )
  .get(
    requireAuth,
    projectTasksValidator.validateProjectId,
    projectTasksValidator.validateListQuery,
    projectTasksController.listProjectTasks
  );

export default router;
