import ApiError from "#errors/ApiError";
import projectRepo from './repo';
import { InvitationDto, ExcludeMemberDto } from './dto/project.dto';

const excludeMember = async (data: ExcludeMemberDto) => {
  if(data.targetUserId < 1) throw ApiError.badRequest('유효하지 않은 사용자 ID입니다.');

  const member = await projectRepo.findById({ projectId: data.projectId, userId: data.targetUserId });
  if(!member) throw ApiError.notFound('프로젝트 멤버가 아닙니다.');
  if(member.role !== 'OWNER') throw ApiError.forbidden('권한이 없습니다.');
  
  await projectRepo.remove(data);
}

export default {
  excludeMember
}