import nodemailer from 'nodemailer';

const smtpTransport = nodemailer.createTransport({
  host: process.env.HOSTMAIL,
  port: Number(process.env.MAILPORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default smtpTransport;
