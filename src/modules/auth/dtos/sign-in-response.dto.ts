import { ApiProperty } from '@nestjs/swagger'

export class SignInResponseDto {
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiProperty()
  email: string

  @ApiProperty()
  accessToken: string
}
