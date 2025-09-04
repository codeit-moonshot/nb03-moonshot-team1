import ApiError from '#errors/ApiError';
import type { AcceptInvitationDto } from '#modules/invitations/dto/invitations.Dto';
import invitationRepo from '#modules/invitations/invitations.repo';
import projectRepo from '#modules/projects/projects.repo';

const acceptInvitation = async (acceptInvitationDto: AcceptInvitationDto, invitationId: number) => {
  const accept = await invitationRepo.acceptInvitation(acceptInvitationDto, invitationId);
  if (accept === 'unknown') throw ApiError.internal();
  if (accept === 'not found') throw ApiError.notFound();
};

const checkRole = async (userId: number, projectId: number) => {
  const member = await projectRepo.findMemberById({ projectId, userId });
  if (!member) throw ApiError.notFound('프로젝트 멤버가 아닙니다.');
  if (member.role !== 'OWNER') throw ApiError.forbidden('권한이 없습니다.');
};

const checkInvitation = async (invitationId: number, acceptedToken: string) => {
  const invitation = await invitationRepo.findById(invitationId);
  if (!invitation) throw ApiError.notFound('잘못된 초대입니다.');
  if (invitation.token !== acceptedToken) throw ApiError.notFound('잘못된 초대입니다.');
  if (invitation.expiresAt! < new Date()) throw ApiError.badRequest('만료된 초대입니다.');
  if (invitation.status === 'accepted') throw ApiError.badRequest('이미 수락된 초대입니다.');

  return invitation.projectId;
};

const removeInvitation = async (invitationId: number, userId: number) => {
  const invitation = await invitationRepo.findById(invitationId);
  if (!invitation) throw ApiError.notFound('초대 정보를 찾을 수 없습니다.');
  if (invitation.status === 'accepted') throw ApiError.badRequest('이미 수락된 초대입니다.');

  await checkRole(userId, invitation.projectId);
  await invitationRepo.remove(invitation);
};

export default {
  acceptInvitation,
  checkInvitation,
  removeInvitation,
};
