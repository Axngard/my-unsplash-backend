import {
  Controller,
  Post,
  Get,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ImageResponse } from './dtos/image-response.dto'
import { ImagesListResponse } from './dtos/images-list-response.dto'

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ImageUploadDto })
  @ApiCreatedResponse({ type: ImageResponse })
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ImagesListResponse })
  @Get()
  async list(): Promise<ImagesListResponse> {
    return this.imagesService.list()
  }
}
