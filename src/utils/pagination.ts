import type { ParsedQs } from 'qs';

/**
 * 쿼리 파라미터에서 페이지네이션 옵션을 파싱하는 함수입니다.
 *
 * @param {ParsedQs} q - 요청 쿼리 객체 (req.query 예상)
 * @returns {{
 *   page: number,
 *   size: number,
 *   sort: string,
 *   order: 'asc' | 'desc',
 *   skip: number,
 *   take: number
 * }} - 파싱된 페이지네이션 정보
 *
 * @example
 * // URL: /tasks?page=2&size=10&sort=deadline&order=asc
 * const { page, size, sort, order, skip, take } = parsePageQuery(req.query);
 * // page=2, size=10, sort="deadline", order="asc", skip=10, take=10
 */
export const parsePageQuery = (q: ParsedQs) => {
  const page = Math.max(1, Number(q.page) || 1);
  const size = Math.min(100, Math.max(1, Number(q.size) || 20));
  const sort = typeof q.sort === 'string' ? q.sort : 'createdAt';
  const order: 'asc' | 'desc' = q.order === 'asc' ? 'asc' : 'desc';
  const skip = (page - 1) * size;
  const take = size;
  return { page, size, sort, order, skip, take };
};

/**
 * 페이지네이션 응답 형식을 통일합니다.
 *
 * @template T
 * @param {T[]} items - 데이터 아이템 배열
 * @param {number} total - 전체 아이템 개수
 * @param {number} page - 현재 페이지 번호
 * @param {number} size - 페이지당 아이템 개수
 * @returns {{
 *   success: true,
 *   data: {
 *     items: T[],
 *     page: number,
 *     size: number,
 *     total: number
 *   }
 * }} - 표준화된 리스트 응답 객체
 *
 * @example
 * const tasks = await prisma.task.findMany({ skip, take });
 * const total = await prisma.task.count();
 * res.json(listResponse(tasks, total, page, size));
 */
export const listResponse = <T>(items: T[], total: number, page: number, size: number) => ({
  success: true as const,
  data: { items, page, size, total },
});
