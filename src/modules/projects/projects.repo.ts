import prisma from '#prisma/prisma';
import { Prisma } from '@prisma/client';
import {
  createProjectDto,
  InvitationDto,
  ExcludeMemberDto,
  updateProjectDto,
  projectMemberQueryDto,
} from '#modules/projects/dto/projects.dto';
import { MeProjectQueryDto } from '#modules/projects/dto/me-projects.dto';

const select = {
  id: true,
  name: true,
  description: true,
  tasks: { select: { status: true } },
  _count: { select: { members: true } }
};

const findById = async (projectId: number, userId: number) => {
  const findSelect = {
    ...select,
    members: {
      where: { userId },
      select: { userId: true }
    }
  };
  return await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select: findSelect
  });
};

const create = async (data: createProjectDto, userId: number) => {
  const project = await prisma.project.create({
    data: {
      ...data,
      owner: { connect: { id: userId } }
    },
    select
  });

  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      userId,
      role: 'OWNER'
    }
  });

  return project;
};

const update = async (data: updateProjectDto, id: number) => {
  return await prisma.project.update({
    where: { id },
    data,
    select
  });
};

const remove = async (id: number) => {
  await prisma.project.delete({
    where: { id }
  });
};

const findUserByEmail = async (email: string, tx: Prisma.TransactionClient) => {
  return await tx.user.findUnique({
    where: { email },
    select: { id: true }
  });
};

const findMemberById = async (id: { projectId: number; userId: number }) => {
  return await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: id.projectId,
        userId: id.userId
      }
    },
    select: { role: true }
  });
};

const findMembers = async (projectId: number, query: projectMemberQueryDto) => {
  const total = await prisma.projectMember.count({
    where: {
      projectId,
      role: { in: ['MEMBER', 'INVITED'] }
    }
  });
  const members = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      members: {
        where: {
          role: { in: ['MEMBER', 'INVITED'] }
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              _count: { select: { tasks: { where: { projectId } } } },
            }
          }
        },
        take: query.limit,
        skip: query.limit * (query.page - 1),
      },
      invitations: {
        select: {
          email: true,
          status: true,
          id: true,
        }
      },
      _count: { select: { members: true } }
    }
  });

  return { members, total };
};

const findDeleteMailInfo = async (id: number) => {
  return await prisma.project.findUnique({
    where: { id },
    select: {
      name: true,
      members: { select: { user: { select: { email: true } } } }
    }
  });
};

const findMyProjects = async (userId: number, query: MeProjectQueryDto) => {
  const orderBy = { [query.order_by]: query.order };
  const findMyProjectsTransaction = await prisma.$transaction(async (tx) => {
    const projects = await tx.project.findMany({
      where: { members: { some: { userId } } },
      skip: query.limit * (query.page - 1),
      take: query.limit,
      orderBy,
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
    const total = await tx.project.count({
      where: { members: { some: { userId } } }
    });
    return { data: projects, total };2
  });
  return findMyProjectsTransaction;
};

const createInvitation = async (data: InvitationDto, targetUserId: number, tx: Prisma.TransactionClient) => {
  const invitation = await tx.invitation.create({
    data: {
      project: { connect: { id: data.projectId } },
      inviter: { connect: { id: data.inviter } },
      email: data.targetEmail,
      token: data.invitationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 24 * 7) // 1 week expiration
    },
    select: { id: true }
  });

  // 프로젝트 멤버에 추가
  await tx.projectMember.create({
    data: {
      projectId: data.projectId,
      userId: targetUserId,
      role: 'INVITED'
    }
  });

  return invitation.id;
};

const removeMember = async (data: ExcludeMemberDto) => {
  prisma.$transaction(async (tx) => {
    // 프로젝트 멤버에서 제거
    await tx.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: data.projectId,
          userId: data.targetUserId,
        }
      }
    });
    const targetEmail = await tx.user.findUnique({
      where: { id: data.targetUserId },
      select: { email: true }
    });
    // 초대 정보 제거
    await tx.invitation.deleteMany({
      where: {
        projectId: data.projectId,
        email: targetEmail!.email,
      }
    });
  });
};

export default {
  create,
  update,
  findById,
  findUserByEmail,
  findMemberById,
  findMembers,
  findDeleteMailInfo,
  findMyProjects,
  createInvitation,
  remove,
  removeMember,
};
