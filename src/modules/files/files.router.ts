import { Router } from 'express';
import upload from '#modules/files/files.middleware';
import { uploadTempFiles } from '#modules/files/files.controller';

const router = Router();

router.post('/', ...upload.createMultiAnyUploader(), uploadTempFiles);

export default router;
