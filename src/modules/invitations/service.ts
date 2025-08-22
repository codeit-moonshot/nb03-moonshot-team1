import ApiError from "#errors/ApiError";
import dotenv from "dotenv";
import type { AcceptInvitationDto } from "./dto/invitationDto";
import invitationRepo from "./repo";

dotenv.config();

const acceptInvitation = async (acceptInvitationDto: AcceptInvitationDto): Promise<void> => {
  const { email, projectId, invitationId, ...rest } = acceptInvitationDto; 
  const data = { projectId, userId: 1, role: rest.role };
  const invitation = await invitationRepo.findInvitationById(invitationId);
  if (!invitation) {
    throw ApiError.notFound("잘못된 초대입니다.");
  }
  
  await invitationRepo.createMember(data);
};

export default {
  acceptInvitation
}