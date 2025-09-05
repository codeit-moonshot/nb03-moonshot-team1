import nodemailer from 'nodemailer';

const smtpTransport = nodemailer.createTransport({
  host: process.env.HOSTMAIL,
  port: Number(process.env.MAILPORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true, // 연결 재사용
  maxConnections: 2, // 최대 연결 수
  connectionTimeout: 10_000, // 타임아웃 10초
  greetingTimeout: 10_000, // 10초 내에 서버 응답 없으면 실패
  socketTimeout: 15_000, // 전체 통신 15초
  tls: { servername: process.env.HOSTMAIL },
});

export default smtpTransport;
