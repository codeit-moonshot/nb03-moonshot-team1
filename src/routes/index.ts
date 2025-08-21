/**
 * 라우터 작성이 완료되면, 주석 처리한 예시와 같이 import 및 router.use를 추가하시면 됩니다.
 */

import { Router } from 'express';

import authRouter from '#modules/auth/router';
//import exampleRoutes from '../_example/router';
import subtaskRoutes from '../modules/subtasks/router';

const router = Router();

router.use('/auth', authRouter);
//router.use('/example', exampleRoutes);
router.use('/tasks/:taskId/subtasks', subtaskRoutes);

export default router;
