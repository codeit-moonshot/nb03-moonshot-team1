import authRepo from '#modules/auth/auth.repo';
import usersService from '#modules/users/users.service';
import { hashPassword, isPasswordValid } from '#utils/passwordUtils';
import googleOauthUtils from '#modules/auth/utils/googleOauthUtils';
import token from '#modules/auth/utils/tokenUtils';
import ApiError from '#errors/ApiError';
import { RegisterDto, SocialProvider } from '#modules/auth/dto/register.dto';
import { LoginDto } from '#modules/auth/dto/login.dto';
import type { AuthHeaderDto, RefreshDto } from '#modules/auth/dto/token.dto';
import { PublicUserDto } from '#modules/users/dto/user.dto';
import { TokenDto } from '#modules/auth/dto/token.dto';

const register = async (data: RegisterDto): Promise<PublicUserDto> => {
  const existingUser = await usersService.findUserByEmail(data.email);
  if (existingUser) throw ApiError.conflict('이미 사용 중인 이메일입니다.');

  const hashedPassword = await hashPassword(data.password);
  const createdUser = await usersService.createUser({ ...data, password: hashedPassword });
  const { password, deletedAt, ...user } = createdUser;
  return user;
};

const saveRefreshToken = async (refreshToken: string, userId: number) => {
  const decodedToken = token.verifyRefreshToken(refreshToken);
  const tokenHash = await hashPassword(refreshToken);

  const refreshDto: RefreshDto = {
    userId: decodedToken.id,
    tokenHash,
    createdAt: new Date(),
    expiresAt: new Date(decodedToken.exp! * 1000),
  };

  await authRepo.deleteRefreshToken(userId);
  await authRepo.createRefreshToken(refreshDto);
};

const login = async (data: LoginDto): Promise<TokenDto> => {
  const message = '이메일 또는 비밀번호가 잘못되었습니다.';
  const getUser = await usersService.findUserByEmail(data.email);
  if (!getUser) throw ApiError.unauthorized(message);

  const password = getUser.password as string; //로컬 로그인 경우 무조건 비밀번호가 존재하기 때문에 타입 단정
  const isValidPassword = await isPasswordValid(data.password, password);
  if (!isValidPassword) throw ApiError.unauthorized(message);

  const userId = Number(getUser.id);
  const accessToken = token.generateAccessToken({ id: userId });
  const refreshToken = token.generateRefreshToken({ id: userId });

  await saveRefreshToken(refreshToken, userId);

  return { accessToken, refreshToken };
};

const refresh = async (data: AuthHeaderDto): Promise<TokenDto> => {
  const message = '유효하지 않은 토큰입니다.';
  const refreshToken = token.extractToken(data);

  const decodedToken = token.verifyRefreshToken(refreshToken);
  const storedTokenHash = await authRepo.findRefreshTokenByUserId(decodedToken.id);
  if (!storedTokenHash) throw ApiError.unauthorized(message);

  const isValidHash = await isPasswordValid(refreshToken, storedTokenHash.tokenHash);
  if (!isValidHash) throw ApiError.unauthorized(message);
  await authRepo.deleteRefreshToken(decodedToken.id);

  const tokenId = Number(decodedToken.id);
  const newAccessToken = token.generateAccessToken({ id: tokenId });
  const newRefreshToken = token.generateRefreshToken({ id: tokenId });

  await saveRefreshToken(newRefreshToken, tokenId);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const googleRegisterOrLogin = async (code: string): Promise<TokenDto> => {
  const { access_token } = await googleOauthUtils.getGoogleToken(code);
  const userInfo = await googleOauthUtils.getGoogleUserInfo(access_token);

  let user = await usersService.findUserByEmail(userInfo.email);
  if (!user) {
    user = await usersService.SocialCreateUser({
      email: userInfo.email,
      name: userInfo.name ?? '이름 없음',
      profileImage: userInfo.picture ?? null,
      socialAccounts: {
        provider: SocialProvider.GOOGLE,
        providerUid: userInfo.id,
      },
    });
  }

  const accessToken = token.generateAccessToken({ id: user.id });
  const refreshToken = token.generateRefreshToken({ id: user.id });

  await saveRefreshToken(refreshToken, user.id);

  return { accessToken, refreshToken };
};

export default {
  register,
  login,
  refresh,
  googleRegisterOrLogin,
};
