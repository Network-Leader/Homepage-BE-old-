import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto, CreateUserResponse } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import internal from 'stream';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    const existedUser = await this.userRepository.findByStudentID(
      createUserDto.student_id,
    );
    if (existedUser) {
      throw new ConflictException();
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
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<any> {
    return this.userRepository.remove(id);
  }
}
