import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty } from 'class-validator'

export class ImageUploadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  labels: string[]

  username: string

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any
}
