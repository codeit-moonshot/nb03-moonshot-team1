import type { RequestHandler } from 'express';
import ApiError from '#errors/ApiError';
import { UploadService } from './service';

export const uploadImageTemp: RequestHandler = async (req, res) => {
  const file = req.file;
  if (!file) throw new ApiError(400, '업로드된 이미지가 없습니다.');
  try {
    const url = await UploadService.issueTempImageUrl(file);
    return res.json({ success: true, url });
  } catch (e: any) {
    if (e?.code === 'UNSUPPORTED_MIME') throw new ApiError(415, '허용되지 않는 이미지 형식입니다.');
    throw e;
  }
};

export const uploadTaskAttachments: RequestHandler = async (req, res) => {
  const taskId = Number(req.params.taskId);
  if (!taskId) throw new ApiError(400, '유효하지 않은 taskId입니다.');
  const file = req.file;
  if (!file) throw new ApiError(400, '업로드된 파일이 없습니다.');
  try {
    await UploadService.attachFileToTask(taskId, file);
    return res.json({ success: true });
  } catch (e: any) {
    if (e?.code === 'UNSUPPORTED_MIME') throw new ApiError(415, '허용되지 않는 파일 형식입니다.');
    throw e;
  }
};
