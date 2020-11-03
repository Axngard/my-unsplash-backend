import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'ibm-cos-sdk'
import { ConfigurationConstants } from '../../config/configuration-constants'
@Injectable()
export class ImagesService {
  constructor(private configService: ConfigService) {}
  async store(image) {
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
    const bucket = new S3(config)

    try {
      console.log(image)
      const stored = await bucket
        .putObject({
          Bucket: this.configService.get(
            ConfigurationConstants.STORAGE_BUCKET_NAME,
          ),
          Key: `${Date.now()}_${image.originalname}`,
          ContentType: image.mimetype,
          Body: 'testing',
        })
        .promise()
      console.log(stored)
    } catch (err) {
      console.log(err)
    }
  }
}
