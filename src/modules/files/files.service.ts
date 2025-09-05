import { IMAGE_MIME_SET, DEFAULT_FILE_MIME_SET } from '#constants/mime.constants';
import { assertAllowedByMagic } from '#libs/mime.service';
import filePublicUrl from '#utils/filePublicUrl';

type MulterFile = Express.Multer.File;

const ALLOWED_MIME_SET = new Set<string>([...Array.from(IMAGE_MIME_SET), ...Array.from(DEFAULT_FILE_MIME_SET)]);

export const UploadService = {
  /**
   * temp 저장된 파일들에 대해 MIME 검증 후 접근 URL 발급
   */
  async issueTempUrls(files: MulterFile[]) {
    const urls: string[] = [];
    for (const file of files) {
      await assertAllowedByMagic(file, ALLOWED_MIME_SET);
      urls.push(filePublicUrl(`temp/${file.filename}`));
    }
    return urls;
  },
};
