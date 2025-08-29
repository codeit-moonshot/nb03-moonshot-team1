import { google } from 'googleapis';
import tasksCalendar from '#modules/tasks/tasks.calendar';
import { TokenDto } from '#modules/auth/dto/token.dto';
import {
  GoogleEventCreateDto,
  GoogleEventUpdateDto,
  UpdateGoogleAccessTokenDto,
} from '#modules/tasks/dto/googleEvent.dto';
import ApiError from '#errors/ApiError';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const calendar = google.calendar('v3');

/* 구글 캘린더 API 클라이언트 생성
구글 토큰같은경우 google.auth.OAuth2 로 토큰 set 시켜둘경우 자동으로 만료시간 체크 후 갱신해주는데

*/
const getAuthClient = async (tokenDto: TokenDto) => {
  //prettier-ignore
  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({
    access_token: tokenDto.accessToken,
    refresh_token: tokenDto.refreshToken,
    expiry_date: tokenDto.expiryDate?.getTime(),
  });

  return auth;
};

export const saveLatestGoogleToken = async (userId: number, auth: any) => {
  const latestAccessToken = auth.credentials.access_token;
  if (!latestAccessToken) throw ApiError.internal('구글 액세스 토큰이 존재하지 않습니다.');

  const expiryDate = auth.credentials.expiry_date
    ? new Date(auth.credentials.expiry_date)
    : new Date(Date.now() + 3600 * 1000); // fallback 1시간 후

  const updateDto: UpdateGoogleAccessTokenDto = {
    userId,
    accessToken: latestAccessToken,
    refreshToken: auth.credentials.refresh_token,
    expiryDate,
  };

  await tasksCalendar.updateGoogleAccessToken(updateDto);
};

export const createEvent = async (userId: number, tokenDto: TokenDto, event: GoogleEventCreateDto) => {
  const auth = await getAuthClient(tokenDto);

  try {
    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      requestBody: event,
    });
    await saveLatestGoogleToken(userId, auth);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.response?.data || error.message;
    throw ApiError.internal(`구글 캘린더 이벤트 생성 실패: ${message}`);
  }
};

const updateEvent = async (userId: number, tokenDto: TokenDto, event: GoogleEventUpdateDto) => {
  const auth = await getAuthClient(tokenDto);

  try {
    const response = await calendar.events.update({
      auth,
      calendarId: 'primary',
      eventId: event.id,
      requestBody: event,
    });
    await saveLatestGoogleToken(userId, auth);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.response?.data || error.message;
    throw ApiError.internal(`구글 캘린더 이벤트 업데이트 실패: ${message}`);
  }
};

const deleteEvent = async (userId: number, tokenDto: TokenDto, eventId: string) => {
  const auth = await getAuthClient(tokenDto);

  try {
    const response = await calendar.events.delete({
      auth,
      calendarId: 'primary',
      eventId,
    });
    await saveLatestGoogleToken(userId, auth);
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
