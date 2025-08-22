import prisma from '#prisma/prisma';
import { CreateSubtaskDto, UpdateSubtaskDto } from './dto';

export const create = (data: CreateSubtaskDto) => {
  return prisma.subtask.create({
    data: {
      title: data.title,
      taskId: data.taskId
    },
  });
};

export const update = (data: UpdateSubtaskDto) => {
  return prisma.subtask.update({
    where: {
      taskId: data.taskId,
      id: data.id
    },
    data: {
      status: data.status
    }
  });
};
