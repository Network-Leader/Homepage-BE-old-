import { PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { USER_STATUS } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsArray()
  @IsOptional()
  position: Array<string>;

  @IsEnum(USER_STATUS)
  @IsOptional()
  status: USER_STATUS;

  @IsString()
  @IsOptional()
  image_uri: string;
}
