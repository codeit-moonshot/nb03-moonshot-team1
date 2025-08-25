import prisma from '#prisma/prisma';
import { CreateSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';

export const create = (data: CreateSubtaskDto) => {
  return prisma.subtask.create({
    data: {
      title: data.title,
      task: { connect: { id: data.taskId } },
    },
  });
};

export const findById = (id: number) => {
  return prisma.subtask.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      taskId: true,
      createdAt: true,
    },
  });
};

export const update = (data: UpdateSubtaskDto) => {
  return prisma.subtask.update({
    where: {
      taskId: data.taskId,
      id: data.subtaskId,
    },
    data: {
      status: data.status,
    },
  });
};
