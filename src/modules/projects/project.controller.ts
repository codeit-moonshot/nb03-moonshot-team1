import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import projectService from './project.service';
import { createProjectDto, InvitationDto, ExcludeMemberDto } from './dto/project.dto';
import { getBearer } from './tokenUtils';
import ApiError from '#errors/ApiError';

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
  const userId = req.user.id;

  const createDto: createProjectDto = {
    name: req.body.name,
    description: req.body.description
  };

  const project = await projectService.createProject(createDto, userId);
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
  const invitationToken = 'some Token';
  const invitationDto: InvitationDto = {
    projectId: Number(req.params.projectId),
    targetEmail: req.body.email,
    invitationToken,
    // inviter: req.user.id
    inviter: 1
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
