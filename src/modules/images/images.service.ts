import debug from 'debug'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { S3 } from 'ibm-cos-sdk'
import { Model } from 'mongoose'
import { ConfigurationConstants } from '../../config/configuration-constants'
import { ImageResponse } from './dtos/image-response.dto'
import { ImageUploadDto } from './dtos/image-upload.dto'
import { ImageInterface } from './interfaces/image'
import { Images, ImagesDocument } from './schemas/images.schema'
import { ImagesListResponse } from './dtos/images-list-response.dto'
import { ImagesReadParams } from './interfaces/image-read-params'

@Injectable()
export class ImagesService {
  private Bucket: S3
  private logger: any

  constructor(
    private configService: ConfigService,
    @InjectModel(Images.name) private imagesModel: Model<ImagesDocument>,
  ) {
    this.bootstrapBucket()
    this.logger = debug('app:images')
  }

  async store(
    image: ImageInterface,
    metadata: ImageUploadDto,
  ): Promise<ImageResponse> {
    const generatedName = `${Date.now()}_${image.originalname}`

    const bucketData = await this.sendToBucket(image, generatedName)
    const databaseData = await this.imagesModel.create({
      url: bucketData,
      labels: metadata.labels,
      username: metadata.username,
      likes: 0,
      views: 0,
      createdAt: Date.now(),
    })

    if (databaseData && bucketData) {
      this.logger(`[INFO] Image saved in DB with id: ${databaseData._id}`)
      const response: ImageResponse = {
        statusCode: 201,
        message: 'image_created',
        imageId: databaseData._id,
        imageUrl: databaseData.url,
      }
      return response
    }

    throw new InternalServerErrorException('image_not_saved')
  }

  async list(imagesParams ?: ImagesReadParams): Promise<ImagesListResponse> {
    const filter = { username: null, labels: null }
    if (imagesParams.username) {
      filter.username = imagesParams.username
    }

    let data = null
    if (!filter.username && filter.labels) {
      data = await this.imagesModel.find(filter.labels)
    }

    if (!filter.labels && filter.username) {
      data = await this.imagesModel.find({ username: filter.username })
    }

    if (!filter.username && !filter.labels) {
      data = await this.paginateResults(imagesParams)
    }

    const response: ImagesListResponse = {
      statusCode: 200,
      message: 'images_list',
      data: data,
    }

    return response
  }

  private async paginateResults(params: ImagesReadParams): Promise<Images[]> {
    return this.imagesModel.find({}).skip(params.page > 0 ? ((params.page - 1) * params.nPerPage): 0).limit(params.nPerPage)
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
    const uploadOptions = {
      Bucket: this.configService.get(
        ConfigurationConstants.STORAGE_BUCKET_NAME,
      ),
      Key: key,
      ContentType: image.mimetype,
      Body: image.buffer,
    }

    const bucketInfo = await this.Bucket.upload(uploadOptions).promise()
    this.logger(
      `[INFO] New image in bucket: ${bucketInfo.Bucket} with url: ${bucketInfo.Location} `,
    )
    return bucketInfo.Location
  }
}
