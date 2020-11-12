import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToClass } from 'class-transformer'
import { S3 } from 'ibm-cos-sdk'
import { ConfigurationConstants } from '../../config/configuration-constants'
import { ImageResponse } from './dtos/image-response.dto'
import { ImageUploadDto } from './dtos/image-upload.dto'
import { ImageInterface } from './interfaces/image'

@Injectable()
export class ImagesService {
  private Bucket: S3

  constructor(private configService: ConfigService) {
    this.bootstrapBucket()
  }

  async store(
    image: ImageInterface,
    metadata: ImageUploadDto,
  ): Promise<ImageResponse> {
    const storedId = await this.sendToBucket(image)
    console.log(metadata)
    if (storedId) {
      const response = {
        statusCode: 201,
        message: 'image_created',
        imageId: storedId,
      }
      return plainToClass(ImageResponse, response)
    } else {
      throw new InternalServerErrorException('image_not_saved')
    }
  }

  private bootstrapBucket(): void {
    const config = {
      endpoint: this.configService.get(ConfigurationConstants.STORAGE_ENDPOINT),
      apiKeyId: this.configService.get(ConfigurationConstants.STORAGE_APIKEY),
      ibmAuthEndpoint: this.configService.get(
        ConfigurationConstants.STORAGE_AUTHENDPOINT,
      ),
      serviceInstanceId: this.configService.get(
        ConfigurationConstants.STORAGE_INSTANCEID,
      ),
    }
    this.Bucket = new S3(config)
  }

  private async sendToBucket(image: ImageInterface): Promise<string> {
    const key = `${Date.now()}_${image.originalname}`

    await this.Bucket.putObject({
      Bucket: this.configService.get(
        ConfigurationConstants.STORAGE_BUCKET_NAME,
      ),
      Key: key,
      ContentType: image.mimetype,
      Body: image.buffer,
    }).promise()

    return key
  }
}
