import { Router } from 'express';
import validateAuth from '#modules/auth/validator';
import authController from '#modules/auth/controller';

const router = Router();

router.post('/register', validateAuth.validateAuthRegister, authController.register);
router.post('/login', validateAuth.validateAuthLogin, authController.login);
router.post('/refresh', authController.refresh);

export default router;
