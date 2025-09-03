import path from 'node:path';
import dayjs from 'dayjs';
import ApiError from '#errors/ApiError';
import fileRelPathFromUrl from '#utils/fileRelPathFromUrl';
import commitTempFile from '#utils/commitTempFile';
import type { TaskStatus } from '#constants/taskStatus.constants';
import toPublicTask from '#modules/tasks/tasks.utils';
import tasksRepo from '#modules/tasks/tasks.repo';
import type { PublicTask, PatchTaskBodyDto } from '#modules/tasks/dto/task.dto';
import type { MeTasksQueryDto } from '#modules/tasks/dto/me-tasks.dto';
import { UpdateGoogleAccessTokenDto, GoogleTokenDto, GoogleEventUpdateDto } from '#modules/tasks/dto/googleEvent.dto';
import googleCalendarService from '#libs/googleCalendar.service';

/* -------------------------------------------------------------------------- */
/*                                 helper                                     */
/* -------------------------------------------------------------------------- */

const startOfDayUTC = (date: string) => new Date(`${date}T00:00:00.000Z`);
const endOfDayUTC = (date: string) => new Date(`${date}T23:59:59.999Z`);

const ensureTaskAndAccess = async (taskId: number, userId: number) => {
  const task = await tasksRepo.findById(taskId, userId);
  if (!task) throw new ApiError(404, '할 일을 찾을 수 없습니다.');

  const isOwner = task.project.ownerId === userId;
  const isMember = task.project.members.length > 0;
  if (!isOwner && !isMember) throw new ApiError(403, '프로젝트 멤버가 아닙니다');

  return task;
};

/* -------------------------------------------------------------------------- */
/*                                Services                                    */
/* -------------------------------------------------------------------------- */

/**
 * GET /tasks/:taskId
 */
const getTaskById = async (taskId: number, userId: number): Promise<PublicTask> => {
  const task = await ensureTaskAndAccess(taskId, userId);
  return toPublicTask(task);
};

/**
 * GET /users/me/tasks
 */
const getMyTasks = async (userId: number, query: MeTasksQueryDto): Promise<PublicTask[]> => {
  const { from, to, project_id, status, assignee, keyword, page, size, sort, order } = query;

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
  const task = await ensureTaskAndAccess(taskId, userId);

  const core: { title?: string; status?: TaskStatus; assigneeId?: number | null; startDate?: Date; endDate?: Date } =
    {};

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

  const effectiveStart = core.startDate ?? task.startDate;
  const effectiveEnd = core.endDate ?? task.endDate;

  if (core.startDate !== undefined || core.endDate !== undefined) {
    if (dayjs(effectiveStart).isAfter(effectiveEnd)) throw ApiError.badRequest('시작일은 종료일보다 늦을 수 없습니다.');
  }

  if (Object.keys(core).length) {
    await tasksRepo.update(taskId, core);
    if (task.googleEventId) {
      const tokenDto = await tasksRepo.getGoogleSocialToken(userId);
      if (!tokenDto) throw ApiError.notFound('구글 토큰을 찾을 수 없습니다.');
      const event: GoogleEventUpdateDto = {
        id: task.googleEventId,
        ...(core.title && { summary: core.title }),
        ...(core.startDate && { start: { dateTime: core.startDate.toISOString(), timeZone: 'Asia/Seoul' } }),
        ...(core.endDate && { end: { dateTime: core.endDate.toISOString(), timeZone: 'Asia/Seoul' } }),
      };
      await googleCalendarService.updateEvent(userId, tokenDto, event);
    }
  }

  if (Array.isArray(body.tags)) {
    const tagIds = await tasksRepo.findOrCreateTagsByNames(body.tags);
    await tasksRepo.updateTags(taskId, tagIds);
  }

  if (Array.isArray(body.attachments)) {
    const uniqUrls = Array.from(new Set(body.attachments.filter(Boolean)));
    const committedUrls = await Promise.all(uniqUrls.map((url) => commitTempFile(url, `tasks/${taskId}`)));
    const files = committedUrls.map((finalUrl) => {
      const relPath = fileRelPathFromUrl(finalUrl);
      const storedName = path.basename(relPath);
      const dot = storedName.lastIndexOf('.');
      const ext = dot > -1 ? storedName.slice(dot + 1) : null;
      return {
        originalName: storedName,
        storedName,
        relPath,
        mimeType: null,
        size: null,
        ext,
      };
    });
    await tasksRepo.updateAttachments(taskId, files);
  }

  const updated = await tasksRepo.findById(taskId, userId);
  if (!updated) throw new ApiError(404, '할 일을 찾을 수 없습니다.');
  return toPublicTask(updated);
};

/**
 * DELETE /tasks/:taskId
 */
const deleteTask = async (taskId: number, userId: number) => {
  const task = await ensureTaskAndAccess(taskId, userId);
  if (task.googleEventId) {
    const tokenDto = await tasksRepo.getGoogleSocialToken(userId);
    if (!tokenDto) throw ApiError.notFound('구글 토큰을 찾을 수 없습니다.');
    await googleCalendarService.deleteEvent(userId, task.googleEventId, tokenDto);
  }
  return tasksRepo.remove(taskId);
};

// 구글 엑세스 토큰 업데이트
const updateGoogleAccessToken = async (updateGoogleAccessTokenDto: UpdateGoogleAccessTokenDto): Promise<void> => {
  await tasksRepo.updateGoogleAccessToken(updateGoogleAccessTokenDto);
};

// 구글 토큰 획득
const getGoogleSocialToken = (userId: number): Promise<GoogleTokenDto | null> => {
  return tasksRepo.getGoogleSocialToken(userId);
};
// 구글 이벤트 id 업데이트
const updateGoogleEventId = async (taskId: number, googleEventId: string): Promise<void> => {
  await tasksRepo.updateGoogleEventId(taskId, googleEventId);
};

export default {
  getTaskById,
  getMyTasks,
  patchTask,
  deleteTask,
  getGoogleSocialToken,
  updateGoogleAccessToken,
  updateGoogleEventId,
};
