import type { RequestHandler } from 'express';
import type { AcceptInvitationDto, CreateMemberDto } from '#modules/invitations/dto/invitations.Dto';
import invitationService from '#modules/invitations/invitations.service';

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
  const invitationToken = req.body.token as string;
  const { projectId, targetId } = await invitationService.checkInvitation(invitationId, invitationToken);

  const acceptInvitationDto: AcceptInvitationDto = {
    projectId,
    userId: targetId,
    role: 'MEMBER',
  };

  await invitationService.acceptInvitation(acceptInvitationDto, invitationId);
  res.sendStatus(200);
};

export const deleteInvitation: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const invitationId = Number(req.params.invitationId);
  await invitationService.removeInvitation(invitationId, userId);
  res.sendStatus(204);
};

export default {
  acceptInvitation,
  deleteInvitation,
};
