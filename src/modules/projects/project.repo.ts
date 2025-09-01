import prisma from '#prisma/prisma';
import { createProjectDto, InvitationDto, ExcludeMemberDto, updateProjectDto } from './dto/project.dto';

const findById = async (id: number) => {
  return await prisma.project.findUniqueOrThrow({
    where: { id },
    include: { owner: true }
  })
}

const create = async (data: createProjectDto, userId: number) => {
  return await prisma.project.create({
    data: {
      ...data,
      owner: { connect: { id: userId } }
    },
    select: {
      id: true,
      name: true,
      description: true,
      members: { select: { userId: true } },
      tasks: {
        select: {
          id: true,
          status: true
        }
      }
    }
  });
}

const update = async (data: updateProjectDto, id: number) => {
  return await prisma.project.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      description: true,
      members: { select: { userId: true } },
      tasks: {
        select: {
          id: true,
          status: true
        }
      }
    }
  });
}

const remove = async (id: number) => {
  await prisma.project.delete({
    where: { id }
  });
}

const findMemberById = async (id: {projectId: number, userId: number}) => {
  return await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: id.projectId,
        userId: id.userId
      }
    },
  });
}

const findDeleteMailInfo = async (id: number) => {
  return await prisma.project.findUniqueOrThrow({
    where: { id },
    select: { 
      name: true,
      members: { select: { user: { select: { email: true } } } }
    }
  })
}

const createInvitation = async (data: InvitationDto):
  Promise<{ id: number }> => {
  return await prisma.invitation.create({
    data: {
      project: { connect: { id: data.projectId } },
      inviter: { connect: { id: data.inviter } },
      email: data.targetEmail,
      token: data.invitationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7) // 1 week expiration
    },
    select: { id: true }
  });
}

const removeMember = async(data: ExcludeMemberDto): Promise<void> => {
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
  create,
  update,
  findById,
  findMemberById,
  findDeleteMailInfo,
  createInvitation,
  remove,
  removeMember
}
