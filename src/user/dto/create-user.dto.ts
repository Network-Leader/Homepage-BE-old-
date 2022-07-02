import { IsString, IsEmail, IsBoolean, IsArray } from 'class-validator';
import { CreateTokenResponse } from 'src/auth/dto/create-token.dto';

export class CreateUserDto {
  @IsString()
  student_id: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  image_uri: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  github: string;

  @IsString()
  birthday: string;

  @IsBoolean()
  admin: boolean;
}

export class CreateUser {
  student_id: string;

  name: string;

  image_uri: string;

  phone: string;

  email: string;

  github: string;

  position: Array<string>;

  birthday: string;

  admin: boolean;
}

export class CreateUserResponse {
  user: CreateUser;

  token: CreateTokenResponse;
}
