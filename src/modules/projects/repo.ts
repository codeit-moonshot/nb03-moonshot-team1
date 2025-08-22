import prisma from '#prisma/prisma';
import { InvitationDto, ExcludeMemberDto } from './dto/project.dto';

const findById = async (id: {projectId: number, userId: number}) => {
  return await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: id.projectId,
        userId: id.userId
      }
    }
  });
}

const create = async (data: InvitationDto):
  Promise<{ id: number }> => {
  return await prisma.invitation.create({
    data: {
      project: { connect: { id: data.projectId } },
      inviter: { connect: { id: data.inviter } },
      email: data.targetEmail,
      token: data.invitationToken
    },
    select: { id: true }
  });
}

const remove = async(data: ExcludeMemberDto): Promise<void> => {
  await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId: data.projectId,
        userId: data.targetUserId
      }
    }
  });
}

export default {
  findById,
  create,
  remove
}
