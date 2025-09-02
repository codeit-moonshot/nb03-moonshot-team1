import prisma from '#prisma/prisma';
import { Prisma } from '@prisma/client';
import { createProjectDto, InvitationDto, ExcludeMemberDto, updateProjectDto } from './dto/project.dto';
import { MeProjectQueryDto } from './dto/me-project.dto';

const findById = async (id: number) => {
  return await prisma.project.findUniqueOrThrow({
    where: { id },
    include: { owner: true }
  })
}

const create = async (data: createProjectDto, userId: number) => {
  const project =  await prisma.project.create({
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

  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId,
      role: 'OWNER'
    }
  })

  return project;
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

const findMyProjects = async (userId: number, query: MeProjectQueryDto) => {
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId } } },
    skip: query.limit * (query.page - 1),
    take: query.limit,
    orderBy: { [query.order_by]: query.order },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      tasks: { select: { status: true } },
      _count: { select: { members: true } }
    }
  });
  const total = await prisma.project.count({
    where: { members: { some: { userId } } }
  });

  return { data: projects, total };
}

const createInvitation = async (data: InvitationDto, tx: Prisma.TransactionClient) => {
  return await tx.invitation.create({
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
  findMyProjects,
  createInvitation,
  remove,
  removeMember
}
