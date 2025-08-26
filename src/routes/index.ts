import { Router } from 'express';

import authRouter from '#modules/auth/auth.router';
import usersRouter from '#modules/users/users.router';
import projectRouter from '#modules/projects/router';
import fileRouter from '#modules/files/router';
import subtaskRoutes from '#modules/subtasks/router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/projects', projectRouter);
router.use('/files', fileRouter);
router.use('/tasks/:taskId/subtasks', subtaskRoutes);

export default router;
