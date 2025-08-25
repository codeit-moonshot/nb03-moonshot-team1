import prisma from '#prisma/prisma';
import { RegisterDto } from '#modules/auth/dto/register.dto';

const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const create = async (data: RegisterDto) => {
  return prisma.user.create({
    data,
  });
};

const findById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export default {
  findByEmail,
  create,
  findById,
};
