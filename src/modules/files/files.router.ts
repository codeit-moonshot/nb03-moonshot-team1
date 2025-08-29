import { Router } from 'express';
import upload from '#middlewares/upload';
import { uploadTempFiles } from '#modules/files/files.controller';

const router = Router();

router.post('/', ...upload.createMultiAnyUploader(), uploadTempFiles);

export default router;
