import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import fileRelPathFromUrl from '#utils/fileRelPathFromUrl';
import filePublicUrl from '#utils/filePublicUrl';
import { StorageService } from '#libs/storage.service';
import reencodeToJpeg from '#utils/reencodeToJpeg';

const ensureDir = async (dir: string) => {
  await fs.mkdir(dir, { recursive: true });
};

const isImageBySharp = async (absPath: string): Promise<boolean> => {
  try {
    const meta = await sharp(absPath).metadata();
    return Boolean(meta && meta.format); // sharp가 파싱 가능하면 이미지로 간주
  } catch {
    return false;
  }
};

/**
 * 임시 업로드 파일을 처리하는 유틸함수입니다.
 *
 * 처리 과정:
 * 1. temp 경로에 있는 파일을 확인합니다.
 * 2. 이미지 파일이면 JPG로 재인코딩하여 최종 경로에 저장합니다.
 * 3. 이미지가 아니면 기존 방식대로 rename 하여 이동합니다.
 * 4. 최종 퍼블릭 URL을 반환합니다.
 *
 * @param tempUrl - /uploads/temp/... 형태의 임시 파일 URL
 * @param finalSubdir - 최종 저장 서브디렉터리
 * @returns - 최종 퍼블릭 URL
 */
export const commitTempFile = async (tempUrl: string, finalSubdir: string): Promise<string> => {
  const rel = fileRelPathFromUrl(tempUrl);

  // temp 경로가 아닌 경우: 이미 최종 경로에 있으므로 그대로 반환
  if (!rel.startsWith('temp/')) {
    return filePublicUrl(rel);
  }

  const tempBaseName = path.basename(rel); // 예: abc.png
  const tempAbs = path.join(StorageService.tempDir(), tempBaseName);

  // 이미지 여부 판별
  const isImage = await isImageBySharp(tempAbs);

  if (!isImage) {
    // 이미지가 아니면 기존 로직 유지 (rename)
    const { finalRel } = await StorageService.moveTempToFinal(tempAbs, tempBaseName, finalSubdir);
    return filePublicUrl(finalRel);
  }

  // 이미지면 JPG로 재인코딩
  const cleanSubdir = finalSubdir.replace(/^\/+|\/+$/g, ''); // 앞뒤 슬래시 제거
  const finalBaseDir = path.join(StorageService.finalRoot(), cleanSubdir);
  await ensureDir(finalBaseDir);

  const baseNameNoExt = path.basename(tempBaseName, path.extname(tempBaseName));
  const finalFileName = `${baseNameNoExt}.jpg`;
  const finalAbs = path.join(finalBaseDir, finalFileName);
  const finalRel = path.posix.join(cleanSubdir, finalFileName);

  await reencodeToJpeg(tempAbs, finalAbs, { quality: 85, progressive: true, mozjpeg: true });

  // temp 원본 제거
  await StorageService.removeTemp(tempAbs);

  return filePublicUrl(finalRel);
};

export default commitTempFile;
