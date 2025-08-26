import { Router } from 'express';
import { requireAuth } from '#middlewares/requireAuth';
import usersController from '#modules/users/controller';
import validUsers from '#modules/users/validator';

const router = Router();

router
  .route('/me')
  .get(requireAuth, usersController.getMyInfo)
  .patch(requireAuth, validUsers.validateUpdateMyInfo, usersController.updateMyInfo);

export default router;
