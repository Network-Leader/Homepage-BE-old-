import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/role.enum';

export type UserDocument = User & Document;

export enum USER_STATUS {
  PENDING = 'Pending',
  UNDERGRAD = 'Undergrad',
  GRADUATE = 'Graduate',
  GUEST = 'Guest',
  ADMIN = 'Admin',
}

@Schema()
export class User {
  @Prop({ required: true })
  student_id: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image_uri: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  github: string;

  @Prop({ required: true })
  position: Array<string>;

  @Prop({ required: true })
  birthday: string;

  @Prop({ required: true, default: USER_STATUS.PENDING })
  status: USER_STATUS;

  @Prop({ required: true })
  roles: Array<Role>;

  @Prop({ required: true, default: false })
  admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
