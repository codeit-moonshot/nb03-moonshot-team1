import { fileTypeFromFile } from 'file-type';
import { isAllowedMime } from '#constants/mime';

type MulterFile = Express.Multer.File;

export const detectMime = async (filePath: string): Promise<string | null> => {
  const res = await fileTypeFromFile(filePath).catch(() => null);
  return res?.mime ?? null;
};

export const assertAllowedByMagic = async (file: MulterFile, allow: ReadonlySet<string>): Promise<void> => {
  const mime = await detectMime(file.path);
  if (!mime || !isAllowedMime(mime, allow)) {
    const err = new Error('UNSUPPORTED_MIME');
    (err as any).code = 'UNSUPPORTED_MIME';
    throw err;
  }
};
