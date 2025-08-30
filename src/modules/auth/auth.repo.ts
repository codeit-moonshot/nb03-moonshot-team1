import prisma from '#prisma/prisma';
import { RefreshDto, UpdateTokenDto } from '#modules/auth/dto/token.dto';

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

const updateGoogleToken = async (data: UpdateTokenDto) => {
  return prisma.socialAccount.updateMany({
    where: {
      userId: data.userId,
      provider: 'GOOGLE',
    },
    data: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiryDate: data.expiryDate,
    },
  });
};

export default {
  findRefreshTokenByUserId,
  upsertRefreshToken,
  updateGoogleToken,
};
