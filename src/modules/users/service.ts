import userRepo from '#modules/users/repo';
import { RegisterDto } from '#modules/auth/dto/register.dto';

const findUserByEmail = async (email: string) => {
  return userRepo.findByEmail(email);
};

const createUser = async (data: RegisterDto) => {
  return userRepo.create(data);
};

const findUserById = async (id: number) => {
  return userRepo.findById(id);
};

export default {
  findUserByEmail,
  createUser,
  findUserById,
};
