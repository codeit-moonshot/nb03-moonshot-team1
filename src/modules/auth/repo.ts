import prisma from '#prisma/prisma';
import { RefreshDto } from '#modules/auth/dto/token.dto';

const createRefreshToken = async (data: RefreshDto) => {
  return prisma.refreshToken.create({
    data: {
      tokenHash: data.tokenHash,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      user: {
        connect: { id: data.userId },
      },
    },
  });
};

const findRefreshToken = async (userId: number) => {
  return prisma.refreshToken.findUnique({
    where: { userId },
  });
};

const deleteRefreshToken = async (userId: number) => {
  return prisma.refreshToken.delete({
    where: { userId },
  });
};

export default {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
