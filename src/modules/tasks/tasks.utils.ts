import { TASK_STATUS, type TaskStatus } from '#constants/taskStatus.constants';
import type { PublicTask } from '#modules/tasks/dto/task.dto';
import filePublicUrl from '#utils/filePublicUrl';

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

export default toPublicTask;
