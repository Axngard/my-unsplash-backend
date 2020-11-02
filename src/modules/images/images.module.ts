import { BadRequestException, Module } from '@nestjs/common'
import { ImagesController } from './images.controller'
import { MulterModule } from '@nestjs/platform-express'
import { ImagesService } from './images.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: `${__dirname}/../uploads`,
      fileFilter: (req, file, cb) => {
        console.log(file)
        console.log(file.mimetype)
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
