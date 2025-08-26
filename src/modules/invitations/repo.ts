import prisma from '#prisma/prisma';
import type { CreateMemberDto } from './dto/invitationDto';

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
  findInvitationById,
  createMember
}