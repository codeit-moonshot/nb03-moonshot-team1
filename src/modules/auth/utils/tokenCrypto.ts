import crypto from 'crypto';
import env from '#config/env';

const TOKEN_ENCRYPT_KEY = env.TOKEN_ENCRYPT_KEY;
if (!TOKEN_ENCRYPT_KEY) {
  throw new Error('토큰 암호화 키가 설정되지 않았습니다.');
}
// 환경변수에서 32바이트 키 가져오기
const key = crypto.scryptSync(TOKEN_ENCRYPT_KEY, 'salt', 32);
const iv = Buffer.alloc(16, 0);

/** 토큰 암호화 */
const encryptToken = (plainText: string): string => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/** 토큰 복호화 */
const decryptToken = (encryptedText: string): string => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export default {
  encryptToken,
  decryptToken,
};
