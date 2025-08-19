import prisma from '@/prisma/prisma';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

export const findMany = (offset = 0, limit = 10, search = '', sort: 'asc' | 'desc' = 'desc') =>
  prisma.product.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: { createdAt: sort },
    skip: offset,
    take: limit,
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });

export const findById = (id: number) =>
  prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      imageUrl: true,
      createdAt: true,
      userId: true,
    },
  });

export const create = (data: CreateProductDto) => {
  const { userId, ...rest } = data;
  return prisma.product.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
    },
  });
};

export const update = (id: number, data: UpdateProductDto) =>
  prisma.product.update({
    where: { id },
    data,
  });

export const remove = (id: number) =>
  prisma.product.delete({
    where: { id },
  });
