import { Router } from 'express';
import validateAuth from '#modules/auth/validator';
import authController from '#modules/auth/controller';

const router = Router();

router.post('/register', validateAuth.validateAuthRegister, authController.register);

export default router;