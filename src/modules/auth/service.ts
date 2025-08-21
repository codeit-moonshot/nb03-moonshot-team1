import ApiError from "#errors/ApiError";
import authRepo from "#modules/auth/repo";
import { RegisterDto } from "./dto/register.dto";
import { hashPassword, isPasswordValid } from "#utils/passwordUtils";



const register = async (data: RegisterDto) => {
  const existingUser = await authRepo.findUserByEmail(data.email);
  if (existingUser) {
    throw ApiError.conflict("이미 사용 중인 이메일입니다.");
  }
  const hashedPassword = await hashPassword(data.password);
  const createdUser = await authRepo.createAuth({ ...data, password: hashedPassword });
  const { password, deletedAt, ...user } = createdUser;
  return user;
};

export default {
  register
};
