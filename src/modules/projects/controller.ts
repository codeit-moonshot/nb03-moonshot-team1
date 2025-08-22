import type { RequestHandler } from 'express';
import projectService from './service';
import { InvitationDto, ExcludeMemberDto } from './dto/project.dto';

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

  await projectService.sendInvitation(invitationDto);
  console.log(`초대 : ${invitationDto.targetEmail}`);
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
  createInvitation,
  excludeMember
}
