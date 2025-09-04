import * as api from '@/shared/api';
import ActionResult from '@/types/ActionResult';

export const acceptMemberInvitation = async (
  invitationId: number,
  token: string,
): Promise<ActionResult<boolean>> => {
  try {
    const invitation = await api.acceptMemberInvitation(invitationId, token);
    return {
      success: '멤버 초대 수락 성공',
      data: invitation,
      error: null,
    }
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : '멤버 초대 수락 중 오류가 발생했습니다.',
      data: null,
    };
  }
}