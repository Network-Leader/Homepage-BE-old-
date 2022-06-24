import { IsString } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  student_id: string;

  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}

export class CreateTokenResponse {
  access_token: string;
  refresh_token: string;
}
