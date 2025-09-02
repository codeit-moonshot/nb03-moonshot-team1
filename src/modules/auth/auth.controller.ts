import type { RequestHandler } from 'express';
import authService from '#modules/auth/auth.service';
import googleOauthService from '#libs/googleOauth.service';
import ApiError from '#errors/ApiError';
import commitTempFile from '#utils/commitTempFile';
import { RegisterDto } from '#modules/auth/dto/register.dto';
import { LoginDto } from '#modules/auth/dto/login.dto';
import type { AuthHeaderDto } from '#modules/auth/dto/token.dto';

/**
 * @function register
 * @description 사용자 등록
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {201} 생성된 사용자 반환
 * @throws {409} 이메일 충돌
 */

const register: RequestHandler = async (req, res, next) => {
  const registerDto: RegisterDto = {
    email: req.body.email.toLowerCase(),
    name: req.body.name,
    password: req.body.password,
    profileImage: req.body.profileImage,
  };
  const user = await authService.register(registerDto);

  if (req.body.profileImage) {
    try {
      registerDto.profileImage = await commitTempFile(req.body.profileImage, 'users/profiles');
    } catch (err) {
      console.error('프로필 이미지 커밋 실패:', err);
      registerDto.profileImage = null; // 처리 실패해도 가입은 진행
    }
  }

  res.status(201).json(user);
};

/**
 * @function login
 * @description 로그인
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 생성된 토큰 반환
 * @throws {401} 이메일 또는 비밀번호가 잘못됨
 */

const login: RequestHandler = async (req, res, next) => {
  const loginDto: LoginDto = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };
  const token = await authService.login(loginDto);
  res.status(200).json(token);
};

/**
 * @function refresh
 * @description 토큰 갱신
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 생성된 토큰 반환
 * @throws {401} 이메일 또는 비밀번호가 잘못됨
 * @throws {401} 토큰이 존재하지 않거나 잘못된 토큰
 * @throws {404} 토큰에 등록된 사용자를 찾을 수 없음
 */

const refresh: RequestHandler = async (req, res, next) => {
  const AuthHeader: AuthHeaderDto = { authorization: req.headers.authorization as string };
  if (!AuthHeader.authorization) throw ApiError.unauthorized('토큰이 존재하지 않습니다.');
  const newToken = await authService.refresh(AuthHeader);
  res.status(200).json(newToken);
};

/**
 * @function googleLogin
 * @description 구글 로그인
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {302} 구글 로그인 페이지로 리다이렉트
 * @throws {500} 구글 로그인 URL 생성 실패
 */

const googleLogin: RequestHandler = (req, res, next) => {
  const authUrl = googleOauthService.getGoogleAuthURL();
  res.redirect(authUrl);
};

/**
 * 구글 로그인 콜백
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {200} 생성된 토큰 반환
 * @throws {400} 유효하지 않은 요청 및 상태 불일치, 구글과 통신 실패
 * @throws {500} 구글 로그인 실패
 */

const googleCallback: RequestHandler = async (req, res, next) => {
  const { code, state } = req.query;
  if (!code || typeof code !== 'string') throw ApiError.badRequest('유효하지 않은 요청입니다.');

  const verifiedState = googleOauthService.verifyState(state as string);
  if (!verifiedState) throw ApiError.badRequest('유효하지 않은 state입니다.');

  const token = await authService.googleRegisterOrLogin(code);
  res.status(200).json(token);
};

export default {
  register,
  login,
  refresh,
  googleLogin,
  googleCallback,
};
