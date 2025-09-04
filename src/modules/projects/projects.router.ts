import { Router } from 'express';
import projectController from '#modules/projects/projects.controller';
import validateProject from '#modules/projects/projects.validator';
import { authMiddleware } from '#middlewares/authMiddleware';
import projectTasksController from '#modules/tasks/projects/projectTasks.controller';
import projectTasksValidator from '#modules/tasks/projects/projectTasks.validator';

const router = Router();

router.route('/').post(authMiddleware, validateProject.validateCreateProject, projectController.createProject);

router
  .route('/:projectId')
  .get(authMiddleware, projectController.getProject)
  .patch(authMiddleware, validateProject.validateUpdateProject, projectController.updateProject)
  .delete(authMiddleware, projectController.deleteProject);

router.route('/:projectId/invitations').post(authMiddleware, projectController.createInvitation);

router
  .route('/:projectId/users')
  .get(authMiddleware, validateProject.validateProjectMemberQuery, projectController.getProjectMembers);

router.route('/:projectId/users/:userId').delete(projectController.excludeMember);

/**
 * /projects/:projectId/tasks
 */
router
  .route('/:projectId/tasks')
  .post(
    authMiddleware,
    projectTasksValidator.validateProjectId,
    projectTasksValidator.validateCreateTaskBody,
    projectTasksController.createTaskInProject
  )
  .get(
    authMiddleware,
    projectTasksValidator.validateProjectId,
    projectTasksValidator.validateListQuery,
    projectTasksController.listProjectTasks
  );

export default router;
