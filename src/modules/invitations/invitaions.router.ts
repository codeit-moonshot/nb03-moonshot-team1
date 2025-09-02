import { Router } from 'express';
import invitationController from './invitations.controller'
import { requireAuth } from '#middlewares/requireAuth';

const router = Router();

router
  .route('/:invitationId/accept')
  .post(requireAuth, invitationController.acceptInvitation)

export default router;