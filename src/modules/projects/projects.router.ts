import { Router } from 'express';
import projectController from '#modules/projects/projects.controller';
import validateProject from '#modules/projects/projects.validator';
import { requireAuth } from '#middlewares/requireAuth';
import projectTasksController from '#modules/tasks/projects/projectTasks.controller';
import projectTasksValidator from '#modules/tasks/projects/projectTasks.validator';

const router = Router();

router.route('/').post(requireAuth, validateProject.validateCreateProject, projectController.createProject);

router
  .route('/:projectId')
  .get(requireAuth, projectController.getProject)
  .patch(requireAuth, validateProject.validateUpdateProject, projectController.updateProject)
  .delete(requireAuth, projectController.deleteProject);

router.route('/:projectId/invitations').post(requireAuth, projectController.createInvitation);

router
  .route('/:projectId/users')
  .get(requireAuth, validateProject.validateProjectMemberQuery, projectController.getProjectMembers);

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
