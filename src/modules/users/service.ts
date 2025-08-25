import usersRepo from '#modules/users/repo';
import { RegisterDto } from '#modules/auth/dto/register.dto';
import { UserDto, UpdateUserDto } from '#modules/users/dto/user.dto';
import ApiError from '#errors/ApiError';

const filterSensitiveUserData = (user: UserDto) => {
  const { password, deletedAt, ...filteredUser } = user;
  return filteredUser;
};

const findUserByEmail = async (email: string) => {
  return usersRepo.findByEmail(email);
};

const createUser = async (data: RegisterDto) => {
  return usersRepo.create(data);
};

const findUserById = async (id: number) => {
  return usersRepo.findById(id);
};

const getMyInfo = async (id: number) => {
  const user = await usersRepo.findById(id);
  if (!user) throw ApiError.notFound('유저를 찾을 수 없습니다');
  return filterSensitiveUserData(user);
};

const updateMyInfo = async (id: number, data: UpdateUserDto) => {
  const user = await usersRepo.findById(id);
  if (!user) throw ApiError.notFound('유저를 찾을 수 없습니다');
  if (data.newPassword === data.currentPassword) {
    throw ApiError.badRequest('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
  }
  const updatedUser = await usersRepo.update(id, data);
  return filterSensitiveUserData(updatedUser);
};

export default {
  findUserByEmail,
  createUser,
  findUserById,
  getMyInfo,
  updateMyInfo,
};
