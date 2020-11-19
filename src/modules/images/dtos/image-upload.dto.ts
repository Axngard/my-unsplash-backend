import { IsArray, IsNotEmpty } from 'class-validator'

export class ImageUploadDto {
  @IsNotEmpty()
  @IsArray()
  labels: string[]

  username: string
}
