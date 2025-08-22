import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '@prisma/client';

export interface DecodedToken extends JwtPayload {
  id: User['id'];
}

export interface RefreshDto {
  refreshToken: string;
}

export interface AuthHeaderDto {
  authorization: string;
}
