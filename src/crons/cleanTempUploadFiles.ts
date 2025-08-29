import { CronJob } from 'cron';
import fs from 'fs/promises';
import path from 'path';

const TEMP_DIR = path.join(process.cwd(), 'uploads', 'temp', 'files');
const TTL_MS = 60 * 60 * 1_000;

/**
 * 일정 시간이 지난 임시 업로드 파일을 삭제합니다.
 * 기본 기준은 생성된 지 1시간(3600000ms)이 지난 파일입니다.
 * 이 함수는 cron job으로 주기적으로 실행되며, 삭제된 파일명을 로그로 출력합니다.
 *
 * @returns {Promise<void>}
 *
 * @example
 * import { tempFileCleanerJob } from '#crons/cleanTempUploads.js';
 * tempFileCleanerJob.start();
 */
const cleanExpiredTempFiles = async (): Promise<void> => {
  const now = Date.now();

  try {
    const files = await fs.readdir(TEMP_DIR);
    for (const file of files) {
      if (file === '.gitkeep') continue;

      const filePath = path.join(TEMP_DIR, file);
      const stat = await fs.stat(filePath);
      if (now - Math.min(stat.ctimeMs, stat.mtimeMs) > TTL_MS) {
        await fs.unlink(filePath);
        console.log(`[cron] 삭제됨: ${filePath}`);
      }
    }
  } catch (err: any) {
    // temp 폴더가 없으면 무시
    if (err?.code === 'ENOENT') return;
    console.error('[cron] 오류:', err);
  }
};

const tempFileCleanerJob = new CronJob('0 * * * *', cleanExpiredTempFiles, null, false, 'Asia/Seoul', null, true);

console.log('[cron] tempFileCleanerJob registered');

export default tempFileCleanerJob;
