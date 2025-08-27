import prisma from '#prisma/prisma';
import { RefreshDto } from '#modules/auth/dto/token.dto';
import { de } from 'zod/v4/locales/index.cjs';

const findRefreshTokenByUserId = async (userId: number) => {
  return prisma.refreshToken.findUnique({
    where: { userId },
  });
};

const upsertRefreshToken = async (userId: number, data: RefreshDto) => {
  return prisma.refreshToken.upsert({
    where: { userId },
    update: {
      tokenHash: data.tokenHash,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
    },
    create: {
      tokenHash: data.tokenHash,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      user: { connect: { id: userId } },
    },
  });
};

const deleteRefreshToken = async (userId: number) => {
  return prisma.refreshToken.delete({
    where: { userId },
  });
};

export default {
  findRefreshTokenByUserId,
  upsertRefreshToken,
  deleteRefreshToken,
};
