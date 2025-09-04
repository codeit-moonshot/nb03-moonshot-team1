import multer, { Multer, MulterError } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import type { RequestHandler } from 'express';
import ApiError from '#errors/ApiError';
import { IMAGE_MIME_SET, DEFAULT_FILE_MIME_SET, isAllowedMime } from '#constants/mime.constants';
import env from '#config/env';

const UPLOAD_ROOT = path.join(process.cwd(), env.UPLOAD_ROOT);
const TEMP_DIR = path.join(UPLOAD_ROOT, 'temp', 'files');

const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const makeDiskStorage = (dest: string) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const safeBase = Buffer.from(base, 'utf8').toString('hex');
      const uuid = crypto.randomUUID();
      cb(null, `${safeBase}-${uuid}${ext}`);
    },
  });

type MulterRunner = ReturnType<Multer['single']> | ReturnType<Multer['array']>;

const handleMulter =
  (upload: MulterRunner): RequestHandler =>
  (req, res, next) => {
    const ct = req.headers['content-type'];
    if (!ct || !ct.includes('multipart/form-data')) return next();

    upload(req, res, (err) => {
      if (err instanceof MulterError) {
        let message = '파일 업로드 오류입니다.';
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            message = '파일 용량 제한을 초과했습니다.';
            break;
          case 'LIMIT_FILE_COUNT':
            message = '허용된 파일 개수를 초과했습니다.';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = '허용되지 않은 파일 또는 필드입니다.';
            break;
        }
        return next(new ApiError(400, message));
      }
      if (err) return next(new ApiError(500, '파일 업로드 중 서버 오류가 발생했습니다.'));
      next();
    });
  };

const createMultiAnyUploader = ({
  fileSize = 1 * 1024 * 1024,
  maxCount = 5,
}: {
  fileSize?: number;
  maxCount?: number;
} = {}): RequestHandler[] => {
  const ALLOWED = new Set<string>([...IMAGE_MIME_SET, ...DEFAULT_FILE_MIME_SET]);

  type MulterOptions = NonNullable<Parameters<typeof multer>[0]>;
  const fileFilter: MulterOptions['fileFilter'] = (_req, file, cb) => {
    if (isAllowedMime(file.mimetype, ALLOWED)) cb(null, true);
    else cb(new MulterError('LIMIT_UNEXPECTED_FILE'));
  };

  const upload = multer({
    storage: makeDiskStorage(TEMP_DIR),
    fileFilter,
    limits: { fileSize, files: maxCount },
  }).array('files', maxCount);

  return [handleMulter(upload)];
};

export default {
  createMultiAnyUploader,
};
