import ApiError from "#errors/ApiError";
import projectRepo from './project.repo';
import { InvitationDto, ExcludeMemberDto, createProjectDto, updateProjectDto } from './dto/project.dto';
import { generateInvitationToken } from "./utils/tokenUtils";
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
  const mailText = 
    `[Moonshot] 프로젝트 삭제 알림
    <h1> 참여중인 프로젝트가 삭제되었습니다. </h1>
    <p>삭제된 프로젝트: ${deleteMailInfo.name}</p>
    `;
  for (const member of deleteMailInfo.members) {
    const targetEmail = member.user.email;
    console.log(`메일 전송: ${targetEmail}`);
    console.log(mailText);
    // await mailUtils.sendMail(smtpTransport, targetEmail, mailText);
  }
}

const sendInvitation = async (data: InvitationDto) => {
  const invitationToken = generateInvitationToken(data.projectId, data.targetEmail);
  // db 저장부터 메일 발송까지 트랜잭션이 필요해보임
  const invitationId = await projectRepo.createInvitation({ ...data, invitationToken });
  return {
    invitationId: invitationId.id,
    invitationToken
  }
  // 추후 분리해야 할듯
  // const smtpTransport = nodemailer.createTransport({
  //   host: process.env.HOSTMAIL,
  //   port: Number(process.env.MAILPORT),
  //   secure: true,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS
  //   },
  // });

  // const mailOptions = {
  //   from: process.env.SMTP_USER,
  //   to: 'gkstjswo122@gmail.com',
  //   subject: 'Test Email',
  //   html: `
  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //       <meta charset="UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <title>Test Email</title>`
  //       <body>
  //         <h1> 프로젝트에 초대합니다. </h1>
  //         <p>아래 링크를 클릭하여 프로젝트에 참여하세요:</p>
  //         <a href=${process.env.FRONT_URL}/invitation?token=${invitationToken}>참여하기</a>
  //       </body>
  //     </html>
  //   `
  // };

  // smtpTransport.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     throw ApiError.internal('메일 전송 실패', error);
  //   }
  //   console.log('메일 전송 성공: ', info.response);
  // });
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