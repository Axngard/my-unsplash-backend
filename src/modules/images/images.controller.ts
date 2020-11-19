import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ImageInterceptor } from './interceptors/image.interceptor'
import { ImagesService } from './images.service'
import { ImageUploadDto } from './dtos/image-upload.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'), ImageInterceptor)
  async uploadFile(
    @UploadedFile() image,
    @Body() metadata: ImageUploadDto,
    @Request() req,
  ) {
    // Add information about the user
    metadata.username = req.user.username
    return this.imagesService.store(image, metadata)
  }
}
