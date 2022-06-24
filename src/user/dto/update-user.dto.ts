import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
    @IsString()
    name: string
    @IsString()
    password: string
    @IsString()
    image_uri: string
    @IsString()
    phone: string
    @IsString()
    email: string
    @IsString()
    github: string
    @IsString()
    birthday: string
}
