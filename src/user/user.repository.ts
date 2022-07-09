import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const uuid = uuidv4();
    const createIdUser = { ...createUserDto, id: uuid };
    const createdUser = new this.userModel(createIdUser);

    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async findByStudentID(student_id: string): Promise<User> {
    return this.userModel.findOne({ student_id }).lean().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ id }).lean().exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .lean()
      .exec();
  }

  async remove(id: string): Promise<any> {
    return this.userModel.findByIdAndRemove({ id }).lean().exec();
  }
}
