import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
