import { UserByIdInterceptor } from '../common/interceptors/userById.interceptor';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  ConflictException,
  Req,
  UnauthorizedException,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard, JwtCheckGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from 'src/auth/decorator/Roles.decorator';
import { Role } from 'src/auth/types/role.enum';
import { RolesGuard } from 'src/auth/guards/Roles.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

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
  @ApiUnauthorizedResponse({
    description: '입력 받은 이메일과 인증 받은 이메일이 다릅니다',
    type: UnauthorizedException,
  })
  @ApiConflictResponse({
    description: 'Existed StudentID.',
    type: ConflictException,
  })
  @ApiBearerAuth()
  @UseGuards(JwtCheckGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req,
  ): Promise<CreateUserResponse> {
    return await this.userService.create(createUserDto, req.user.email);
  }

  @ApiOkResponse({
    description: '성공적으로 자신의 정보를 반환',
    type: User,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findMe(@Request() req): Promise<User> {
    return req.user;
  }

  @UseGuards(RolesGuard)
  @Roles(Role.GRADUATE, Role.UNDERGRADUATE)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.GRADUATE, Role.UNDERGRADUATE)
  @ApiBearerAuth()
  @UseInterceptors(UserByIdInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':user_id')
  async findOne(@Req() req): Promise<User> {
    return req.entity;
  }

  @ApiBearerAuth()
  @UseInterceptors(UserByIdInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':user_id')
  async update(
    @Param('user_id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<User> {
    const ability = this.caslAbilityFactory.createForUser();
    if (
      ability.cannotModifySelf(req.user, req.entity) ||
      ability.cannotModifyUserRole(req.user, updateUserDto)
    ) {
      throw new ForbiddenException(
        "You can't modify your own role || you can't modify other's entity",
      );
    }
    return await this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @UseInterceptors(UserByIdInterceptor)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':user_id')
  async remove(@Param('user_id') id: string, @Req() req: any): Promise<void> {
    const ability = this.caslAbilityFactory.createForUser();
    if (ability.cannotModifySelf(req.user, req.entity)) {
      throw new ForbiddenException("You can't modify other's entity");
    }
    await this.userService.remove(id);
  }
}
