import { Router } from 'express';
import upload from '#middlewares/upload';
import { uploadImageTemp, uploadTaskAttachments } from './controller';

const router = Router();

router.post('/images', ...upload.createImageUploader(), uploadImageTemp); // field: image
router.post('/files/:taskId', ...upload.createFileUploader(), uploadTaskAttachments); // field: file

export default router;
