import prisma from '#prisma/prisma';
import { RegisterDto, SocialRegisterDto } from '#modules/auth/dto/register.dto';
import { UpdateUserDto } from '#modules/users/dto/user.dto';

const findByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const create = async (data: RegisterDto) => {
  return prisma.user.create({ data });
};

const findById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

const update = async (id: number, data: UpdateUserDto) => {
  const { email, name, newPassword, profileImage } = data;
  return prisma.user.update({
    where: { id },
    data: {
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
      ...(newPassword !== undefined ? { password: newPassword } : {}),
      ...(profileImage !== undefined ? { profileImage } : {}),
    },
  });
};

const socialCreate = async (data: SocialRegisterDto) => {
  const { email, name, profileImage } = data;
  const { provider, providerUid, accessToken, refreshToken, expiryDate } = data.socialAccounts;
  return prisma.user.create({
    data: {
      email,
      name,
      profileImage,
      socialAccounts: {
        create: {
          provider,
          providerUid,
          email,
          displayName: name,
          profileImage,
          accessToken,
          refreshToken,
          expiryDate,
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
