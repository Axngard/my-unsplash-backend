import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignIn } from './interfaces/signin';
import bcrypt = require('bcrypt');
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from './dtos/sign-in-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userData: SignIn): Promise<any> {
    const user = await this.userService.findOne(userData.username);

    if (user) {
      const matchPassword = bcrypt.compare(userData.password, user.password);
      if (matchPassword) {
        return user;
      }
    }

    throw new UnauthorizedException('verify_credentials');
  }

  async signIn(userData: SignIn): Promise<SignInResponseDto> {
    const validUser = await this.validateUser(userData);
    const payload = { userId: validUser._id, username: validUser.username };
    return plainToClass(SignInResponseDto, {
      accessToken: this.jwtService.sign(payload),
      ...payload,
    });
  }
}
