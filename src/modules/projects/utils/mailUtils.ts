import ApiError from '#errors/ApiError';
import smtpTransport from './smtp-transport';

const sendMail = async (targetEmail: string, mailInfo: { subject: string, html: string }) => {
  const mailOptions = {
  from: process.env.SMTP_USER,
  to: targetEmail,
  subject: mailInfo.subject,
  html: `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${mailInfo.subject}</title>
    </head>
      `+ mailInfo.html +`
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

export default {
  sendMail
}