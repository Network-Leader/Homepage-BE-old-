import { IsString, IsEmail } from 'class-validator';
import { CreateTokenResponse } from 'src/auth/dto/create-token.dto';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  student_id: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  github: string;

  @IsString()
  birthday: string;
}

export class CreateUserResponse {
  user: User;

  token: CreateTokenResponse;
}
