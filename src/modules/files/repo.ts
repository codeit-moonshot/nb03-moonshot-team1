import prisma from '#prisma/prisma';

export interface CreateAttachmentInput {
  taskId: number;
  originalName: string;
  storedName: string;
  relPath: string;
  mimeType: string | null;
  size: number | null;
  ext: string | null;
}

export const AttachmentRepo = {
  create: (data: CreateAttachmentInput) => prisma.attachments.create({ data }),
};
