import prisma from '#prisma/prisma';
import type { Prisma, TaskStatus as PrismaTaskStatus } from '@prisma/client';
import type { TaskStatus } from '#constants/taskStatus.constants';

const getProjectScope = (projectId: number, userIdForScope: number) =>
  prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      ownerId: true,
      members: { where: { userId: userIdForScope }, select: { userId: true } },
    },
  });

const createTask = (data: {
  projectId: number;
  title: string;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  assigneeId: number;
}) =>
  prisma.task.create({
    data: {
      project: { connect: { id: data.projectId } },
      title: data.title,
      status: data.status as PrismaTaskStatus,
      startDate: data.startDate,
      endDate: data.endDate,
      assignee: { connect: { id: data.assigneeId } },
    },
    select: { id: true },
  });

const replaceTaskTags = (taskId: number, tagIds: number[]) =>
  prisma.$transaction([
    prisma.taskTag.deleteMany({ where: { taskId } }),
    ...(tagIds.length
      ? [
          prisma.taskTag.createMany({
            data: tagIds.map((tagId) => ({ taskId, tagId })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

const replaceTaskAttachments = (
  taskId: number,
  files: {
    originalName: string;
    storedName: string;
    relPath: string;
    mimeType?: string | null;
    size?: number | null;
    ext?: string | null;
  }[]
) =>
  prisma.$transaction([
    prisma.attachments.deleteMany({ where: { taskId } }),
    ...(files.length
      ? [
          prisma.attachments.createMany({
            data: files.map((file) => ({
              taskId,
              originalName: file.originalName,
              storedName: file.storedName,
              relPath: file.relPath,
              mimeType: file.mimeType ?? null,
              size: file.size ?? null,
              ext: file.ext ?? null,
            })),
          }),
        ]
      : []),
  ]);

const findOrCreateTagsByNames = async (names: string[]) => {
  const unique = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)));
  if (!unique.length) return [] as number[];

  const existing = await prisma.tag.findMany({ where: { name: { in: unique } }, select: { id: true, name: true } });
  const existingNames = new Set(existing.map((tag) => tag.name));
  const toCreate = unique.filter((name) => !existingNames.has(name));

  if (toCreate.length) {
    await prisma.tag.createMany({ data: toCreate.map((name) => ({ name })), skipDuplicates: true });
  }
  const all = await prisma.tag.findMany({ where: { name: { in: unique } }, select: { id: true } });
  return all.map((tag) => tag.id);
};

const findTaskByIdWithRels = (taskId: number, userIdForScope: number) =>
  prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        select: {
          id: true,
          ownerId: true,
          members: { where: { userId: userIdForScope }, select: { userId: true } },
        },
      },
      assignee: { select: { id: true, name: true, email: true, profileImage: true } },
      tags: { include: { tag: { select: { id: true, name: true } } } },
      attachments: { select: { id: true, relPath: true } },
    },
  });

const findProjectTasks = (
  projectId: number,
  opts: {
    status?: TaskStatus;
    assigneeId?: number;
    keyword?: string;
    skip: number;
    take: number;
    sort: 'createdAt' | 'title' | 'endDate';
    order: 'asc' | 'desc';
    userIdForScope: number;
  }
) => {
  const where: Prisma.TaskWhereInput = {
    projectId,
    ...(opts.status ? { status: opts.status as PrismaTaskStatus } : {}),
    ...(opts.assigneeId ? { assigneeId: opts.assigneeId } : {}),
    ...(opts.keyword ? { title: { contains: opts.keyword, mode: 'insensitive' } } : {}),
  };

  const orderBy: Prisma.TaskOrderByWithRelationInput[] = [{ [opts.sort]: opts.order }, { id: 'asc' }];

  return prisma.$transaction([
    prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            ownerId: true,
            members: { where: { userId: opts.userIdForScope }, select: { userId: true } },
          },
        },
        assignee: { select: { id: true, name: true, email: true, profileImage: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
        attachments: { select: { id: true, relPath: true } },
      },
      orderBy,
      skip: opts.skip,
      take: opts.take,
    }),
    prisma.task.count({ where }),
  ]);
};

export default {
  getProjectScope,
  createTask,
  replaceTaskTags,
  replaceTaskAttachments,
  findOrCreateTagsByNames,
  findTaskByIdWithRels,
  findProjectTasks,
};
