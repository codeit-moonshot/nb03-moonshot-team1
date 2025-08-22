import jwt from 'jsonwebtoken';
import type { DecodedToken } from '#modules/auth/dto/token.dto';
import ApiError from '#errors/ApiError';

const INVITATION_SECRET = process.env.INVITATION_TOKEN_SECRET;
if (!INVITATION_SECRET) throw new Error('❌ Invalid INVITATION_TOKEN_SECRET');

const generateInvitationToken = (projectId: number, email: string): string => {
  try {
    // 초대 코드 유효기간은 일주일
    return jwt.sign({ projectId, email }, INVITATION_SECRET, { expiresIn: '7d' });
  } catch (err) {
    throw ApiError.internal('토큰 생성에 실패했습니다.');
  }
};