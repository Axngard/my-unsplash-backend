import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageInterceptor } from './interceptors/image.interceptor'
import { ImagesService } from './images.service'

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'), ImageInterceptor)
  async uploadFile(@UploadedFile() file) {
    return this.imagesService.store(file)
  }
}
