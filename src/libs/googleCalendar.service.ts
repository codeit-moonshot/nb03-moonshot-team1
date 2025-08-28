import { google } from 'googleapis';
import tasksCalendar from '#modules/tasks/tasks.calendar';
import { TokenDto } from '#modules/auth/dto/token.dto';
import { GoogleEventCreateDto, GoogleEventUpdateDto } from '#modules/tasks/dto/googleEvent.dto';
import ApiError from '#errors/ApiError';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const calendar = google.calendar('v3');

/* 구글 캘린더 API 클라이언트 생성
구글 토큰같은경우 google.auth.OAuth2 로 토큰 set 시켜둘경우 자동으로 만료시간 체크 후 갱신해주는데

*/
const getAuthClient = async (userId: number, tokenDto: TokenDto) => {
  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

  auth.setCredentials({
    access_token: tokenDto.accessToken,
    refresh_token: tokenDto.refreshToken,
    expiry_date: tokenDto.expiryDate?.getTime(),
  });

  if (!tokenDto.expiryDate || tokenDto.expiryDate.getTime() < Date.now()) {
    const response = await auth.refreshAccessToken();
    const newToken = response.credentials.access_token;
    const expiryDate = new Date(Date.now() + 3600 * 1000);

    if (!newToken) throw ApiError.internal('구글 캘린더 토큰 갱신 실패 - newToken 없음');
    await tasksCalendar.updateGoogleAccessToken(userId, newToken, expiryDate);

    auth.setCredentials({
      access_token: newToken,
      refresh_token: tokenDto.refreshToken,
      expiry_date: expiryDate.getTime(),
    });
  }

  return auth;
};

export const createEvent = async (userId: number, tokenDto: TokenDto, event: GoogleEventCreateDto) => {
  const auth = await getAuthClient(userId, tokenDto);

  try {
    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.response?.data || error.message;
    throw ApiError.internal(`구글 캘린더 이벤트 생성 실패: ${message}`);
  }
};

const updateEvent = async (userId: number, tokenDto: TokenDto, event: GoogleEventUpdateDto) => {
  const auth = await getAuthClient(userId, tokenDto);

  try {
    const response = await calendar.events.update({
      auth,
      calendarId: 'primary',
      eventId: event.id,
      requestBody: event,
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.response?.data || error.message;
    throw ApiError.internal(`구글 캘린더 이벤트 업데이트 실패: ${message}`);
  }
};

const deleteEvent = async (userId: number, tokenDto: TokenDto, eventId: string) => {
  const auth = await getAuthClient(userId, tokenDto);

  try {
    const response = await calendar.events.delete({
      auth,
      calendarId: 'primary',
      eventId,
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.response?.data || error.message;
    throw ApiError.internal(`구글 캘린더 이벤트 삭제 실패: ${message}`);
  }
};

export default {
  createEvent,
  updateEvent,
  deleteEvent,
};
