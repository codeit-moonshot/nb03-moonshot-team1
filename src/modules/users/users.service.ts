import usersRepo from '#modules/users/users.repo';
import ApiError from '#errors/ApiError';
import { hashPassword, isPasswordValid } from '#utils/passwordUtils';
import { RegisterDto, SocialRegisterDto } from '#modules/auth/dto/register.dto';
import { UserDto, UpdateUserDto, PublicUserDto } from '#modules/users/dto/user.dto';

const filterSensitiveUserData = (user: UserDto): PublicUserDto => {
  const { password, deletedAt, ...filteredUser } = user;
  return filteredUser;
};

const findUserByEmail = async (email: string): Promise<UserDto | null> => {
  return usersRepo.findByEmail(email);
};

const createUser = async (data: RegisterDto): Promise<UserDto> => {
  return usersRepo.create(data);
};

const findUserById = async (id: number): Promise<UserDto | null> => {
  return usersRepo.findById(id);
};

const SocialCreateUser = async (data: SocialRegisterDto): Promise<UserDto> => {
  return usersRepo.SocialCreate(data);
};

const getMyInfo = async (id: number): Promise<PublicUserDto | null> => {
  const user = await usersRepo.findById(id);
  if (!user) throw ApiError.notFound('유저를 찾을 수 없습니다');
  return filterSensitiveUserData(user);
};

const updateMyInfo = async (id: number, data: UpdateUserDto): Promise<PublicUserDto> => {
  const user = await usersRepo.findById(id);
  if (!user) throw ApiError.notFound('유저를 찾을 수 없습니다');
  if (!(await isPasswordValid(data.currentPassword, user.password as string))) {
    throw ApiError.badRequest('현재 비밀번호가 일치하지 않습니다.');
  }
  if (data.newPassword === data.currentPassword) {
    throw ApiError.badRequest('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
  }
  data.newPassword = await hashPassword(data.newPassword);
  const updatedUser = await usersRepo.update(id, data);
  return filterSensitiveUserData(updatedUser);
};

export default {
  findUserByEmail,
  createUser,
  findUserById,
  getMyInfo,
  updateMyInfo,
  SocialCreateUser,
};
