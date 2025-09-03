import ApiError from "#errors/ApiError";
import type { AcceptInvitationDto } from "#modules/invitations/dto/invitations.Dto";
import invitationRepo from "#modules/invitations/invitations.repo";


const acceptInvitation = async (acceptInvitationDto: AcceptInvitationDto, invitationId: number) => {
  await invitationRepo.createMember(acceptInvitationDto);
  await invitationRepo.update(invitationId);
};

const checkInvitation = async (invitationId: number, acceptedToken: string) => {
  const invitation = await invitationRepo.findInvitationById(invitationId);
  if (!invitation) throw ApiError.notFound("잘못된 초대입니다.");
  if (invitation.token !== acceptedToken) throw ApiError.notFound("잘못된 초대입니다.");
  if (invitation.expiresAt! < new Date()) throw ApiError.badRequest("만료된 초대입니다.");

  return invitation.projectId;
}

export default {
  acceptInvitation,
  checkInvitation
}