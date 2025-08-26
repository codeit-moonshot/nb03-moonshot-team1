import ApiError from "#errors/ApiError";
import type { AcceptInvitationDto } from "./dto/invitationDto";
import invitationRepo from "./invitation.repo";


const acceptInvitation = async (acceptInvitationDto: AcceptInvitationDto): Promise<void> => {
  const { email, projectId, invitationId, ...rest } = acceptInvitationDto; 
  const data = { projectId, userId: 2, role: rest.role };
  const invitation = await invitationRepo.findInvitationById(invitationId);
  if (!invitation) throw ApiError.notFound("잘못된 초대입니다.");
  
  await invitationRepo.createMember(data);
  await invitationRepo.remove(invitationId);
};

export default {
  acceptInvitation
}