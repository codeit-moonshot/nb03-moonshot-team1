import { Router } from 'express';
import validateAuth from '#modules/auth/auth.validator';
import authController from '#modules/auth/auth.controller';

const router = Router();

router.post('/register', validateAuth.validateAuthRegister, authController.register);
router.post('/login', validateAuth.validateAuthLogin, authController.login);
router.post('/refresh', authController.refresh);

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

export default router;
