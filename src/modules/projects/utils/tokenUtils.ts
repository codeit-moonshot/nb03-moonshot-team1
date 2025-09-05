import jwt from 'jsonwebtoken';
import ApiError from '#errors/ApiError';

const INVITATION_SECRET = process.env.INVITATION_TOKEN_SECRET;
if (!INVITATION_SECRET) throw new Error('❌ Invalid INVITATION_TOKEN_SECRET');

export const generateInvitationToken = (projectId: number, targetId: number, email: string): string => {
  try {
    // 초대 코드 유효기간은 일주일
    return jwt.sign({ projectId, targetId, email }, INVITATION_SECRET, { expiresIn: '7d' });
  } catch (err) {
    throw ApiError.internal('토큰 생성에 실패했습니다.');
  }
};

export const getBearer = (h?: string) => (h?.startsWith('Bearer ') ? h.slice(7) : undefined);
