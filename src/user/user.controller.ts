import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  BadRequestException,
  UseGuards,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
   * Create a User
   *
   * 전달된 Authrization header를 검사하여 토큰이 유효한지 확인한다.
   * 이 토큰은 send-auth-mail, check-auth-code를 통해 발급된다.
   * 이메일이 중복되는지 확인하고, 중복되지 않으면 사용자 생성을 진행한다.
   * 이메일 중복이면 BadRequestException을 발생시킨다.
   * 사용자 생성이 성공하면 201 Created를 반환한다.
   * 동시에 login 작업을 수행하여 access_token과 refresh_token을 발급한다.
   */
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateUserResponse,
  })
  @ApiBadRequestResponse({
    description: 'Email duplicated.',
    type: BadRequestException,
  })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard) // admin으로 바꿀 것
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    return this.userService.create(createUserDto);
  }

  @ApiOkResponse({
    description: "성공적으로 자신의 정보를 반환",
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findMe(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() q) {
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':user_id')
  async findOne(@Param('user_id') id: string) {
    return this.userService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch(':user_id')
  async update(@Param('user_id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':user_id')
  async remove(@Param('user_id') id: string){
    return this.userService.remove(id);
  }
}
