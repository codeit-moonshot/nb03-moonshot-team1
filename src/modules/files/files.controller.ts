import type { RequestHandler } from 'express';
import ApiError from '#errors/ApiError';
import { UploadService } from '#modules/files/files.service';

export const uploadTempFiles: RequestHandler = async (req, res) => {
  const files = (req.files as Express.Multer.File[]) ?? [];
  if (!files.length) throw new ApiError(400, '업로드된 파일이 없습니다.');

  try {
    const urls = await UploadService.issueTempUrls(files);
    return res.json(urls);
  } catch (err: any) {
    if (err?.code === 'UNSUPPORTED_MIME') {
      throw new ApiError(415, '허용되지 않는 파일 형식입니다.');
    }
    throw err;
  }
};
