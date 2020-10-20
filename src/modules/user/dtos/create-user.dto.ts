import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEmail()
  email: string;
}
