import path from 'path';
import fileRelPathFromUrl from '#utils/fileRelPathFromUrl';
import filePublicUrl from '#utils/filePublicUrl';
import { StorageService } from '#libs/storage.service';

/**
 * 임시 업로드 파일을 처리하는 유틸함수입니다.
 * 1. 임시 업로드 파일을 최종 경로로 이동시킵니다.
 * 2. 퍼블릭 URL을 반환합니다.
 *
 * @param tempUrl - /uploads/temp/... 형태의 임시 파일 URL
 * @param finalSubdir - 최종 저장 서브디렉터리
 * @returns - 최종 퍼블릭 URL
 */
const commitTempFile = async (tempUrl: string, finalSubdir: string): Promise<string> => {
  const rel = fileRelPathFromUrl(tempUrl);
  const name = path.basename(rel);
  const src = path.join(StorageService.tempDir(), name);
  const { finalRel } = await StorageService.moveTempToFinal(src, name, finalSubdir);
  return filePublicUrl(finalRel);
};

export default commitTempFile;
