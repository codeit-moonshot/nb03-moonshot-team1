import prisma from '#prisma/prisma';
import { CommentCreateDto, CommentUpdateDto } from '#modules/comments/dto/comment.dto';
import { CommentQueryDto } from '#modules/comments/dto/commentQuery.dto';

const select = {
  id: true,
  content: true,
  taskId: true,
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      profileImage: true,
    },
  },
  createdAt: true,
  updatedAt: true,
};

const create = (data: CommentCreateDto) => {
  return prisma.comment.create({
    data,
    select,
  });
};

const findMany = async (data: CommentQueryDto) => {
  const { taskId, page, limit = 10 } = data;
  const where = { taskId };
  const [list, total] = await prisma.$transaction([
    prisma.comment.findMany({
      where,
      ...(page && { skip: (page - 1) * limit }),
      take: limit,
      select,
    }),
    prisma.comment.count({ where }),
  ]);

  return {
    data: list,
    total,
  };
};

const findById = (id: number) => {
  return prisma.comment.findUnique({
    where: { id },
  });
};

const update = (data: CommentUpdateDto) => {
  const { commentId, content } = data;
  return prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
    },
    select,
  });
};

const remove = (id: number) => {
  return prisma.comment.delete({
    where: { id },
  });
};

const checkProjectOwnerByComment = (commentId: number) => {
  return prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      task: {
        select: {
          project: {
            select: {
              ownerId: true,
            },
          },
        },
      },
    },
  });
};

export default {
  create,
  findMany,
  findById,
  update,
  remove,
  checkProjectOwnerByComment,
};
