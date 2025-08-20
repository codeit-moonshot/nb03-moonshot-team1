import prisma from '@/prisma/prisma';
import { RegisterDto } from './dto/register.dto';

const findByEmail = async (email: string) => {
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
  findByEmail,
  createAuth
};
