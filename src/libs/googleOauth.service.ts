import axios from 'axios';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const SCOPE = ['openid', 'profile', 'email'].join(' ');

const getGoogleAuthURL = () => {
  const baseUrl = new URL(GOOGLE_AUTH_URL);
  baseUrl.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  }).toString();
  return baseUrl.toString(); // Google OAuth URL 값 정의
};

const getGoogleToken = async (code: string) => {
  const response = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }).toString(),
    //prettier-ignore
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded', } }
  );
  return response.data; // 토큰 뽑아서 사용
};

/* 토큰 response.data 참고 
  {
  "access_token": "ya29.a0AfH6SMBexampleAccessToken",
  "expires_in": 3599,
  "scope": "openid email profile",
  "token_type": "Bearer",
  "refresh_token": "1//0gExampleRefreshToken",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjexampleIdToken"
}
  */

const getGoogleUserInfo = async (accessToken: string) => {
  const response = await axios.get(USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data; // 사용자 정보 뽑아서 사용
};

/* 유저 response.data 참고
  {
    "id": "123456789",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://example.com/user.jpg"
  }
  */

export default {
  getGoogleAuthURL,
  getGoogleToken,
  getGoogleUserInfo,
};
