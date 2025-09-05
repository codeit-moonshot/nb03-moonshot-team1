import type { RequestHandler } from 'express';
import usersService from '#modules/users/users.service';
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
  const dto: UpdateUserDto = { ...req.body };
  const user = await usersService.updateMyInfo(id, dto);
  res.status(200).json(user);
};

export default {
  getMyInfo,
  updateMyInfo,
};
