import authRepo from '#modules/auth/repo';
import usersService from '#modules/users/service';
import { hashPassword, isPasswordValid } from '#utils/passwordUtils';
import token from '#modules/auth/tokenUtils';
import ApiError from '#errors/ApiError';
import { RegisterDto } from '#modules/auth/dto/register.dto';
import { LoginDto } from '#modules/auth/dto/login.dto';
import type { AuthHeaderDto, RefreshDto } from '#modules/auth/dto/token.dto';
import { de } from 'zod/v4/locales/index.cjs';

const register = async (data: RegisterDto) => {
  const existingUser = await usersService.findUserByEmail(data.email);
  if (existingUser) throw ApiError.conflict('이미 사용 중인 이메일입니다.');

  const hashedPassword = await hashPassword(data.password);
  const createdUser = await usersService.createUser({ ...data, password: hashedPassword });
  const { password, deletedAt, ...user } = createdUser;
  return user;
};

const login = async (data: LoginDto) => {
  const message = '이메일 또는 비밀번호가 잘못되었습니다.';
  const getUser = await usersService.findUserByEmail(data.email);
  if (!getUser) throw ApiError.unauthorized(message);

  const password = getUser.password as string; //로컬 로그인 경우 무조건 비밀번호가 존재하기 때문에 타입 단정
  const isValidPassword = await isPasswordValid(data.password, password);
  if (!isValidPassword) throw ApiError.unauthorized(message);

  const userId = Number(getUser.id);
  const accessToken = token.generateAccessToken({ id: userId });
  const refreshToken = token.generateRefreshToken({ id: userId });

  const decodedToken = token.verifyRefreshToken(refreshToken);
  const refreshDto: RefreshDto = {
    userId: decodedToken.id,
    refreshToken: refreshToken,
    createdAt: new Date(),
    expiresAt: new Date(decodedToken.exp! * 1000),
  };
  await authRepo.createRefreshToken(refreshDto);

  return { accessToken, refreshToken };
};

const refresh = async (data: AuthHeaderDto) => {
  const message = '유효하지 않은 토큰입니다.';
  const refreshToken = token.extractToken(data);
  const storedToken = await authRepo.findRefreshToken(refreshToken);
  if (!storedToken) throw ApiError.unauthorized(message);

  const decodedToken = token.verifyRefreshToken(refreshToken);
  await authRepo.deleteRefreshToken(refreshToken);

  const tokenId = Number(decodedToken.id);
  const newAccessToken = token.generateAccessToken({ id: tokenId });
  const newRefreshToken = token.generateRefreshToken({ id: tokenId });

  const newDecodedToken = token.verifyRefreshToken(newRefreshToken);
  const refreshDto: RefreshDto = {
    userId: newDecodedToken.id,
    refreshToken: newRefreshToken,
    createdAt: new Date(),
    expiresAt: new Date(newDecodedToken.exp! * 1000),
  };
  await authRepo.createRefreshToken(refreshDto);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export default {
  register,
  login,
  refresh,
};
