import { Router } from 'express';
import upload from '#middlewares/upload';
import { uploadImageTemp, uploadTaskAttachments } from './controller';

const r = Router();

r.post('/images', ...upload.createImageUploader(), uploadImageTemp); // field: image
r.post('/files/:taskId', ...upload.createFileUploader(), uploadTaskAttachments); // field: file

export default r;
