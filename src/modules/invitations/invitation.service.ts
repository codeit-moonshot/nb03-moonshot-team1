import ApiError from "#errors/ApiError";
import type { AcceptInvitationDto } from "./dto/invitationDto";
import invitationRepo from "./invitation.repo";


const acceptInvitation = async (acceptInvitationDto: AcceptInvitationDto, invitationId: number) => {
  await invitationRepo.createMember(acceptInvitationDto);
  await invitationRepo.remove(invitationId);
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