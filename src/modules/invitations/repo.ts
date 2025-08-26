import prisma from '#prisma/prisma';
import type { InvitationDto, CreateMemberDto } from './dto/invitationDto';

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

export const getToken = () => {

}

export const findInvitationById = (id: number) => {
  return prisma.invitation.findUnique({
    where: { id }
  })
}

export const createMember = (data: CreateMemberDto) => {
  return prisma.projectMember.create({
    data: {
      project: { connect: { id: data.projectId }},
      user: { connect: { id: data.userId }},
      role: data.role
    }
  })
}

export default {
  create,
  findInvitationById,
  createMember
}