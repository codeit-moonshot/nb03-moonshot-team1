import prisma from '#prisma/prisma';
import { RegisterDto } from '#modules/auth/dto/register.dto';

const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

const createAuth = async (registerDto: RegisterDto) => {
  return prisma.user.create({
    data: registerDto
  });
};

export default {
  findUserByEmail,
  createAuth
};
