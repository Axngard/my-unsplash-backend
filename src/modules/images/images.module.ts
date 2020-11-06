import { BadRequestException, Module } from '@nestjs/common'
import { ImagesController } from './images.controller'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { ImagesService } from './images.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { Images, ImagesSchema } from './schemas/images.schema'
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Images.name, schema: ImagesSchema }]),
    ConfigModule,
    MulterModule.register({
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        console.log(req)
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new BadRequestException('mimetype_not_allowed'), false)
        }
      },
    }),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
