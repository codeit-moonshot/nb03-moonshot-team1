import prisma from '#prisma/prisma';
import { InvitationDto } from './project.dto';

export const create = async (data: InvitationDto):
Promise<{ id: number}> => {
  return await prisma.invitation.create({
    data: {
      project: {
        connect: {
          id: data.projectId
        }
      },
      email: data.targetEmail,
      token: data.invitationToken
    },
    select: { id: true }
  });
}
  