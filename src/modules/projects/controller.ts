import type { RequestHandler } from 'express';
import { sendInvitation } from './service';
import { InvitationDto } from './project.dto';

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
  const invitationDto: InvitationDto = {
    projectId: Number(req.params.projectId),
    targetEmail: req.body.email
  }

  await sendInvitation(invitationDto);
  console.log(`초대 : ${invitationDto.targetEmail}`);
}
