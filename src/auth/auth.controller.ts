import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpStatus,
  HttpCode,
  Body,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthCodeResponse,
  UserAuthCodeDto,
  UserAuthMailDto,
} from './dto/auth-mail.dto';
import {
  CreateTokenDto,
  CreateTokenResponse,
  RefreshTokenDto,
} from './dto/create-token.dto';
import { RefreshJwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /*
   * Login User
   *
   * 전달된 인증 정보를 검사하여 access_token과 refresh_token을 발급한다.
   */
  @ApiBody({ type: CreateTokenDto })
  @ApiOkResponse({
    description: 'access token과 refresh token을 JWT 형식으로 전달합니다.',
    type: CreateTokenResponse,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Request() req): Promise<CreateTokenResponse> {
    return this.authService.login(req.user);
  }

  /*
   * Refresh access token
   *
   * api req body의 refresh_token을 삭제하고, 새로운 access_token과
   * refresh_token을 발급한다.
   */
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    description: 'refresh 토큰으로 새 JWT 토큰을 발행받습니다.',
    type: CreateTokenResponse,
  })
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }

  /*
   * Logout User
   *
   * api request body의 refresh_token을 삭제한다.
   */
  @ApiBody({ type: RefreshTokenDto })
  @ApiNoContentResponse({
    description: '성공적으로 로그아웃되었습니다.',
  })
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  @ApiBody({ type: UserAuthMailDto })
  @ApiNoContentResponse({
    description: 'Send mail successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Email not sent.',
    type: BadRequestException,
  })
  @ApiBadRequestResponse({
    description: 'Email duplicated.',
    type: ConflictException,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/send-code')
  async sendAuthorizationEmail(@Body() authMailDto: UserAuthMailDto) {
    return this.authService.sendAuthorizationEmail(authMailDto);
  }

  @ApiBody({ type: UserAuthCodeDto })
  @ApiOkResponse({
    description: 'Validate auth code successfully.',
    type: AuthCodeResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/check-code')
  async checkAuthorizationCode(@Body() authCodeDto: UserAuthCodeDto) {
    return this.authService.checkAuthorizationCode(authCodeDto);
  }
}
