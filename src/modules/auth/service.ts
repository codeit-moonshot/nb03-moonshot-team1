import ApiError from "@/errors/ApiError";
import authRepo from "@/modules/auth/repo";
import { RegisterDto } from "./dto/register.dto";

const register = async (data: RegisterDto) => {
  const existingUser = await authRepo.findByEmail(data.email);
  if (existingUser) {
    throw ApiError.conflict("이미 사용 중인 이메일입니다.");
  }
  const user = await authRepo.createAuth(data);
  return user;
};

export default {
  register
};
