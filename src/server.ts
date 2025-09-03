import http from 'http';
import app from './app';
import env from '#config/env';
import prisma from '#prisma/prisma';
import tempFileCleanerJob from '#crons/cleanTempUploadFiles';

const PORT = env.PORT || 3000;

const server = http.createServer(app);

/**
 * DB 연결 테스트
 */
void (async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Failed to connect to database', err);
    process.exit(1);
  }
})();

/**
 * 임시 파일 삭제
 */
tempFileCleanerJob.start();

/**
 * 서버 실행
 */
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

/**
 * 전역 예외 처리
 * - 비동기 처리 누락, 미처 핸들링되지 않은 에러 방지
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * 프로세스 재시작 필요
 */
process.on('uncaughtException', (err) => {
  console.error('🚫 Uncaught Exception thrown:', err);
  process.exit(1);
});
