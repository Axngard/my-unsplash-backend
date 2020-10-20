import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  @Prop({ required: true, minlength: 8 })
  fullName: string;

  @Prop({ unique: true, required: true, minlength: 5 })
  username: string;

  @Prop({ minlength: 8, required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false, default: 0 })
  totalTimeSpent: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
