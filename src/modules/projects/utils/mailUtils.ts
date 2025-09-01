import nodemailer from 'nodemailer';
import ApiError from '#errors/ApiError';

const setSmtpTransport = () => nodemailer.createTransport({
  host: process.env.HOSTMAIL,
  port: Number(process.env.MAILPORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendMail = (smtpTransport: nodemailer.Transporter, targetEmail: string, mailInfo: { subject: string, html: string }) => {
  const mailOptions = {
  from: process.env.SMTP_USER,
  to: targetEmail,
  subject: mailInfo.subject,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
  setSmtpTransport,
  sendMail
}