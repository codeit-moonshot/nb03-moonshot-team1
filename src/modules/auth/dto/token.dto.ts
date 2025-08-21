import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '@prisma/client';

export interface DecodedToken extends JwtPayload {
  id: User['id'];
}

export interface SignupDto {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}
