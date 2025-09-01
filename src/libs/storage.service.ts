import path from 'path';
import fs from 'fs/promises';
import { UPLOAD_ROOT as UPLOAD_ROOT_CFG } from '#config/env';

/**
 * UPLOAD_ROOT 경로 보정
 */
const UPLOAD_ROOT = path.isAbsolute(UPLOAD_ROOT_CFG) ? UPLOAD_ROOT_CFG : path.join(process.cwd(), UPLOAD_ROOT_CFG);

/**
 * 디렉토리 보정
 */
const ensureDir = async (dir: string) => {
  await fs.mkdir(dir, { recursive: true });
};

export const StorageService = {
  tempDir(): string {
    return path.join(UPLOAD_ROOT, 'temp', 'files'); // uploads/temp/files
  },

  /**
   * temp 파일을 최종 서브 경로로 이동
   * @param finalSubdir - 서브 경로
   * @returns { finalAbs, finalRel }
   *  - finalRel: files/<finalSubdir>/<storedName>
   */
  async moveTempToFinal(tempAbsPath: string, storedName: string, finalSubdir: string) {
    const cleanSubdir = finalSubdir.replace(/^\/+|\/+$/g, ''); // 앞뒤 슬래시 제거
    const relBase = path.posix.join('files', cleanSubdir);
    const absBase = path.join(UPLOAD_ROOT, relBase);
    await ensureDir(absBase);

    const finalAbs = path.join(absBase, storedName);
    const finalRel = path.posix.join(relBase, storedName);

    await fs.rename(tempAbsPath, finalAbs);
    return { finalAbs, finalRel };
  },

  /**
   * temp 파일 제거(존재하지 않아도 무시)
   */
  async removeTemp(absPath: string) {
    await fs.unlink(absPath).catch(() => {});
  },
};

export default StorageService;
