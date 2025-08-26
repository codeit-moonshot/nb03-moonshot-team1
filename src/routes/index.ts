import { Router } from 'express';

import authRouter from '#modules/auth/router';
import usersRouter from '#modules/users/router';
import projectRouter from '#modules/projects/project.router';
import invitationRouter from '#modules/invitations/invitaion.router';
import fileRouter from '#modules/files/router';
import subtaskRoutes from '#modules/subtasks/router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/projects', projectRouter);
router.use('/invitations', invitationRouter);
router.use('/files', fileRouter);
router.use('/tasks/:taskId/subtasks', subtaskRoutes);

export default router;
