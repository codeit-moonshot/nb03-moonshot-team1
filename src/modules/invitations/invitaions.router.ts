import { Router } from 'express';
import invitationController from '#modules/invitations/invitations.controller';
import { requireAuth } from '#middlewares/requireAuth';

const router = Router();

router.route('/:invitationId').delete(requireAuth, invitationController.deleteInvitation);

router.route('/:invitationId/accept').post(requireAuth, invitationController.acceptInvitation);

export default router;
