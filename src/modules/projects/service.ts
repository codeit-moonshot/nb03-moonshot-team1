import ApiError from "#errors/ApiError";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { create } from './repo';

dotenv.config();

export const sendInvitation = async (projectId: Number, targetEmail: String): Promise<void> => {
  const invitationToken = 'some Token';
  const invitationId = await create(projectId, targetEmail, invitationToken);

  // 추후 분리해야 할듯
  const smtpTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
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

  await smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw ApiError.internal('메일 전송 실패', error);
    }
    console.log('메일 전송 성공: ', info.response);
  });
}
