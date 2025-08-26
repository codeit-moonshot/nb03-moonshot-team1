import ApiError from "#errors/ApiError";
import nodemailer from "nodemailer";
import type { InvitationDto, AcceptInvitationDto } from "./dto/invitationDto";
import invitationRepo from "./repo";
import { generateInvitationToken } from "./invitationToken";

const sendInvitation = async (data: InvitationDto): Promise<void> => {
  const invitationToken = generateInvitationToken(data.projectId, data.targetEmail);
  // db 저장부터 메일 발송까지 트랜잭션이 필요해보임
  const invitationId = await invitationRepo.create({ ...data, invitationToken });
  // 추후 분리해야 할듯
  const smtpTransport = nodemailer.createTransport({
    host: process.env.HOSTMAIL,
    port: Number(process.env.MAILPORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: 'gkstjswo122@gmail.com',
    subject: 'Test Email',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email</title>
        <body>
          <h1> 프로젝트에 초대합니다. </h1>
          <p>아래 링크를 클릭하여 프로젝트에 참여하세요:</p>
          <a href=http://localhost:3000/api/invitations/${invitationId}/accept/${invitationToken}>참여하기</a>
        </body>
      </html>
    `
  };

  smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw ApiError.internal('메일 전송 실패', error);
    }
    console.log('메일 전송 성공: ', info.response);
  });
}

const acceptInvitation = async (acceptInvitationDto: AcceptInvitationDto): Promise<void> => {
  const { email, projectId, invitationId, ...rest } = acceptInvitationDto; 
  const data = { projectId, userId: 1, role: rest.role };
  const invitation = await invitationRepo.findInvitationById(invitationId);
  if (!invitation) {
    throw ApiError.notFound("잘못된 초대입니다.");
  }
  
  await invitationRepo.createMember(data);
};

export default {
  acceptInvitation,
  sendInvitation
}