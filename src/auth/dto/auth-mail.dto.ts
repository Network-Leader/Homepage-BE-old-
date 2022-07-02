import { IsEmail, IsString } from 'class-validator';

export class UserAuthMailDto {
  @IsEmail()
  email: string;
}

export class UserAuthCodeDto {
  @IsString()
  code: string;

  @IsEmail()
  email: string;
}

export class AuthCodeResponse {
  disposable_access_token: string;
}
