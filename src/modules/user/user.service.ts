import {BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserInterface } from './interfaces/user';
import { InformativeResponseDto } from '../../dtos/informative-response.dto';
import { plainToClass } from 'class-transformer';
import bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  private static SALT = 10;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: UserInterface): Promise<InformativeResponseDto> {
    const searchUsers = await this.userModel.findOne({
      username: userData.username,
    });

    if (searchUsers) {
      throw new ConflictException('user_duplicated');
    }

    const passwordTest = UserService.testPassword(userData.password);

    if (passwordTest) {
      const hashedPassword = await bcrypt.hash(
        userData.password,
        UserService.SALT,
      );

      if (hashedPassword) {
        const user = {
          fullName: userData.fullName,
          username: userData.username,
          password: hashedPassword,
          email: userData.email,
        };

        const userToCreate = new this.userModel(user);
        const userSaved = await userToCreate.save();

        if (userSaved) {
          return plainToClass(InformativeResponseDto, {
            status: 201,
            message: 'user_created',
          });
        }
      }
    }

    throw new BadRequestException('weak_password');
  }

  private static testPassword(password: string): boolean {
    const regexPassword = new RegExp(
      /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/,
      'ig',
    );
    return !!regexPassword.test(password);
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username })
  }
}
