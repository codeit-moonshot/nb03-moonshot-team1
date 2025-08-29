import path from 'node:path';
import ApiError from '#errors/ApiError';
import googleCalendarService from '#libs/googleCalendar.service';
import tasksService from '#modules/tasks/tasks.service';
import fileRelPathFromUrl from '#utils/fileRelPathFromUrl';
import toPublicTask from '#modules/tasks/tasks.utils';
import projectTasksRepo from '#modules/tasks/projects/projectTasks.repo';
import type { PublicTask } from '#modules/tasks/dto/task.dto';
import type { CreateProjectTaskDto, ListProjectTasksQueryDto } from '#modules/tasks/projects/dto/projects-tasks.dto';
import { GoogleEventCreateDto } from '#modules/tasks/dto/googleEvent.dto';

/* -------------------------------------------------------------------------- */
/*                                 helper                                     */
/* -------------------------------------------------------------------------- */

const assertProjectAccess = async (projectId: number, userId: number) => {
  const project = await projectTasksRepo.getProjectScope(projectId, userId);
  if (!project) throw new ApiError(404, '프로젝트를 찾을 수 없습니다.');

  const isOwner = project.ownerId === userId;
  const isMember = project.members.length > 0;
  if (!isOwner && !isMember) throw new ApiError(403, '프로젝트 멤버가 아닙니다');
};

/* -------------------------------------------------------------------------- */
/*                                Services                                    */
/* -------------------------------------------------------------------------- */

/**
 * POST /projects/:projectId/tasks
 */
const createTaskInProject = async (
  projectId: number,
  userId: number,
  body: CreateProjectTaskDto
): Promise<PublicTask> => {
  await assertProjectAccess(projectId, userId);

  const startDate = new Date(Date.UTC(body.startYear, body.startMonth - 1, body.startDay));
  const endDate = new Date(Date.UTC(body.endYear, body.endMonth - 1, body.endDay));

  // 생성
  const created = await projectTasksRepo.createTask({
    projectId,
    title: body.title,
    status: body.status ?? 'todo',
    startDate,
    endDate,
    assigneeId: userId,
  });
  //구글 계정 존재시 캘린더에 반영
  const tokenDto = await tasksService.getGoogleSocialToken(userId);
  if (tokenDto) {
    const event: GoogleEventCreateDto = {
      summary: body.title,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Asia/Seoul',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Asia/Seoul',
      },
    };
    const eventId = await googleCalendarService.createEvent(userId, tokenDto, event);
    if (eventId) await tasksService.updateGoogleEventId(created.id, eventId);
  }

  // 태그 연결
  if (body.tags?.length) {
    const tagIds = await projectTasksRepo.findOrCreateTagsByNames(body.tags);
    await projectTasksRepo.replaceTaskTags(created.id, tagIds);
  }

  // 첨부 연결
  if (body.attachments?.length) {
    const files = body.attachments.map((url) => {
      const relPath = fileRelPathFromUrl(url);
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
    await projectTasksRepo.replaceTaskAttachments(created.id, files);
  }

  // 응답 후 매핑
  const full = await projectTasksRepo.findTaskByIdWithRels(created.id, userId);
  if (!full) throw new ApiError(404, '할 일을 찾을 수 없습니다.');
  return toPublicTask(full);
};

/**
 * GET /projects/:projectId/tasks
 */
const listProjectTasks = async (
  projectId: number,
  userId: number,
  query: ListProjectTasksQueryDto
): Promise<{ data: PublicTask[]; total: number }> => {
  await assertProjectAccess(projectId, userId);

  const sortMap: Record<typeof query.order_by, 'createdAt' | 'title' | 'endDate'> = {
    created_at: 'createdAt',
    name: 'title',
    end_date: 'endDate',
  };

  const skip = (query.page - 1) * query.limit;
  const take = query.limit;

  const [rows, total] = await projectTasksRepo.findProjectTasks(projectId, {
    status: query.status,
    assigneeId: query.assignee,
    keyword: query.keyword,
    skip,
    take,
    sort: sortMap[query.order_by],
    order: query.order,
    userIdForScope: userId,
  });

  return { data: rows.map(toPublicTask), total };
};

export default {
  createTaskInProject,
  listProjectTasks,
};
