import prisma from '#prisma/prisma';
import type { CreateMemberDto } from './dto/invitations.Dto';

export const findInvitationById = async (id: number) => {
  return await prisma.invitation.findUnique({
    where: { id }
  })
}

export const createMember = async (data: CreateMemberDto) => {
  return await prisma.projectMember.create({
    data: {
      project: { connect: { id: data.projectId }},
      user: { connect: { id: data.userId }},
      role: data.role
    }
  })
}

export const remove = async (invitationId: number) => {
  return await prisma.invitation.delete({
    where: { id: invitationId }
  });
}

export default {
  findInvitationById,
  createMember,
  remove
}