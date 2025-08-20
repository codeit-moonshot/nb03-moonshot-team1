import ApiError from "@/errors/ApiError";
import authRepo from "@/modules/auth/repo";
import { RegisterDto } from "./dto/register.dto";

const register = async (registerDto: RegisterDto) => {
  const existingUser = await authRepo.findByEmail(registerDto.email);
  if (existingUser) {
    throw ApiError.conflict("이미 사용 중인 이메일입니다.");
  }
  const user = await authRepo.createAuth(registerDto);
  return user;
};

export default {
  register
};
