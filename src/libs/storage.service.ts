import path from 'path';
import fs from 'fs/promises';
import dayjs from 'dayjs';

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

export const StorageService = {
  getBaseUrl() {
    return process.env.NODE_ENV === 'production'
      ? (process.env.BASE_URL as string)
      : `${process.env.BASE_URL_DEV}:${process.env.PORT || 3001}`;
  },

  taskRelBase(taskId: number) {
    const d = dayjs();
    return path.posix.join('tasks', String(d.year()), d.format('MM'), d.format('DD'), String(taskId));
  },

  getExtLower(filename: string) {
    const ext = path.extname(filename).replace('.', '');
    return ext ? ext.toLowerCase() : null;
  },

  async moveTempToTask(taskId: number, tempAbsPath: string, storedName: string) {
    const relBase = StorageService.taskRelBase(taskId);
    const absBase = path.join(UPLOAD_ROOT, relBase);
    await fs.mkdir(absBase, { recursive: true });

    const finalAbs = path.join(absBase, storedName);
    const finalRel = path.posix.join(relBase, storedName);
    await fs.rename(tempAbsPath, finalAbs);

    return { finalAbs, finalRel };
  },

  async removeTemp(absPath: string) {
    await fs.unlink(absPath).catch(() => {});
  },
};
