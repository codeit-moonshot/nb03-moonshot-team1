import type { RequestHandler } from 'express';
import proejctTasksService from '#modules/tasks/projects/projectTasks.service';
import type { CreateProjectTaskDto, ListProjectTasksQueryDto } from '#modules/tasks/projects/dto/projects-tasks.dto';

/**
 * @function createTaskInProject
 * @description 프로젝트 내에 새로운 할 일을 생성합니다.
 *
 * @route POST /projects/:projectId/tasks
 * @auth 필요 (Bearer 토큰)
 *
 * @param {CreateProjectTaskDto} req.body 생성할 Task 데이터
 *
 * @returns {200} 생성된 PublicTask 객체 반환
 * @throws {400} 잘못된 요청 형식
 * @throws {401} 로그인이 필요합니다
 * @throws {403} 프로젝트 멤버가 아닙니다
 * @throws {404} 프로젝트를 찾을 수 없습니다
 */
const createTaskInProject: RequestHandler = async (req, res) => {
  const projectId: number = res.locals.projectId;
  const userId: number = req.user.id;
  const dto: CreateProjectTaskDto = res.locals.createBody;
  const item = await proejctTasksService.createTaskInProject(projectId, userId, dto);
  res.status(200).json(item);
};

/**
 * @function listProjectTasks
 * @description 특정 프로젝트의 할 일 목록을 조회합니다.
 *
 * @route GET /projects/:projectId/tasks
 * @auth 필요 (Bearer 토큰)
 *
 * @param {ListProjectTasksQueryDto} req.query 필터 및 페이지네이션 옵션
 *
 * @returns {200} { data: PublicTask[], total: number } 반환
 * @throws {400} 잘못된 요청 형식
 * @throws {401} 로그인이 필요합니다
 * @throws {403} 프로젝트 멤버가 아닙니다
 * @throws {404} 프로젝트를 찾을 수 없습니다
 */
const listProjectTasks: RequestHandler = async (req, res) => {
  const projectId: number = res.locals.projectId;
  const userId: number = req.user.id;
  const query: ListProjectTasksQueryDto = res.locals.listQuery;
  const { data, total } = await proejctTasksService.listProjectTasks(projectId, userId, query);
  res.status(200).json({ data, total });
};

export default {
  createTaskInProject,
  listProjectTasks,
};
