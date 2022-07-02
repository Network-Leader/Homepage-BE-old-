import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { CreateTokenResponse } from './dto/create-token.dto';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import {
  AuthCodeResponse,
  UserAuthCodeDto,
  UserAuthMailDto,
} from './dto/auth-mail.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  transporter: any;
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: this.configService.get<string>('EMAIL_USER'),
        clientId: this.configService.get<string>('EMAIL_CLIENT_ID'),
        clientSecret: this.configService.get<string>('EMAIL_CLIENT_SECRET'),
        refreshToken: this.configService.get<string>('EMAIL_REFRESH_TOKEN'),
      },
    });
  }

  async validateUser(student_id: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByStudentID(student_id);
    if (!user) {
      throw new NotFoundException();
    }
    const match = await bcrypt.compare(pass, user.password);
    if (user && match) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<CreateTokenResponse> {
    const uuid = uuid4();
    const payload = { uuid, sub: user._id };
    const access_token = this.jwtService.sign(payload);
    const expiresIn = parseInt(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    );
    const refresh_token = this.jwtService.sign(payload, { expiresIn });
    this.authRepository.save(uuid, refresh_token, expiresIn);
    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(user: any): Promise<CreateTokenResponse> {
    await this.authRepository.delete(user.uuid);
    return this.login(user);
  }

  async logout(user: any): Promise<void> {
    await this.authRepository.delete(user.uuid);
  }

  async sendAuthorizationEmail(
    userAuthMailDto: UserAuthMailDto,
  ): Promise<void> {
    const existedUser = await this.userRepository.findByEmail(
      userAuthMailDto.email,
    );
    if (existedUser) {
      throw new ConflictException();
    }
    const authCode = this.generateAuthCode();
    this.authRepository.save(
      userAuthMailDto.email,
      authCode,
      this.configService.get<number>('EMAIL_AUTH_EXPIRES_IN'),
    );
    const info = await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: userAuthMailDto.email,
      subject: 'Authrization Code',
      html: `
        <h1> Authrization Code</h1>
        <p>Your authrization code is: </p>
        <p><b>${authCode}</b></p>
        <p> Please enter this code in the app.</p>
      `,
    });
    if (info.accepted.length === 0) {
      throw new BadRequestException('Email not sent.');
    }
  }

  async checkAuthorizationCode(
    userAuthCodeDto: UserAuthCodeDto,
  ): Promise<AuthCodeResponse> {
    const authCode = await this.authRepository.find(userAuthCodeDto.email);
    if (!authCode || userAuthCodeDto.code !== authCode) {
      throw new UnauthorizedException();
    }
    await this.authRepository.delete(userAuthCodeDto.email);
    return {
      disposable_access_token: this.jwtService.sign({
        email: userAuthCodeDto.email,
      }),
    }; //객체로 보내기
  }

  private generateAuthCode(): string {
    return Math.random().toString(10).substring(2, 8);
  }
}
