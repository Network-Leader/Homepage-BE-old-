import {
  BadRequestException,
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

@Injectable()
export class AuthService {
  transporter: any;
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) { }

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
    const refresh_token = this.jwtService.sign(
      payload,
      { expiresIn },
    );
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
}
