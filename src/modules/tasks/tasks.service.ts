import ApiError from '#errors/ApiError';
import filePublicUrl from '#utils/filePublicUrl';
import { TASK_STATUS, type TaskStatus } from '#constants/taskStatus.constants';
import tasksRepo from '#modules/tasks/tasks.repo';
import type { PublicTask, PatchTaskBodyDto } from '#modules/tasks/dto/task.dto';
import type { MeTasksQueryDto } from '#modules/tasks/dto/me-tasks.dto';

/* -------------------------------------------------------------------------- */
/*                                 helper                                     */
/* -------------------------------------------------------------------------- */

const startOfDayUTC = (date: string) => new Date(`${date}T00:00:00.000Z`);
const endOfDayUTC = (date: string) => new Date(`${date}T23:59:59.999Z`);

const toApiStatus = (status: string): TaskStatus =>
  (TASK_STATUS as readonly string[]).includes(status) ? (status as TaskStatus) : 'todo';

const toPublicTask = (task: any): PublicTask => {
  const startDate = new Date(task.startDate);
  const endDate = new Date(task.endDate);
  return {
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    startYear: startDate.getUTCFullYear(),
    startMonth: startDate.getUTCMonth() + 1,
    startDay: startDate.getUTCDate(),
    endYear: endDate.getUTCFullYear(),
    endMonth: endDate.getUTCMonth() + 1,
    endDay: endDate.getUTCDate(),
    status: toApiStatus(task.status as unknown as string),
    assignee: task.assignee
      ? {
          id: task.assignee.id,
          name: task.assignee.name,
          email: task.assignee.email,
          profileImage: task.assignee.profileImage ?? null,
        }
      : null,
    tags: task.tags.map((tag: any) => ({ id: tag.tag.id, name: tag.tag.name })),
    attachments: task.attachments.map((attachment: any) => ({
      id: attachment.id,
      url: filePublicUrl(attachment.relPath),
    })),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

/* -------------------------------------------------------------------------- */
/*                                Services                                    */
/* -------------------------------------------------------------------------- */

/**
 * GET /tasks/:taskId
 */
const getTaskById = async (taskId: number, userId: number): Promise<PublicTask> => {
  const task = await tasksRepo.findById(taskId, userId);
  if (!task) throw new ApiError(404, '할 일을 찾을 수 없습니다.');

  const isOwner = task.project.ownerId === userId;
  const isMember = task.project.members.length > 0;
  if (!isOwner && !isMember) throw new ApiError(403, '프로젝트 멤버가 아닙니다');

  return toPublicTask(task);
};

/**
 * GET /users/me/tasks
 */
const getMyTasks = async (userId: number, q: MeTasksQueryDto): Promise<PublicTask[]> => {
  const { from, to, project_id, status, assignee, keyword, page, size, sort, order } = q;

  const range =
    from || to
      ? {
          from: from ? startOfDayUTC(from) : undefined,
          to: to ? endOfDayUTC(to) : undefined,
        }
      : undefined;

  if (range?.from && range?.to && range.from > range.to) {
    throw ApiError.badRequest('잘못된 요청 형식');
  }

  const skip = (page - 1) * size;
  const take = size;
  const statusIn = status ? [status] : undefined;

  const [rows] = await tasksRepo.findMany(userId, {
    range,
    projectId: project_id,
    assigneeId: assignee,
    keyword,
    statusIn,
    skip,
    take,
    sort,
    order,
  });

  return rows.map(toPublicTask);
};

/**
 * PATCH /tasks/:taskId
 */
const patchTask = async (taskId: number, userId: number, body: PatchTaskBodyDto): Promise<PublicTask> => {
  const existing = await tasksRepo.findById(taskId, userId);
  if (!existing) throw new ApiError(404, '할 일을 찾을 수 없습니다.');

  const isOwner = existing.project.ownerId === userId;
  const isMember = existing.project.members.length > 0;
  if (!isOwner && !isMember) throw new ApiError(403, '프로젝트 멤버가 아닙니다');

  const core: {
    title?: string;
    status?: TaskStatus;
    assigneeId?: number | null;
    startDate?: Date;
    endDate?: Date;
  } = {};

  if (body.title !== undefined) core.title = body.title;
  if (body.status !== undefined) core.status = body.status;
  if (body.assigneeId !== undefined) core.assigneeId = body.assigneeId ?? null;

  if (body.startYear !== undefined) {
    if (body.startMonth === undefined || body.startDay === undefined)
      throw ApiError.badRequest('startYear/startMonth/startDay는 함께 제공되어야 합니다.');
    core.startDate = new Date(Date.UTC(body.startYear, body.startMonth - 1, body.startDay));
  }
  if (body.endYear !== undefined) {
    if (body.endMonth === undefined || body.endDay === undefined)
      throw ApiError.badRequest('endYear/endMonth/endDay는 함께 제공되어야 합니다.');
    core.endDate = new Date(Date.UTC(body.endYear, body.endMonth - 1, body.endDay));
  }

  if (Object.keys(core).length) await tasksRepo.update(taskId, core);

  const updated = await tasksRepo.findById(taskId, userId);
  if (!updated) throw new ApiError(404, '할 일을 찾을 수 없습니다.');
  return toPublicTask(updated);
};

/**
 * DELETE /tasks/:taskId
 */
const deleteTask = async (taskId: number, userId: number) => {
  const task = await tasksRepo.findById(taskId, userId);
  if (!task) throw new ApiError(404, '할 일을 찾을 수 없습니다.');

  const isOwner = task.project.ownerId === userId;
  const isMember = task.project.members.length > 0;
  if (!isOwner && !isMember) throw new ApiError(403, '프로젝트 멤버가 아닙니다');

  return tasksRepo.remove(taskId);
};

export default {
  getTaskById,
  getMyTasks,
  patchTask,
  deleteTask,
};
