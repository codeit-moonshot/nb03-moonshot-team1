import prisma from '#prisma/prisma';
import type { AcceptInvitationDto, CreateMemberDto } from '#modules/invitations/dto/invitations.Dto';
import { Prisma } from '@prisma/client';

const findById = async (id: number) => {
  return await prisma.invitation.findUnique({
    where: { id },
  });
};

const remove = async (invitation: { id: number; projectId: number; email: string }) => {
  await prisma.$transaction(async (tx) => {
    // 프로젝트 멤버 데이터 삭제
    await tx.projectMember.deleteMany({
      where: {
        projectId: invitation.projectId,
        role: 'INVITED',
        user: { email: invitation.email },
      },
    });
    // 초대 데이터 삭제
    await tx.invitation.deleteMany({
      where: { id: invitation.id },
    });
  });
};

const acceptInvitation = async (data: AcceptInvitationDto, invitationId: number) => {
  try{
    await prisma.$transaction(async (tx) => {
      await tx.invitation.update({
        where: { id: invitationId },
        data: { status: 'accepted' },
      });
      await tx.projectMember.update({
        where: {
          projectId_userId: {
            projectId: data.projectId,
            userId: data.userId,
          }
        },
        data: { role: 'MEMBER' },
      });
    });
    return 'ok';
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return 'not found';
    }
    else return 'unknown';
  }
  
};

export default {
  findById,
  remove,
  acceptInvitation,
};