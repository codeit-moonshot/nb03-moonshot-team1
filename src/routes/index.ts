import { Router } from 'express';

import authRouter from '#modules/auth/router';
import projectRouter from '#modules/projects/router';
import fileRouter from '#modules/files/router';
import subtaskRoutes from '#modules/subtasks/router';

const router = Router();

router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/files', fileRouter);
router.use('/tasks/:taskId/subtasks', subtaskRoutes);

export default router;
