import prisma from '#prisma/prisma';

export interface CreateAttachmentInput {
  taskId?: number | null;
  userId?: number | null;
  originalName: string;
  storedName: string;
  relPath: string;
  mimeType: string | null;
  size: number | null;
  ext: string | null;
}

export const AttachmentRepo = {
  create: (data: CreateAttachmentInput) => prisma.attachments.create({ data }),
  findByTask: (taskId: number) => prisma.attachments.findMany({ where: { taskId } }),
  findLatestByUser: (userId: number) =>
    prisma.attachments.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
};
