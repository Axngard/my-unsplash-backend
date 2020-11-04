import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator'
export class ImageUploadDto {
  @IsNotEmptyObject()
  file: File
}
