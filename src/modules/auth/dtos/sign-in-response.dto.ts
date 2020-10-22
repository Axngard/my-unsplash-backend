import { ApiProperty } from '@nestjs/swagger'

export class SignInResponseDto {
  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiProperty()
  accessToken: string
}
