import ApiError from "#errors/ApiError";
import nodemailer from "nodemailer";
import projectRepo from './project.repo';
import { InvitationDto, ExcludeMemberDto } from './dto/project.dto';
import { generateInvitationToken } from "./tokenUtils";

const sendInvitation = async (data: InvitationDto): Promise<{ invitationId: number; invitationToken: string }> => {
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

  const member = await projectRepo.findById({ projectId: data.projectId, userId: data.targetUserId });
  if(!member) throw ApiError.notFound('프로젝트 멤버가 아닙니다.');
  if(member.role !== 'OWNER') throw ApiError.forbidden('권한이 없습니다.');
  
  await projectRepo.remove(data);
}

export default {
  sendInvitation,
  excludeMember
}