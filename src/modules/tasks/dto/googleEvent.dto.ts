export interface GoogleEventCreateDto {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export interface GoogleEventUpdateDto extends GoogleEventCreateDto {
  id: string;
}

export interface UpdateGoogleAccessTokenDto {
  userId: number;
  accessToken: string;
  refreshToken: string;
  expiryDate: Date;
}

export type GoogleTokenDto = Omit<UpdateGoogleAccessTokenDto, 'userId'>;
