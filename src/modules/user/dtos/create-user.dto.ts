import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  fullName: string

  @ApiProperty()
  @IsString()
  username: string

  @ApiProperty({
    description:
      'The password must contain a special character, number, capital letter',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty()
  @IsEmail()
  email: string
}
