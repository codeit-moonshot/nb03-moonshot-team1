/**
 * 라우터 작성이 완료되면, 예시와 같이 import 및 router.use를 추가하시면 됩니다.
 */

import { Router } from 'express';

import tasksRouter from '@/modules/tasks/router';

const router = Router();

router.use('/task', tasksRouter);

export default router;
