import { FRONT_ORIGIN } from '#config/env';
import prisma from '#prisma/prisma';
import ApiError from '#errors/ApiError';
import projectRepo from '#modules/projects/projects.repo';
import { generateInvitationToken } from '#modules/projects/utils/tokenUtils';
import {
  InvitationDto,
  ExcludeMemberDto,
  createProjectDto,
  updateProjectDto,
  projectMemberQueryDto,
} from '#modules/projects/dto/projects.dto';
import mailUtils from '#modules/projects/utils/mailUtils';
import { MeProjectQueryDto } from '#modules/projects/dto/me-projects.dto';

const formatProject = (project: any) => {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    memberCount: project._count.members,
    todoCount: project.tasks.filter((task: any) => task.status === 'todo').length,
    inProgressCount: project.tasks.filter((task: any) => task.status === 'in_progress').length,
    doneCount: project.tasks.filter((task: any) => task.status === 'done').length,
  };
};

const checkRole = async (projectId: number, userId: number) => {
  const member = await projectRepo.findMemberById(projectId, userId);
  if (!member) throw ApiError.forbidden('프로젝트 멤버가 아닙니다.');
  if (member.role !== 'OWNER') throw ApiError.forbidden('권한이 없습니다.');
};

const createProject = async (data: createProjectDto, userId: number) => {
  const project = await projectRepo.create(data, userId);
  return formatProject(project);
};

const getProject = async (projectId: number, userId: number) => {
  const project = await projectRepo.findById(projectId, userId);
  if (!project) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');
  if (project.members.length === 0) throw ApiError.forbidden('프로젝트 멤버가 아닙니다.');

  return formatProject(project);
};

const getProjectMembers = async (projectId: number, query: projectMemberQueryDto) => {
  const { members, total } = await projectRepo.findMembers(projectId, query);
  if (!members) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');

  const data = members.members.map((member) => {
    const invite = members.invitations.find((invitation) => invitation.email === member.user.email);
    return {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      profileImage: member.user.profileImage,
      taskCount: member.user._count.tasks,
      status: invite?.status,
      invitationId: invite?.id,
    };
  });

  return { data, total };
};

const updateProject = async (data: updateProjectDto, projectId: number, userId: number) => {
  await checkRole(projectId, userId);
  const project = await projectRepo.update(data, projectId);
  return formatProject(project);
};

const deleteProject = async (projectId: number, userId: number) => {
  await checkRole(projectId, userId);
  const deleteMailInfo = await projectRepo.findDeleteMailInfo(projectId);
  if (!deleteMailInfo) throw ApiError.notFound('프로젝트를 찾을 수 없습니다.');
  await projectRepo.remove(projectId);

  const mailInfo = {
    subject: '[Moonshot] 프로젝트 삭제 알림',
    html: `
        <h1> 참여중인 프로젝트가 삭제되었습니다. </h1>
        <p>삭제된 프로젝트: ${deleteMailInfo.name}</p>
    `,
  };
  for (const member of deleteMailInfo.members) {
    const targetEmail = member.user.email;
    void mailUtils.sendMail(targetEmail, mailInfo).catch((e) => console.error('[deleteProject] mail send fail:', e));
  }
};

const sendInvitation = async (data: InvitationDto) => {
  await checkRole(data.projectId, data.inviter!);

  const { invitationId, targetEmail, invitationToken } = await prisma.$transaction(async (tx) => {
    const targetUser = await projectRepo.findUserByEmail(data.targetEmail, tx);
    if (!targetUser) throw ApiError.notFound('초대할 사용자를 찾을 수 없습니다.');

    const token = generateInvitationToken(data.projectId, targetUser.id, data.targetEmail);

    const id = await projectRepo.createInvitation({ ...data, invitationToken: token }, targetUser.id, tx);

    return { invitationId: id, targetEmail: data.targetEmail, invitationToken: token };
  });

  // 커밋 처리 후 메일 발송 -- 비동기로 처리하면 네트워크 시간 지연 문제로 단순 처리.
  const mailInfo = {
    subject: '프로젝트에 초대합니다',
    html: `
      <h1> 프로젝트에 초대합니다. </h1>
      <p>아래 링크를 클릭하여 프로젝트에 참여하세요:</p>
      <a href="${FRONT_ORIGIN}/invitations/${invitationId}?token=${encodeURIComponent(invitationToken)}">참여하기</a>
    `,
  };

  void mailUtils.sendMail(targetEmail, mailInfo).catch((e) => console.error('[sendInvitation] mail send fail:', e));
};

const excludeMember = async (data: ExcludeMemberDto, userId: number) => {
  if (data.targetUserId < 1) throw ApiError.badRequest('유효하지 않은 사용자 ID입니다.');
  await checkRole(data.projectId, userId);
  await projectRepo.removeMember(data);
};

const getMyProjects = async (userId: number, query: MeProjectQueryDto) => {
  const projects = await projectRepo.findMyProjects(userId, query);

  const formattedProjects = projects.data.map((project) => {
    return {
      ...formatProject(project),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  });

  return {
    data: formattedProjects,
    total: projects.total,
  };
};

export default {
  createProject,
  getProject,
  getProjectMembers,
  updateProject,
  deleteProject,
  sendInvitation,
  excludeMember,
  getMyProjects,
};
