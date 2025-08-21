import authRepo from "#modules/auth/repo";
import { hashPassword, isPasswordValid } from "#utils/passwordUtils";
import token from "#modules/auth/tokenUtils";
import ApiError from "#errors/ApiError";
import { RegisterDto } from "#modules/auth/dto/register.dto";
import { LoginDto } from "#modules/auth/dto/login.dto";

const register = async (data: RegisterDto) => {
  const existingUser = await authRepo.findUserByEmail(data.email);
  if (existingUser) throw ApiError.conflict("이미 사용 중인 이메일입니다.");

  const hashedPassword = await hashPassword(data.password);
  const createdUser = await authRepo.createAuth({ ...data, password: hashedPassword });
  const { password, deletedAt, ...user } = createdUser;
  return user;
};

const login = async (data: LoginDto) => {
  const message = "이메일 또는 비밀번호가 잘못되었습니다.";
  const getUser = await authRepo.findUserByEmail(data.email);
  if (!getUser) throw ApiError.unauthorized(message);

  const password = getUser.password as string; //로컬 로그인 경우 무조건 비밀번호가 존재하기 때문에 타입 단정
  const isValidPassword = await isPasswordValid(data.password, password);
  if (!isValidPassword) throw ApiError.unauthorized(message);

  const accessToken = token.generateAccessToken(getUser);
  const refreshToken = token.generateRefreshToken(getUser);
  return { accessToken, refreshToken };
};

export default {
  register,
  login
};
