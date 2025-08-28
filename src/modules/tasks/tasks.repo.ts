import prisma from '#prisma/prisma';
import type { Prisma, TaskStatus as PrismaTaskStatus } from '@prisma/client';
import type { TaskStatus } from '#constants/taskStatus.constants';

/* -------------------------------------------------------------------------- */
/*                                  GET                                       */
/* -------------------------------------------------------------------------- */

/**
 * GET /tasks/:taskId
 */
const findById = (id: number, userIdForScope: number) =>
  prisma.task.findUnique({
    where: { id },
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

/**
 * GET /users/me/tasks
 */
const findMany = (
  userId: number,
  options: {
    range?: { from?: Date; to?: Date };
    projectId?: number;
    assigneeId?: number;
    keyword?: string;
    statusIn?: TaskStatus[];
    skip?: number;
    take?: number;
    sort?: 'createdAt' | 'startDate' | 'endDate' | 'id';
    order?: 'asc' | 'desc';
  }
) => {
  const { range, projectId, assigneeId, keyword, statusIn, skip, take, sort = 'createdAt', order = 'desc' } = options;

  const scope: Prisma.TaskWhereInput = {
    OR: [{ project: { ownerId: userId } }, { project: { members: { some: { userId } } } }],
  };

  const dateWhere: Prisma.TaskWhereInput =
    range?.from || range?.to
      ? {
          AND: [range?.to ? { startDate: { lte: range.to } } : {}, range?.from ? { endDate: { gte: range.from } } : {}],
        }
      : {};

  const where: Prisma.TaskWhereInput = {
    ...scope,
    ...(projectId ? { projectId } : {}),
    ...(assigneeId ? { assigneeId } : {}),
    ...(keyword ? { title: { contains: keyword, mode: 'insensitive' } } : {}),
    ...(statusIn?.length ? { status: { in: statusIn as any } } : {}),
    ...dateWhere,
  };

  const orderBy: Prisma.TaskOrderByWithRelationInput[] = [{ [sort]: order }, { id: 'asc' }];

  return prisma.$transaction([
    prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, email: true, profileImage: true } },
        tags: { include: { tag: { select: { id: true, name: true } } } },
        attachments: { select: { id: true, relPath: true } },
      },
      orderBy,
      ...(typeof skip === 'number' ? { skip } : {}),
      ...(typeof take === 'number' ? { take } : {}),
    }),
    prisma.task.count({ where }),
  ]);
};

/* -------------------------------------------------------------------------- */
/*                                 PATCH                                      */
/* -------------------------------------------------------------------------- */

/**
 * PATCH /tasks/:taskId
 */
const update = (
  id: number,
  data: {
    title?: string;
    status?: TaskStatus;
    assigneeId?: number | null;
    startDate?: Date;
    endDate?: Date;
  }
) => {
  const payload: Prisma.TaskUpdateInput = {};

  payload.title = data.title;
  payload.status = data.status as PrismaTaskStatus;
  payload.startDate = data.startDate;
  payload.endDate = data.endDate;

  if ('assigneeId' in data) {
    if (data.assigneeId === null) {
      payload.assignee = { disconnect: true };
    } else if (typeof data.assigneeId === 'number') {
      payload.assignee = { connect: { id: data.assigneeId } };
    }
  }

  return prisma.task.update({
    where: { id },
    data: payload,
  });
};

/**
 * PATCH /tasks/:taskId (tags)
 */
const updateTags = (taskId: number, tagIds: number[]) =>
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

/**
 * PATCH /tasks/:taskId (attachments)
 */
const updateAttachments = (
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
            data: files.map((f) => ({
              taskId,
              originalName: f.originalName,
              storedName: f.storedName,
              relPath: f.relPath,
              mimeType: f.mimeType ?? null,
              size: f.size ?? null,
              ext: f.ext ?? null,
            })),
          }),
        ]
      : []),
  ]);

const findOrCreateTagsByNames = async (names: string[]) => {
  const unique = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)));
  if (!unique.length) return [] as number[];

  const existing = await prisma.tag.findMany({ where: { name: { in: unique } }, select: { id: true, name: true } });
  const existingNames = new Set(existing.map((t) => t.name));
  const toCreate = unique.filter((n) => !existingNames.has(n));

  if (toCreate.length) {
    await prisma.tag.createMany({ data: toCreate.map((name) => ({ name })), skipDuplicates: true });
  }

  const all = await prisma.tag.findMany({ where: { name: { in: unique } }, select: { id: true } });
  return all.map((t) => t.id);
};

/* -------------------------------------------------------------------------- */
/*                                DELETE                                      */
/* -------------------------------------------------------------------------- */

/**
 * DELETE /tasks/:taskId
 */
const remove = (id: number) =>
  prisma.task.delete({
    where: { id },
  });

export default {
  findById,
  findMany,
  update,
  updateTags,
  updateAttachments,
  findOrCreateTagsByNames,
  remove,
};
