import prisma from '#prisma/prisma';
import { RefreshDto } from '#modules/auth/dto/token.dto';
import { SocialProvider } from '#modules/auth/dto/register.dto';

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

export default {
  findRefreshTokenByUserId,
  upsertRefreshToken,
};
