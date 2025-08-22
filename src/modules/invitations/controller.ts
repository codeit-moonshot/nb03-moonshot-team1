import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import type { AcceptInvitationDto, CreateMemberDto } from './dto/invitationDto';
import invitationService from './service';

/**
 * @function acceptInvitation
 * @description 프로젝트 초대 수락
 *
 * @params {Object} req - Express 요청 객체
 * @params {Object} res - Express 응답 객체
 * 
 * @returns {200} 반환 없음
 */

export const acceptInvitation: RequestHandler = async (req, res) => {
  // 필요한 데이터를 dto에 넣는다
  const invitationId = Number(req.params.invitationId);
  const invitationToken = req.query.token as string;
  const decodedToken = jwt.verify(invitationToken, process.env.INVITATION_TOKEN_SECRET!) as { projectId: number, email: string };

  const acceptInvitationDto: AcceptInvitationDto = {
    projectId: decodedToken.projectId,
    email: decodedToken.email,
    role: 'MEMBER',
    invitationId,
    invitationToken
  }

  await invitationService.acceptInvitation(acceptInvitationDto);
}

export default {
  acceptInvitation
}