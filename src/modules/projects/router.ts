import { Router } from 'express';
import projectController from './controller';

const router = Router();

router
  .route('/:projectId/invitations')
  .post(projectController.createInvitation)

router
  .route('/:projectId/users/:userId')
  .delete(projectController.excludeMember)

export default router;