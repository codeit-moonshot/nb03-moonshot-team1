import { Router } from 'express';
import invitationController from '#modules/invitations/invitations.controller';
import { authMiddleware } from '#middlewares/authMiddleware';

const router = Router();

router.route('/:invitationId').delete(authMiddleware, invitationController.deleteInvitation);
router.route('/:invitationId/accept').post(authMiddleware, invitationController.acceptInvitation);

export default router;
