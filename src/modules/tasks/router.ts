import { Router } from 'express';
// import auth from '../auth/router';
import * as tasksController from './controller';

const router = Router();

router.route('/projects/:projectId/tasks')
  .post(
    // auth.verifyAccessToken,
    tasksController.createTasks,
  )

export default router;

