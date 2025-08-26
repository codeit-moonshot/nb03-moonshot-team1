import { Router } from 'express';
import invitationController from './invitation.controller'

const router = Router();

router
  .route('/:invitationId/accept')
  .post(invitationController.acceptInvitation)

export default router;