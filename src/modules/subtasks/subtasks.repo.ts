import prisma from '#prisma/prisma';
import { CreateSubtaskDto, DeleteSubtaskDto, UpdateSubtaskDto } from '#modules/subtasks/dto/subtasks.dto';

const create = (data: CreateSubtaskDto) => {
  return prisma.subtask.create({
    data: {
      title: data.title,
      task: { connect: { id: data.taskId } },
    },
  });
};

const findMany = async (taskId: number) => {
  const where = { taskId };
  const [data, total] = await prisma.$transaction([
    prisma.subtask.findMany({ where }),
    prisma.subtask.count({ where }),
  ]);

  return {
    data,
    total,
  };
};

const findById = (id: number) => {
  return prisma.subtask.findUnique({
    where: { id },
  });
};

const update = (subtaskId: number, status: 'done' | 'todo') => {
  return prisma.subtask.update({
    where: { id: subtaskId },
    data: { status },
  });
};

const remove = (subtaskId: number) => {
  return prisma.subtask.delete({
    where: { id: subtaskId },
  });
};

export default {
  create,
  findMany,
  findById,
  update,
  remove,
};
