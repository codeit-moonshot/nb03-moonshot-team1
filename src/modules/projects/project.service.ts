import prisma from "#prisma/prisma";
import ApiError from "#errors/ApiError";
import projectRepo from './project.repo';
import { InvitationDto, ExcludeMemberDto, createProjectDto, updateProjectDto } from './dto/project.dto';
import mailUtils from "./utils/mailUtils";

const checkRole = async (userId: number, projectId: number) => {
  const member = await projectRepo.findMemberById({ projectId, userId });
  if (!member) throw ApiError.notFound('사용자를 찾을 수 없습니다.');
  if (member.role !== 'OWNER') throw ApiError.forbidden('권한이 없습니다.');
}

const createProject = async (data: createProjectDto, userId: number) => {
  const project = await projectRepo.create(data, userId);
  const createdProject = {
    id: project.id,
    name: project.name,
    description: project.description,
    memberCount: project.members.length,
    todoCount: project.tasks.filter(task => task.status === 'todo').length,
    inProgressCount: project.tasks.filter(task => task.status === 'in_progress').length,
    doneCount: project.tasks.filter(task => task.status === 'done').length
  };

  return createdProject;
}

const updateProject = async (data: updateProjectDto, projectId: number) => {
  const project = await projectRepo.update(data, projectId);
  const updatedProject = {
    id: project.id,
    name: project.name,
    description: project.description,
    memberCount: project.members.length,
    todoCount: project.tasks.filter(task => task.status === 'todo').length,
    inProgressCount: project.tasks.filter(task => task.status === 'in_progress').length,
    doneCount: project.tasks.filter(task => task.status === 'done').length
  };
  return updatedProject;
}

const deleteProject = async (projectId: number) => {
  const deleteMailInfo = await projectRepo.findDeleteMailInfo(projectId);
  await projectRepo.remove(projectId);
  
  const smtpTransport = mailUtils.setSmtpTransport();
  const mailInfo = {
    subject: '[Moonshot] 프로젝트 삭제 알림',
    html: `
      <title>프로젝트 삭제 알림</title>
      <body>
        <h1> 참여중인 프로젝트가 삭제되었습니다. </h1>
        <p>삭제된 프로젝트: ${deleteMailInfo.name}</p>
      </body>
    `
  }
  for (const member of deleteMailInfo.members) {
    const targetEmail = member.user.email;
    await mailUtils.sendMail(smtpTransport, targetEmail, mailInfo);
  }
}

const sendInvitation = async (data: InvitationDto) => {
  await prisma.$transaction(async (tx) => {
    const { id } = await projectRepo.createInvitation(data, tx);
    const smtpTransport = mailUtils.setSmtpTransport();
    const mailInfo = {
      subject: "프로젝트에 초대합니다",
      html: `<title>프로젝트 초대 메일</title>
      <body>
        <h1> 프로젝트에 초대합니다. </h1>
        <p>아래 링크를 클릭하여 프로젝트에 참여하세요:</p>
        <a href=${process.env.FRONT_URL}/invitations/${id}?token=${data.invitationToken}>참여하기</a>
      </body>
      `
    }
    await mailUtils.sendMail(smtpTransport, data.targetEmail, mailInfo);
  })
}

const excludeMember = async (data: ExcludeMemberDto) => {
  if(data.targetUserId < 1) throw ApiError.badRequest('유효하지 않은 사용자 ID입니다.');

  const member = await projectRepo.findMemberById({ projectId: data.projectId, userId: data.targetUserId });
  if(!member) throw ApiError.notFound('프로젝트 멤버가 아닙니다.');
  if(member.role !== 'OWNER') throw ApiError.forbidden('권한이 없습니다.');
  
  await projectRepo.removeMember(data);
}

export default {
  checkRole,
  createProject,
  updateProject,
  deleteProject,
  sendInvitation,
  excludeMember
}