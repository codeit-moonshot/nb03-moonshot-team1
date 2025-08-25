import { Router } from 'express';
import { createInvitation } from './controller';

const router = Router();

router
  .route('/:projectId/invitations')
  .post(createInvitation)

export default router;