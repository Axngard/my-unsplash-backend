import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { plainToClass } from 'class-transformer'
import { S3 } from 'ibm-cos-sdk'
import { Model } from 'mongoose'
import { ConfigurationConstants } from '../../config/configuration-constants'
import { ImageResponse } from './dtos/image-response.dto'
import { ImageUploadDto } from './dtos/image-upload.dto'
import { ImageInterface } from './interfaces/image'
import { Images, ImagesDocument } from './schemas/images.schema'

@Injectable()
export class ImagesService {
  private Bucket: S3

  constructor(
    private configService: ConfigService,
    @InjectModel(Images.name) private imagesModel: Model<ImagesDocument>,
  ) {
    this.bootstrapBucket()
  }

  async store(
    image: ImageInterface,
    metadata: ImageUploadDto,
  ): Promise<ImageResponse> {
    const generatedName = `${Date.now()}_${image.originalname}`

    const databaseId = await this.imagesModel.create({
      repositoryKey: generatedName,
      labels: metadata.labels,
      username: metadata.username,
      likes: 0,
      views: 0,
      createdAt: Date.now(),
    })

    const bucketId = await this.sendToBucket(image, generatedName)

    if (databaseId && bucketId) {
      console.info(`New Image saved with id: ${databaseId.id}`)
      const response = {
        statusCode: 201,
        message: 'image_created',
        imageId: databaseId.id,
      }
      return plainToClass(ImageResponse, response)
    }

    throw new InternalServerErrorException('image_not_saved')
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

  private async sendToBucket(
    image: ImageInterface,
    key: string,
  ): Promise<string> {
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
