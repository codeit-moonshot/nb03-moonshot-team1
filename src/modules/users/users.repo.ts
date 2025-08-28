import prisma from '#prisma/prisma';
import { RegisterDto, SocialRegisterDto } from '#modules/auth/dto/register.dto';
import { UpdateUserDto } from '#modules/users/dto/user.dto';

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

const update = async (id: number, data: UpdateUserDto) => {
  return prisma.user.update({
    where: { id },
    data: {
      email: data.email,
      name: data.name,
      password: data.newPassword,
      profileImage: data.profileImage,
    },
  });
};

const socialCreate = async (data: SocialRegisterDto) => {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      profileImage: data.profileImage,
      socialAccounts: {
        create: {
          provider: data.socialAccounts.provider,
          providerUid: data.socialAccounts.providerUid,
          email: data.email,
          displayName: data.name,
          profileImage: data.profileImage,
          accessToken: data.socialAccounts.accessToken,
          refreshToken: data.socialAccounts.refreshToken,
        },
      },
    },
  });
};

export default {
  findByEmail,
  create,
  findById,
  update,
  socialCreate,
};
