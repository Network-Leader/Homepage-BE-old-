import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/types/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  student_id: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 'string' })
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

  @Prop({ required: true, default: Role.PENDING })
  role: Role;

  @Prop({ required: true, default: false })
  admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
