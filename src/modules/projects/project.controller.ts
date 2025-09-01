import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import projectService from './project.service';
import { createProjectDto, InvitationDto, ExcludeMemberDto } from './dto/project.dto';
import { getBearer, generateInvitationToken } from './tokenUtils';
import ApiError from '#errors/ApiError';
import env from '#config/env';

/**
 * @function createProject
 * @description 프로젝트 생성
 *
 * @params {Object} req - { body: createProjectDto }
 *                        { headers: { authorization: "Bearer <token>" } }
 * @params {Object} res - {
 *  id: number,
 *  name: string,
 *  description: string,
 *  memberCount: number,
 *  todoCount: number,
 *  inProgressCount: number,
 *  doneCount: number
 * }
 * 
 * @returns {200} 생성된 프로젝트 정보
 * @throws {400} Bad Request
 * @throws {401} Unauthorized
 */
const createProject: RequestHandler = async (req, res) => {
  // TODO 토큰 추출, 검증 미들웨어로 분리
  const accessToken = getBearer(req.headers.authorization)
  if(!accessToken) throw ApiError.unauthorized('잘못된 토큰입니다.');
  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as { id: number };

  const createDto: createProjectDto = {
    name: req.body.name,
    description: req.body.description
  };

  const project = await projectService.createProject(createDto, decodedToken.id);
  res.status(200).json(project);
}

/**
 * @function createInvitation
 * @description 프로젝트 초대 생성
 *
 * @params {Object} req - Express 요청 객체
 * @params {Object} res - Express 응답 객체
 * 
 * @returns {201} 반환 없음
 */

const createInvitation: RequestHandler = async (req, res) => {
  const projectId = req.params.projectId;
  const email = req.body.email;
  const invitationToken = generateInvitationToken(Number(projectId), email);
  const invitationDto: InvitationDto = {
    projectId: Number(projectId),
    targetEmail: email,
    invitationToken,
    inviter: req.user.id
  }

  const invitation = await projectService.sendInvitation(invitationDto);
  console.log(`초대 : ${invitationDto.targetEmail}`);
  res.status(201).json(invitation);
}

const excludeMember: RequestHandler = async (req, res) => {
  const projectId = Number(req.params.projectId);
  const targetUserId = Number(req.params.userId);

  const excludeMemberDto: ExcludeMemberDto = {
    projectId,
    targetUserId
  }

  await projectService.excludeMember(excludeMemberDto);
  res.sendStatus(204);
}

export default {
  createProject,
  createInvitation,
  excludeMember
}
