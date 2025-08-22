import ApiError from '#errors/ApiError';
import { IMAGE_MIME_SET, DEFAULT_FILE_MIME_SET } from '#constants/mime';
import { assertAllowedByMagic } from '#libs/mime.service';
import { StorageService } from '#libs/storage.service';
import { AttachmentRepo } from './repo';

type MulterFile = Express.Multer.File;

export const UploadService = {
  issueTempImageUrl: async (file: MulterFile) => {
    await assertAllowedByMagic(file, IMAGE_MIME_SET);
    const BASE_URL = StorageService.getBaseUrl();
    return `${BASE_URL}/api/files/temp/images/${file.filename}`;
  },

  attachFileToTask: async (taskId: number, file: MulterFile) => {
    await assertAllowedByMagic(file, DEFAULT_FILE_MIME_SET);
    try {
      const { finalRel } = await StorageService.moveTempToTask(taskId, file.path, file.filename);
      await AttachmentRepo.create({
        taskId,
        originalName: file.originalname,
        storedName: file.filename,
        relPath: finalRel,
        mimeType: file.mimetype ?? null,
        size: typeof file.size === 'number' ? file.size : null,
        ext: StorageService.getExtLower(file.filename),
      });
      return { relPath: finalRel };
    } catch {
      await StorageService.removeTemp(file.path);
      throw new ApiError(500, '첨부파일 저장 중 오류가 발생했습니다.');
    }
  },
};
