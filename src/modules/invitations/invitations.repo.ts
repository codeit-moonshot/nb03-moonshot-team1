import prisma from '#prisma/prisma';
import type { CreateMemberDto } from '#modules/invitations/dto/invitations.Dto';

export const findById = async (id: number) => {
  return await prisma.invitation.findUnique({
    where: { id },
  });
};

export const createMember = async (data: CreateMemberDto) => {
  return await prisma.projectMember.create({
    data: {
      project: { connect: { id: data.projectId } },
      user: { connect: { id: data.userId } },
      role: data.role,
    },
  });
};

export const update = async (id: number) => {
  await prisma.invitation.update({
    where: { id },
    data: { status: 'accepted' },
  });
};

export const remove = async (invitation: { id: number; projectId: number; email: string }) => {
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

export default {
  findById,
  createMember,
  update,
  remove,
};
