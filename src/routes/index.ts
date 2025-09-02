import { Router } from 'express';

import authRoutes from '#modules/auth/auth.router';
import usersRoutes from '#modules/users/users.router';
import projectRoutes from '#modules/projects/projects.router';
import invitationRoutes from '#modules/invitations/invitaions.router';
import fileRoutes from '#modules/files/files.router';
import tasksRoutes from '#modules/tasks/tasks.router';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/projects', projectRoutes);
router.use('/invitations', invitationRoutes);
router.use('/files', fileRoutes);
router.use('/tasks', tasksRoutes);

export default router;
