import env, { FRONT_ORIGIN } from '#config/env';
import type { RequestHandler } from 'express';
import authService from '#modules/auth/auth.service';
import googleOauthService from '#libs/googleOauth.service';
import ApiError from '#errors/ApiError';
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
 *
 * @throws {400} 유효하지 않은 요청
 * @throws {409} 이메일 중복으로 인한 충돌
 */

const register: RequestHandler = async (req, res, next) => {
  const registerDto: RegisterDto = {
    email: req.body.email.toLowerCase(),
    name: req.body.name,
    password: req.body.password,
    profileImage: req.body.profileImage,
  };

  const user = await authService.register(registerDto);
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
 *
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
 *
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
 *
 * @throws {500} 구글 로그인 URL 생성 실패
 */

const googleLogin: RequestHandler = (req, res, next) => {
  const authUrl = googleOauthService.getGoogleAuthURL();
  res.redirect(authUrl);
};

/**
 * 구글 로그인 콜백 (프론트엔드에서 호출)
 *
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 *
 * @returns {302} 프론트엔드 메인 페이지로 리다이렉트 (토큰은 쿠키로 설정)
 *
 * @throws {400} 유효하지 않은 요청 및 상태 불일치, 구글과 통신 실패
 * @throws {409} 이메일 중복시 회원가입 실패
 * @throws {500} 구글 로그인 실패
 */

const googleCallback: RequestHandler = async (req, res, next) => {
  const { code, state } = req.query;
  if (!code || typeof code !== 'string') throw ApiError.badRequest('유효하지 않은 요청입니다.');

  const verifiedState = googleOauthService.verifyState(state as string);
  if (!verifiedState) throw ApiError.badRequest('유효하지 않은 state입니다.');

  const token = await authService.googleRegisterOrLogin(code);

  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production', // 개발: false(HTTP), 운영: true(HTTPS)
    sameSite: env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const), // 개발: lax, 운영: none(CORS)
    maxAge: 60 * 60 * 24 * 14 * 1000, // 14일
    path: '/',
  };

  res.cookie('access-token', token.accessToken, cookieOptions);
  res.cookie('refresh-token', token.refreshToken, cookieOptions);

  // 프론트엔드 메인 페이지로 리다이렉트
  const frontendUrl = FRONT_ORIGIN || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/projects`);
};

export default {
  register,
  login,
  refresh,
  googleLogin,
  googleCallback,
};
