import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageUploadDto } from './dtos/image-upload.dto'
import { ImagesService } from './images.service'

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: ImageUploadDto) {
    console.log('hola', file)
    return this.imagesService.store(file)
  }
}
