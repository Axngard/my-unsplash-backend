import { ApiProperty } from '@nestjs/swagger'

export class InformativeResponseDto {
  @ApiProperty({
    example: 201,
  })
  statusCode: number

  @ApiProperty({
    example: 'informative_response',
  })
  message: string
}
