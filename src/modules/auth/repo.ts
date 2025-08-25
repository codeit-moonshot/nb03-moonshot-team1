import prisma from '#prisma/prisma';
import { RefreshDto } from '#modules/auth/dto/token.dto';

const createRefreshToken = async (data: RefreshDto) => {
  return prisma.refreshToken.create({
    data: {
      refreshToken: data.refreshToken,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      user: {
        connect: { id: data.userId },
      },
    },
  });
};

const findRefreshToken = async (refreshToken: string) => {
  return prisma.refreshToken.findUnique({
    where: { refreshToken },
  });
};

const deleteRefreshToken = async (refreshToken: string) => {
  return prisma.refreshToken.delete({
    where: { refreshToken },
  });
};

export default {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
