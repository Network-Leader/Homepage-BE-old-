import { IsString, IsEmail, IsBoolean, IsArray } from 'class-validator';
import { CreateTokenResponse } from 'src/auth/dto/create-token.dto';

export class CreateUserDto {
  @IsString()
  id:	string
  @IsString()
  student_id:	string
  @IsString()  
  name:	string
  @IsString()
  image_uri: string
  @IsString()
  phone: string
  @IsString()
  email: string
  @IsString()
  github:	string
  @IsArray()
  position:	[]
  @IsString()
  birthday: string
  @IsBoolean()
  admin: boolean
}

export class CreateUser {
  id:	string

  student_id:	string

  name:	string

  image_uri: string

  phone: string

  email: string

  github:	string

  position:	[]

  birthday: string

  admin: boolean
 
}

export class CreateUserResponse {
  user: CreateUser;

  token: CreateTokenResponse;
}
