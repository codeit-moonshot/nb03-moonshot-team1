import type { RequestHandler } from 'express';
import usersService from '#modules/users/service';
import { UpdateUserDto } from './dto/user.dto';

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

const getMyInfo: RequestHandler = async (req, res, next) => {
  const user = await usersService.getMyInfo(req.user.id);
  res.status(200).json(user);
};

const updateMyInfo: RequestHandler = async (req, res, next) => {
  const updateUserDto: UpdateUserDto = {
    email: req.body.email,
    name: req.body.name,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
    profileImage: req.body.profileImage,
  };
  const user = await usersService.updateMyInfo(req.user.id, updateUserDto);
  res.status(200).json(user);
};

export default {
  getMyInfo,
  updateMyInfo,
};
