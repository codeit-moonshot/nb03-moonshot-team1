import type { RequestHandler } from 'express';
import projectService from './project.service';
import { createProjectDto, InvitationDto, ExcludeMemberDto, updateProjectDto } from './dto/project.dto';
import { generateInvitationToken } from './utils/tokenUtils';
import { MeProjectQueryDto } from './dto/me-project.dto';

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
 * @function updateProject
 * @description 프로젝트 수정
 *
 * @params {Object} req - { body: updateProjectDto }
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
 * @throws {403} Forbidden
 */
const updateProject: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const projectId = Number(req.params.projectId);

  await projectService.checkRole(userId, projectId);

  const updateDto: updateProjectDto = {
    ...req.body
  };
  const project = await projectService.updateProject(updateDto, projectId);
  res.status(200).json(project);
}

/**
 * @function deleteProject
 * @description 프로젝트 삭제
 *
 * @params {Object} req - { headers: { authorization: "Bearer <token>" } }
 *
 * @returns {204}
 * @throws {400} Bad Request
 * @throws {401} Unauthorized
 * @throws {403} Forbidden
 * @throws {404} Not Found
 */
const deleteProject: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const projectId = Number(req.params.projectId);

  await projectService.checkRole(userId, projectId);

  await projectService.deleteProject(projectId);
  res.sendStatus(204);
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

/**
 * @function getMyProjects
 * @description 내 프로젝트 조회
 *
 * @params {Object} req - { headers: { authorization: "Bearer <token>" }, 
 *                            params: { meProjectQueryDto } } 
 *
 * @returns {200} 내 프로젝트 목록
 * @throws {400} Bad Request
 * @throws {401} Unauthorized
 */
const getMyProjects: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const query: MeProjectQueryDto = res.locals.meProjectQuery;

  const projects = await projectService.getMyProjects(userId, query);
  res.status(200).json(projects);
}

export default {
  createProject,
  updateProject,
  deleteProject,
  createInvitation,
  excludeMember,
  getMyProjects
}
