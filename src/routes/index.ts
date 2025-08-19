/**
 * 라우터 작성이 완료되면, 예시와 같이 import 및 router.use를 추가하시면 됩니다.
 */

import { Router } from 'express';

import exampleRoutes from '@/modules/_example/router';

const router = Router();

router.use('/example', exampleRoutes);

export default router;
