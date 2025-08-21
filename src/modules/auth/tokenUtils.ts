import jwt from 'jsonwebtoken';
import type { DecodedToken } from '#modules/auth/dto/token.dto';
import ApiError from '#errors/ApiError';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) throw new Error('❌ Invalid ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET');

const generateAccessToken = (user: { id: number }): string => {
  try {
    return jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: '1h' });
  } catch (err) {
    throw new ApiError(500, 'Access token generation failed');
  }
};

const verifyAccessToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as DecodedToken;
  } catch {
    throw new ApiError(403, 'Access token invalid');
  }
};

const generateRefreshToken = (user: { id: number }): string => {
  try {
    return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '14d' });
  } catch (err) {
    throw new ApiError(500, 'Refresh token generation failed');
  }
};

const verifyRefreshToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as DecodedToken;
  } catch {
    throw new ApiError(403, 'Refresh token invalid');
  }
};

export default {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken
}
