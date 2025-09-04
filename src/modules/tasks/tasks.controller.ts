import type { RequestHandler } from 'express';
import taskService from '#modules/tasks/tasks.service';
import type { PatchTaskBodyDto } from '#modules/tasks/dto/task.dto';
import type { MeTasksQueryDto } from '#modules/tasks/dto/me-tasks.dto';

/**
 * @function getTaskById
 * @description 단일 할 일(Task)을 ID로 조회합니다.
 *
 * @route GET /tasks/:taskId
 * @auth 필요 (Bearer 토큰)
 *
 * @returns {200} PublicTask 객체 반환
 * @throws {400} 잘못된 요청 형식
 * @throws {401} 로그인이 필요합니다
 * @throws {403} 프로젝트 멤버가 아닙니다
 * @throws {404} 할 일을 찾을 수 없습니다
 */
const getTaskById: RequestHandler = async (req, res) => {
  const taskId: number = res.locals.taskId;
  const userId: number = req.user.id;
  const task = await taskService.getTaskById(taskId, userId);
  res.status(200).json(task);
};

/**
 * @function patchTask
 * @description 단일 할 일(Task)을 수정합니다.
 *
 * @route PATCH /tasks/:taskId
 * @auth 필요 (Bearer 토큰)
 *
 * @param {PatchTaskBodyDto} req.body 수정할 Task 데이터
 *
 * @returns {200} 수정된 PublicTask 객체 반환
 * @throws {400} 잘못된 요청 형식
 * @throws {401} 로그인이 필요합니다
 * @throws {403} 프로젝트 멤버가 아닙니다
 * @throws {404} 할 일을 찾을 수 없습니다
 */
const patchTask: RequestHandler = async (req, res) => {
  const taskId: number = res.locals.taskId;
  const userId: number = req.user.id;
  const dto: PatchTaskBodyDto = res.locals.patchBody;
  const updated = await taskService.patchTask(taskId, userId, dto);
  res.status(200).json(updated);
};

/**
 * @function deleteTask
 * @description 단일 할 일(Task)을 삭제합니다.
 *
 * @route DELETE /tasks/:taskId
 * @auth 필요 (Bearer 토큰)
 *
 * @returns {204} No Content
 * @throws {400} 잘못된 요청 형식
 * @throws {401} 로그인이 필요합니다
 * @throws {403} 프로젝트 멤버가 아닙니다
 * @throws {404} 할 일을 찾을 수 없습니다
 */
const deleteTask: RequestHandler = async (req, res) => {
  const taskId: number = res.locals.taskId;
  const userId: number = req.user.id;
  await taskService.deleteTask(taskId, userId);
  res.status(204).end();
};

/**
 * @function getMyTaskList
 * @description 로그인한 사용자의 모든 할 일(Task) 목록을 조회합니다.
 *
 * @route GET /users/me/tasks
 * @auth 필요 (Bearer 토큰)
 *
 * @param {MeTasksQueryDto} req.query 필터 및 페이지네이션 옵션
 *
 * @returns {200} PublicTask[] 배열 반환
 * @throws {400} 잘못된 요청 형식
 * @throws {401} 로그인이 필요합니다
 */
const getMyTaskList: RequestHandler = async (req, res) => {
  const userId: number = req.user.id;
  const query: MeTasksQueryDto = res.locals.meTasksQuery;
  const items = await taskService.getMyTasks(userId, query);
  res.status(200).json(items);
};

/**
+ * POST /tasks/:taskId/attachments
+ * 임시 URL들을 실제 경로로 커밋하고 첨부를 전체 교체합니다.
+ */
const commitAttachments: RequestHandler = async (req, res) => {
  const taskId: number = res.locals.taskId;
  const userId: number = req.user.id;
  const { urls } = res.locals.commitBody as { urls: string[] };
  const updated = await taskService.commitAttachments(taskId, userId, urls);
  res.status(200).json(updated);
};

export default {
  getTaskById,
  patchTask,
  deleteTask,
  getMyTaskList,
  commitAttachments,
};
