import { google } from 'googleapis';
import tasksService from '#modules/tasks/tasks.service';
import tokenCrypto from '#modules/auth/utils/tokenCrypto';
import { TokenDto } from '#modules/auth/dto/token.dto';
import {
  GoogleEventCreateDto,
  GoogleEventUpdateDto,
  UpdateGoogleAccessTokenDto,
} from '#modules/tasks/dto/googleEvent.dto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const calendar = google.calendar('v3');

/* 구글 캘린더 API 클라이언트 생성
구글 토큰같은경우 google.auth.OAuth2 로 토큰 set 시켜둘경우 자동으로 만료시간 체크 후 
구글에 보낼때 만료되었으면 refresh token으로 재발급 후 요청에 사용해줍니다
그래서 만약에 엑세스 토큰이 새로 발급되었는지 체크하고 발급되었다면 우리 DB에 업데이트 해줍니다
*/
const getAuthClient = (tokenDto: TokenDto) => {
  const decryptAccessToken = tokenCrypto.decryptToken(tokenDto.accessToken);
  const decryptRefreshToken = tokenCrypto.decryptToken(tokenDto.refreshToken);
  //prettier-ignore
  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({
    access_token: decryptAccessToken,
    refresh_token: decryptRefreshToken,
    expiry_date: tokenDto.expiryDate?.getTime(),
  });

  return { auth, decryptAccessToken };
};

const saveLatestGoogleToken = async (userId: number, auth: any) => {
  const { access_token, refresh_token, expiry_date } = auth.credentials;
  const expiryDate = expiry_date ? new Date(expiry_date) : new Date(Date.now() + 3600 * 1000); // fallback 1시간 후

  const updateDto: UpdateGoogleAccessTokenDto = {
    userId,
    accessToken: access_token,
    refreshToken: refresh_token ?? undefined,
    expiryDate,
  };

  await tasksService.updateGoogleAccessToken(updateDto);
};

const createEvent = async (userId: number, tokenDto: TokenDto, event: GoogleEventCreateDto) => {
  const { auth, decryptAccessToken } = getAuthClient(tokenDto);
  try {
    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      requestBody: event,
    });
    if (decryptAccessToken !== auth.credentials.access_token) await saveLatestGoogleToken(userId, auth);
    return response.data.id;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.response?.data || error.message;
    console.error(`구글 캘린더 이벤트 생성 실패: ${message}`);
  }
};

const updateEvent = async (userId: number, tokenDto: TokenDto, event: GoogleEventUpdateDto) => {
  const { auth, decryptAccessToken } = getAuthClient(tokenDto);
  try {
    const response = await calendar.events.update({
      auth,
      calendarId: 'primary',
      eventId: event.id,
      requestBody: event,
    });
    if (decryptAccessToken !== auth.credentials.access_token) await saveLatestGoogleToken(userId, auth);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.response?.data || error.message;
    console.error(`구글 캘린더 이벤트 업데이트 실패: ${message}`);
  }
};

const deleteEvent = async (userId: number, eventId: string, tokenDto: TokenDto) => {
  const { auth, decryptAccessToken } = getAuthClient(tokenDto);

  try {
    await calendar.events.delete({
      auth,
      calendarId: 'primary',
      eventId,
    });
    if (decryptAccessToken !== auth.credentials.access_token) await saveLatestGoogleToken(userId, auth);
    return true;
  } catch (error: any) {
    const message = error.response?.data?.error_description || error.response?.data || error.message;
    console.error(`구글 캘린더 이벤트 삭제 실패: ${message}`);
  }
};

export default {
  createEvent,
  updateEvent,
  deleteEvent,
};
