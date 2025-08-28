import { Router } from 'express';
import projectController from './project.controller';
import validateProject from './project.validator';

const router = Router();

router
  .route('/')
  .post(validateProject.validateCreateProject, projectController.createProject);

router
  .route('/:projectId/invitations') 
  .post(projectController.createInvitation)

router
  .route('/:projectId/users/:userId')
  .delete(projectController.excludeMember)

export default router;