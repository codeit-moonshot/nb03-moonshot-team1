import usersRepo from '#modules/users/repo';
import { RegisterDto } from '#modules/auth/dto/register.dto';

const findUserByEmail = async (email: string) => {
  return usersRepo.findByEmail(email);
};

const createUser = async (data: RegisterDto) => {
  return usersRepo.create(data);
};

const findUserById = async (id: number) => {
  return usersRepo.findById(id);
};

export default {
  findUserByEmail,
  createUser,
  findUserById,
};
