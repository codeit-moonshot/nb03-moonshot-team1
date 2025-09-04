import usersRepo from '#modules/users/users.repo';
import ApiError from '#errors/ApiError';
import { hashPassword, isPasswordValid } from '#utils/passwordUtils';
import { RegisterDto, SocialRegisterDto } from '#modules/auth/dto/register.dto';
import { UserDto, UpdateUserDto, PublicUserDto } from '#modules/users/dto/user.dto';
import commitTempFile from '#utils/commitTempFile';
import fileRelPathFromUrl from '#utils/fileRelPathFromUrl';
import removeManyByRelPath from '#utils/fileRemover';

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

const socialCreateUser = async (data: SocialRegisterDto): Promise<UserDto> => {
  return usersRepo.socialCreate(data);
};

const getMyInfo = async (id: number): Promise<PublicUserDto | null> => {
  const user = await usersRepo.findById(id);
  if (!user) throw ApiError.notFound('유저를 찾을 수 없습니다');
  return filterSensitiveUserData(user);
};

const updateMyInfo = async (id: number, data: UpdateUserDto): Promise<PublicUserDto> => {
  const user = await usersRepo.findById(id);
  if (!user) throw ApiError.notFound('유저를 찾을 수 없습니다');

  const wantPwChange = !!data.currentPassword && !!data.newPassword;

  if (wantPwChange) {
    // 소셜 계정
    if (!user.password) throw ApiError.badRequest('비밀번호를 설정할 수 없는 계정입니다.');
    const isPassValid = await isPasswordValid(data.currentPassword!, user.password);
    if (!isPassValid) throw ApiError.badRequest('현재 비밀번호가 일치하지 않습니다.');
    if (data.newPassword === data.currentPassword)
      throw ApiError.badRequest('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
  }

  let newProfileImageUrl: string | null | undefined = undefined;

  if ('profileImage' in data) {
    if (data.profileImage === null) {
      // DB 업데이트 후 실제 삭제 처리
      newProfileImageUrl = null;
    } else if (typeof data.profileImage === 'string') {
      try {
        newProfileImageUrl = await commitTempFile(data.profileImage, 'users/profiles'); // 최종 경로로 이동
      } catch (err) {
        console.error('프로필 이미지 커밋 실패:', err);
        newProfileImageUrl = undefined;
      }
    }
  }

  // 부분 업데이트
  const toUpdate: UpdateUserDto = {
    email: data.email,
    name: data.name,
    profileImage: newProfileImageUrl,
    newPassword: wantPwChange ? await hashPassword(data.newPassword!) : undefined,
  };

  const updatedUser = await usersRepo.update(id, toUpdate);

  try {
    const oldUrl = user.profileImage ?? null;
    const changed =
      'profileImage' in toUpdate &&
      ((toUpdate.profileImage === null && oldUrl) ||
        (typeof toUpdate.profileImage === 'string' && toUpdate.profileImage !== oldUrl));

    if (changed && oldUrl) {
      const oldRel = fileRelPathFromUrl(oldUrl);
      await removeManyByRelPath([oldRel], { guardUnreferenced: true });
    }
  } catch (err: any) {
    console.warn('[users] profile image cleanup failed:', err?.message);
  }

  return filterSensitiveUserData(updatedUser);
};

export default {
  findUserByEmail,
  createUser,
  findUserById,
  getMyInfo,
  updateMyInfo,
  socialCreateUser,
};
