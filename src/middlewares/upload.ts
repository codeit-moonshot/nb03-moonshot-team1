import multer, { Multer, MulterError } from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from '#errors/ApiError';
import crypto from 'crypto';
import type { RequestHandler } from 'express';
import { IMAGE_MIME_SET, DEFAULT_FILE_MIME_SET, isAllowedMime } from '#constants/mime';

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

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

const handleMulter =
  (upload: ReturnType<Multer['single']>): RequestHandler =>
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
          case 'LIMIT_UNEXPECTED_FILE':
            message = '허용되지 않은 파일 또는 필드입니다.';
            break;
        }
        throw new ApiError(400, message);
      }
      if (err) throw new ApiError(500, '파일 업로드 중 서버 오류가 발생했습니다.');
      next();
    });
  };

/**
 * 이미지 전용 업로드 (단일 파일: field="image")
 */
const createImageUploader = ({
  fileSize = 1 * 1024 * 1024, // 1MB
}: {
  fileSize?: number;
} = {}): RequestHandler[] => {
  type MulterOptions = NonNullable<Parameters<typeof multer>[0]>;
  const fileFilter: MulterOptions['fileFilter'] = (_req, file, cb) => {
    if (isAllowedMime(file.mimetype, IMAGE_MIME_SET)) cb(null, true);
    else cb(new MulterError('LIMIT_UNEXPECTED_FILE'));
  };

  const dest = path.join(UPLOAD_ROOT, 'temp', 'images');

  const upload = multer({
    storage: makeDiskStorage(dest),
    fileFilter,
    limits: { fileSize },
  }).single('image');

  return [handleMulter(upload)];
};

/**
 * 일반 파일 업로드 (단일 파일: field="file")
 */
const createFileUploader = ({
  fileSize = 10 * 1024 * 1024, // 10MB
  allowedMimeTypes,
}: {
  fileSize?: number;
  allowedMimeTypes?: string[];
} = {}): RequestHandler[] => {
  const allowSet: ReadonlySet<string> =
    allowedMimeTypes && allowedMimeTypes.length > 0 ? new Set(allowedMimeTypes) : DEFAULT_FILE_MIME_SET;

  type MulterOptions = NonNullable<Parameters<typeof multer>[0]>;
  const fileFilter: MulterOptions['fileFilter'] = (_req, file, cb) => {
    if (isAllowedMime(file.mimetype, allowSet)) cb(null, true);
    else cb(new MulterError('LIMIT_UNEXPECTED_FILE'));
  };

  const dest = path.join(UPLOAD_ROOT, 'temp', 'files');

  const upload = multer({
    storage: makeDiskStorage(dest),
    fileFilter,
    limits: { fileSize },
  }).single('file');

  return [handleMulter(upload)];
};

export default {
  createImageUploader,
  createFileUploader,
};
