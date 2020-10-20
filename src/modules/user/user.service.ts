import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserInterface } from './interfaces/user';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: UserInterface): Promise<User> {
    const userToCreate = new this.userModel(user)
    return userToCreate.save()
  }

}
