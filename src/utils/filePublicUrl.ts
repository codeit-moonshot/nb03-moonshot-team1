import { FILE_BASE_URL, IS_PROD } from '#config/env';

/**
 * 상대 경로(relPath)를 퍼블릭 접근 가능한 URL로 변환합니다.
 *
 * - FILE_BASE_URL 설정 시에: `${FILE_BASE_URL}/${relPath}`
 * - FILE_BASE_URL 이 없으면: relPath 그대로 반환 (개발/테스트 편의용 fallback)
 *
 * @example
 *  FILE_BASE_URL=https://cdn.example.com
 *  filePublicUrl("tasks/2025/08/19/uuid.pdf")
 *  -> "https://cdn.example.com/tasks/2025/08/19/uuid.pdf"
 */
const filePublicUrl = (relPath: string) => {
  const clean = relPath.replace(/^\/+/, '');
  if (IS_PROD && !FILE_BASE_URL) {
    throw new Error('❌ FILE_BASE_URL is required in production');
  }
  return FILE_BASE_URL ? `${FILE_BASE_URL}/${clean}` : clean;
};

export default filePublicUrl;
