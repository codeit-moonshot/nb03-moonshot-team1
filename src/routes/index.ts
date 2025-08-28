import { Router } from 'express';

import authRoutes from '#modules/auth/auth.router';
import usersRoutes from '#modules/users/users.router';
import projectRoutes from '#modules/projects/project.router';
import invitationRoutes from '#modules/invitations/invitaion.router';
import fileRoutes from '#modules/files/router';
import tasksRoutes from '#modules/tasks/tasks.router';
import subtaskRoutes from '#modules/subtasks/router';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/projects', projectRoutes);
router.use('/invitations', invitationRoutes);
router.use('/files', fileRoutes);
router.use('/tasks', tasksRoutes);
router.use('/tasks/:taskId/subtasks', subtaskRoutes);

export default router;
