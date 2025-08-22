import { Router } from 'express';
import invitationController from './controller'

const router = Router();

router
  .route('/:invitationId/accept')
  .post(invitationController.acceptInvitation)

export default router;