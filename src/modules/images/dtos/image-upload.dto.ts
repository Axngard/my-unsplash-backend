import { IsArray, IsNotEmpty } from 'class-validator'

export class ImageUploadDto {
  @IsNotEmpty()
  labels: string[]
}
