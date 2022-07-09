import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    email: string,
  ): Promise<CreateUserResponse> {
    const existedUser = await this.userRepository.findByStudentID(
      createUserDto.student_id,
    );
    if (existedUser) {
      throw new ConflictException('User already exists');
    }
    if (createUserDto.email !== email) {
      throw new UnauthorizedException('Email is not same with verified email');
    }
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      parseInt(this.configService.get('HASHING_SALT_OF_ROUND')),
    );
    const user = await this.userRepository.create(createUserDto);
    const token = await this.authService.login(user);
    return {
      user,
      token,
    };
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    console.log(id);
    const user = await this.userRepository.findOne(id);
    console.log(user);
    if (!user) {
      throw new NotFoundException("User doesn't exist with id: " + id);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException("User doesn't exist with id: " + id);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const ret = await this.userRepository.remove(id);
    console.log(ret);
    if (!ret) {
      throw new NotFoundException("User doesn't exist with id: " + id);
    }
  }
}
