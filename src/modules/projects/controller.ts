import type { RequestHandler } from 'express';
import { sendInvitation } from './service';
/**
 * @function createInvitation
 * @description 프로젝트 초대 생성
 *
 * @params {Object} req - Express 요청 객체
 * @params {Object} res - Express 응답 객체
 * 
 * @returns {201} 반환 없음
 */

export const createInvitation: RequestHandler = async (req, res) => {
  const { projectId } = req.params;
  const { targetEmail } = req.body.email;

  await sendInvitation(Number(projectId), targetEmail);
  console.log(`초대 : ${targetEmail}`);
}
