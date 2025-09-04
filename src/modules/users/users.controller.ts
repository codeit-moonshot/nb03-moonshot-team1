import type { RequestHandler } from 'express';
import usersService from '#modules/users/users.service';
import commitTempFile from '#utils/commitTempFile';
import { UpdateUserDto } from '#modules/users/dto/user.dto';

/**
 * @function getMyInfo
 * @description 내 정보 조회
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {201} 조회된 내 정보 반환
 * @throws {401} 사용자 인증 실패
 * @throws {404} 사용자를 찾을 수 없는 경우
 */

const getMyInfo: RequestHandler = async (req, res) => {
  const id = Number(req.user.id);
  const user = await usersService.getMyInfo(id);
  res.status(200).json(user);
};

/**
 * @function updateMyInfo
 * @description 내 정보 수정
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {201} 수정된 내 정보 반환
 * @throws {400} 비밀번호 불일치
 * @throws {401} 사용자 인증 실패
 * @throws {404} 사용자를 찾을 수 없음
 */

const updateMyInfo: RequestHandler = async (req, res) => {
  const id = Number(req.user.id);

  // validator에서 추출한 값만 가져옴
  const dto: UpdateUserDto = { ...req.body };

  if ('profileImage' in dto) {
    if (dto.profileImage === null) {
    } else if (typeof dto.profileImage === 'string') {
      try {
        dto.profileImage = await commitTempFile(dto.profileImage, 'users/profiles');
      } catch (err) {
        console.error('프로필 이미지 커밋 실패:', err);
        delete (dto as any).profileImage;
      }
    }
  }

  const user = await usersService.updateMyInfo(id, dto);
  res.status(200).json(user);
};

export default {
  getMyInfo,
  updateMyInfo,
};
