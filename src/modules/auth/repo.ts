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

const findRefreshToken = async (tokenHash: string) => {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
  });
};

const deleteRefreshToken = async (tokenHash: string) => {
  return prisma.refreshToken.delete({
    where: { tokenHash },
  });
};

export default {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
